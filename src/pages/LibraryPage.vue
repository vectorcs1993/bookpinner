<template>
  <div class="library-page">
    <!-- Верхняя панель -->
    <div class="top-bar">
      <div class="top-bar-left">
        <q-btn flat dense icon="menu" color="orange" @click="$emit('toggleDrawer')" />
        <span class="page-title">Моя библиотека</span>
      </div>
      <div class="top-bar-right">
        <q-btn label="Добавить книгу" icon="add" color="orange" flat @click="showAddDialog = true" />
      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters-panel">
      <div class="filters-grid">
        <q-input v-model="filters.search" placeholder="Поиск по названию или автору..." outlined dense dark clearable
          @update:model-value="handleSearch">
          <template v-slot:prepend>
            <q-icon name="search" color="orange" />
          </template>
        </q-input>

        <q-select v-model="filters.author" :options="authorOptions" placeholder="Автор" outlined dense dark clearable emit-value map-options
          popup-content-class="dark-menu" />

        <q-select v-model="filters.notes" :options="notesOptions" placeholder="Заметки" outlined dense dark clearable emit-value map-options
          popup-content-class="dark-menu" />

        <q-select v-model="filters.sort" :options="sortOptions" placeholder="Сортировка" outlined dense dark emit-value map-options
          popup-content-class="dark-menu" />
      </div>

      <div class="filters-actions">
        <q-btn label="Сбросить" color="orange" flat dense :disable="!hasActiveFilters" @click="resetFilters" />
        <q-chip v-for="(filter, key) in activeFilters" :key="key" removable @remove="removeFilter(key)" class="chip-orange" dense>
          {{ filter.label }}: {{ filter.value }}
        </q-chip>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-row">
      <q-chip dense class="chip-orange">
        <q-avatar color="orange" text-color="white" icon="menu_book" />
        Всего: {{ booksStore.getBooksCount }}
      </q-chip>
      <q-chip dense class="chip-orange">
        <q-avatar color="orange" text-color="white" icon="search" />
        Найдено: {{ filteredBooks.length }}
      </q-chip>
      <q-chip dense class="chip-orange">
        <q-avatar color="orange" text-color="white" icon="description" />
        С заметками: {{ booksStore.getBooksWithNotesCount }}
      </q-chip>
    </div>

    <!-- Книги -->
    <div class="books-grid">
      <div v-if="booksStore.loading" class="text-center q-py-lg">
        <q-spinner color="orange" size="3em" />
        <div class="q-mt-sm text-white">Загрузка...</div>
      </div>

      <div v-else-if="filteredBooks.length === 0" class="empty-state">
        <q-icon name="search_off" size="80px" color="#8C3800" />
        <div class="text-h6 text-white q-mt-md">Книги не найдены</div>
        <div class="text-subtitle1" style="color: rgba(255,255,255,0.5)">
          Попробуйте изменить параметры поиска
        </div>
      </div>

      <BookShelf v-else :books="filteredBooks" @book-click="openPreview" />
    </div>

    <!-- Диалог добавления книги -->
    <q-dialog v-model="showAddDialog">
      <q-card class="q-pa-md" style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6" style="font-weight: 300;">📖 Добавить книгу</div>
        </q-card-section>

        <q-separator :style="{ backgroundColor: 'rgba(140, 56, 0, 0.2)' }" />

        <q-card-section>
          <q-input v-model="newBook.title" label="Название *" outlined dense dark class="q-mb-sm" />
          <q-input v-model="newBook.author" label="Автор *" outlined dense dark class="q-mb-sm" />
          <q-input v-model="newBook.coverUrl" label="URL обложки" outlined dense dark />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Отмена" flat color="orange" v-close-popup />
          <q-btn label="Добавить книгу" color="primary" :disable="!newBook.title || !newBook.author" @click="addBook" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Диалог просмотра книги -->
    <q-dialog v-model="previewDialog">
      <q-card v-if="selectedBook" class="q-pa-md" style="min-width: 400px; max-width: 600px;">
        <q-card-section class="row">
          <div class="col-12 col-sm-4">
            <q-img :src="selectedBook.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="rounded-borders"
              style="border: 2px solid rgba(140, 56, 0, 0.4);" />
          </div>
          <div class="col-12 col-sm-8 q-pl-md">
            <div class="text-h6" style="font-weight: 300;">{{ selectedBook.title }}</div>
            <div class="text-subtitle1 q-mb-md"><strong>Автор:</strong> {{ selectedBook.author }}</div>

            <q-separator :style="{ backgroundColor: 'rgba(140, 56, 0, 0.4)' }" class="q-mb-md" />

            <div class="row items-center q-mb-sm">
              <span class="text-subtitle1" style="font-weight: 300;">📝 Заметки</span>
              <q-space />
              <q-btn size="sm" color="orange" flat icon="add" @click="addNoteToBook" />
            </div>

            <q-input v-model="newNote" label="Текст заметки" outlined dense dark class="q-mb-md" @keyup.enter="addNoteToBook" />

            <div v-if="selectedBook.notes.length === 0" class="text-center" style="color: rgba(255,255,255,0.5); padding: 20px; font-style: italic;">
              Нет заметок для этой книги
            </div>

            <div v-for="(note, index) in selectedBook.notes" :key="index" class="note-item">
              <q-icon name="bookmark" color="orange" size="16px" class="q-mr-sm" />
              <span class="text-white">{{ note }}</span>
              <q-btn icon="delete" size="sm" flat dense color="negative" class="q-ml-auto" @click="deleteNoteFromBook(index)" />
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
  searchTimeout = setTimeout(() => {
    // search уже обновился через v-model
  }, 500)
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

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid $border-color;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: -0.5px;
}

.filters-panel {
  padding: 16px 32px 12px;
  border-bottom: 1px solid rgba($primary-orange, 0.05);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.filters-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 32px;
  border-bottom: 1px solid rgba($primary-orange, 0.05);
}

.books-grid {
  padding: 24px 32px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.note-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: $bg-card;
  border-left: 4px solid $primary-orange;
  border-radius: 0 $radius-sm $radius-sm 0;
  transition: background 0.2s;

  &:hover {
    background: $bg-card-hover;
  }
}

@media (max-width: 768px) {
  .top-bar {
    padding: 12px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .top-bar-right {
    width: 100%;
  }

  .filters-panel {
    padding: 12px 16px;
  }

  .stats-row {
    padding: 8px 16px;
  }

  .books-grid {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }
}
</style>
