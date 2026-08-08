<template>
  <div class="library-page q-pa-md">
    <!-- Верхняя панель -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="row items-center">
          <q-btn flat dense icon="menu" @click="$emit('toggleDrawer')" />
          <span class="page-title q-ml-sm">Моя библиотека</span>
        </div>
      </div>
      <div class="col-auto">
        <q-btn label="Добавить книгу" icon="add" color="orange" flat @click="showAddDialog = true" />
      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters-panel q-mb-md">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-4">
          <q-input v-model="filters.search" placeholder="Поиск по названию или автору..." outlined dense clearable @update:model-value="handleSearch">
            <template #prepend>
              <UIcon name="search" color="orange" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <q-select v-model="filters.author" :options="authorOptions" label="Автор" outlined dense clearable emit-value map-options />
        </div>

        <div class="col-12 col-md-3">
          <q-select v-model="filters.notes" :options="notesOptions" label="Заметки" outlined dense clearable emit-value map-options />
        </div>

        <div class="col-12 col-md-2">
          <q-select v-model="filters.sort" :options="sortOptions" placeholder="Сортировка" outlined dense emit-value map-options />
        </div>
      </div>

      <div class="row items-center q-mt-sm q-gutter-xs">
        <q-btn label="Сбросить" color="orange" flat dense :disable="!hasActiveFilters" @click="resetFilters" />

        <!-- Используем UChip вместо q-chip -->
        <UChip v-for="(filter, key) in activeFilters" :key="key" :label="`${filter.label}: ${filter.value}`" removable color="orange"
          text-color="white" dense @remove="removeFilter(key)" />
      </div>
    </div>

    <!-- Статистика -->
    <div class="row q-gutter-sm q-mb-md">
      <!-- Используем UChip для статистики -->
      <UChip label="Всего книг" icon="menu_book" color="orange" text-color="white" dense>
        <template #append>
          <q-badge color="orange" text-color="white" floating>{{ booksStore.getBooksCount }}</q-badge>
        </template>
      </UChip>

      <UChip label="Найдено" icon="search" color="orange" text-color="white" dense>
        <template #append>
          <q-badge color="orange" text-color="white" floating>{{ filteredBooks.length }}</q-badge>
        </template>
      </UChip>

      <UChip label="С заметками" icon="description" color="orange" text-color="white" dense>
        <template #append>
          <q-badge color="orange" text-color="white" floating>{{ booksStore.getBooksWithNotesCount }}</q-badge>
        </template>
      </UChip>
    </div>

    <!-- Книги -->
    <div v-if="booksStore.loading" class="text-center q-py-lg">
      <q-spinner color="orange" size="3em" />
      <div class="q-mt-sm">Загрузка...</div>
    </div>

    <div v-else-if="filteredBooks.length === 0" class="text-center q-py-lg">
      <q-icon name="search_off" size="80px" color="orange" />
      <div class="text-h6 q-mt-md">Книги не найдены</div>
      <div class="text-subtitle1" style="opacity: 0.5">
        Попробуйте изменить параметры поиска
      </div>
    </div>

    <BookShelf v-else :books="filteredBooks" @book-click="openPreview" />

    <!-- Диалог добавления книги -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">📖 Добавить книгу</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="newBook.title" label="Название *" outlined dense class="q-mb-sm" />
          <q-input v-model="newBook.author" label="Автор *" outlined dense class="q-mb-sm" />
          <q-input v-model="newBook.coverUrl" label="URL обложки" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Отмена" flat color="orange" v-close-popup />
          <q-btn label="Добавить книгу" color="orange" :disable="!newBook.title || !newBook.author" @click="addBook" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Диалог просмотра книги -->
    <q-dialog v-model="previewDialog">
      <q-card v-if="selectedBook" style="min-width: 400px; max-width: 600px;">
        <q-card-section>
          <div class="row">
            <div class="col-12 col-sm-4">
              <q-img :src="selectedBook.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="rounded-borders" />
            </div>
            <div class="col-12 col-sm-8 q-pl-md">
              <div class="text-h6">{{ selectedBook.title }}</div>
              <div class="text-subtitle1 q-mb-md">
                <strong>Автор:</strong> {{ selectedBook.author }}
              </div>

              <q-separator class="q-mb-md" />

              <div class="row items-center q-mb-sm">
                <span class="text-subtitle1">📝 Заметки</span>
                <q-space />
                <q-btn size="sm" color="orange" flat icon="add" @click="addNoteToBook" />
              </div>

              <q-input v-model="newNote" label="Текст заметки" outlined dense class="q-mb-md" @keyup.enter="addNoteToBook" />

              <div v-if="selectedBook.notes.length === 0" class="text-center" style="opacity: 0.5; padding: 20px; font-style: italic;">
                Нет заметок для этой книги
              </div>

              <div v-for="(note, index) in selectedBook.notes" :key="index" class="note-item row items-center">
                <q-icon name="bookmark" color="orange" size="16px" class="q-mr-sm" />
                <span>{{ note }}</span>
                <q-btn icon="delete" size="sm" flat dense color="negative" class="q-ml-auto" @click="deleteNoteFromBook(index)" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Закрыть" flat color="orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useBooksStore } from 'src/stores/books-store'
import { useQuasar } from 'quasar'
import BookShelf from 'src/components/books/BookShelf.vue'
import { UChip } from 'src/components/ui' // Импортируем UChip

const $q = useQuasar()
const booksStore = useBooksStore()

const showAddDialog = ref(false)
const previewDialog = ref(false)
const selectedBook = ref(null)
const newNote = ref('')
const defaultCover = 'https://via.placeholder.com/300x420/8C3800/FFFFFF?text=Нет+обложки'

const filters = reactive({
  search: '',
  author: null,
  notes: null,
  sort: 'title',
})

const newBook = reactive({
  title: '',
  author: '',
  coverUrl: '',
})

const emit = defineEmits(['toggleDrawer'])
let searchTimeout = null

const authorOptions = computed(() => {
  const authors = new Set(booksStore.getBooks.map(book => book.author))
  return Array.from(authors).map(author => ({
    label: author,
    value: author,
  }))
})

const notesOptions = [
  { label: 'Нет заметок', value: 'none' },
  { label: 'Есть заметки', value: 'some' },
  { label: 'Много (3+)', value: 'many' },
]

const sortOptions = [
  { label: 'По названию (А-Я)', value: 'title' },
  { label: 'По названию (Я-А)', value: 'title-desc' },
  { label: 'По автору (А-Я)', value: 'author' },
  { label: 'По автору (Я-А)', value: 'author-desc' },
  { label: 'По заметкам', value: 'notes' },
]

const filteredBooks = computed(() => {
  let result = [...booksStore.getBooks]

  if (filters.search) {
    const query = filters.search.toLowerCase()
    result = result.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    )
  }

  if (filters.author) {
    result = result.filter(book => book.author === filters.author)
  }

  if (filters.notes === 'none') {
    result = result.filter(book => book.notes.length === 0)
  } else if (filters.notes === 'some') {
    result = result.filter(book => book.notes.length > 0)
  } else if (filters.notes === 'many') {
    result = result.filter(book => book.notes.length >= 3)
  }

  switch (filters.sort) {
    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title-desc':
      result.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'author':
      result.sort((a, b) => a.author.localeCompare(b.author))
      break
    case 'author-desc':
      result.sort((a, b) => b.author.localeCompare(a.author))
      break
    case 'notes':
      result.sort((a, b) => b.notes.length - a.notes.length)
      break
  }

  return result
})

const hasActiveFilters = computed(() => {
  return filters.search || filters.author || filters.notes || filters.sort !== 'title'
})

const activeFilters = computed(() => {
  const f = {}

  if (filters.search) f.search = { label: 'Поиск', value: filters.search }
  if (filters.author) f.author = { label: 'Автор', value: filters.author }
  if (filters.notes) {
    const label = notesOptions.find(opt => opt.value === filters.notes)?.label
    f.notes = { label: 'Заметки', value: label }
  }
  if (filters.sort !== 'title') {
    const label = sortOptions.find(opt => opt.value === filters.sort)?.label
    f.sort = { label: 'Сортировка', value: label }
  }

  return f
})

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { }, 500)
}

const resetFilters = () => {
  filters.search = ''
  filters.author = null
  filters.notes = null
  filters.sort = 'title'
}

const removeFilter = (key) => {
  switch (key) {
    case 'search': filters.search = ''; break
    case 'author': filters.author = null; break
    case 'notes': filters.notes = null; break
    case 'sort': filters.sort = 'title'; break
  }
}

const addBook = () => {
  if (!newBook.title || !newBook.author) return
  booksStore.addBook(newBook)
  Object.assign(newBook, { title: '', author: '', coverUrl: '' })
  showAddDialog.value = false
  $q.notify({
    type: 'positive',
    message: 'Книга добавлена!',
    position: 'top'
  })
}

const openPreview = (book) => {
  selectedBook.value = book
  previewDialog.value = true
  newNote.value = ''
}

const addNoteToBook = () => {
  if (!selectedBook.value || !newNote.value.trim()) return
  booksStore.addNote(selectedBook.value.id, newNote.value.trim())
  newNote.value = ''
}

const deleteNoteFromBook = (index) => {
  if (!selectedBook.value) return
  booksStore.deleteNote(selectedBook.value.id, index)
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.library-page {
  min-height: 100vh;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: $text-primary;
}

body.body--light .page-title {
  color: $text-primary-light;
}

.filters-panel {
  padding: 16px;
  border-radius: 8px;
  background: $bg-card;
}

body.body--light .filters-panel {
  background: $bg-card-light;
}

.note-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-left: 4px solid $primary-orange;
  border-radius: 0 8px 8px 0;
  background: rgba($primary-orange, 0.05);
  transition: background 0.2s;

  &:hover {
    background: rgba($primary-orange, 0.1);
  }
}

body.body--light .note-item {
  background: rgba($primary-orange, 0.03);

  &:hover {
    background: rgba($primary-orange, 0.08);
  }
}
</style>
