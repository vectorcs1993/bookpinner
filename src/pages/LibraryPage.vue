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
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-3">
          <q-input v-model="filters.search" placeholder="Поиск..." outlined dense dark class="modern-input" clearable>
            <template v-slot:prepend>
              <q-icon name="search" color="orange" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <q-select v-model="filters.author" :options="authorOptions" placeholder="Автор" outlined dense dark class="modern-input" clearable
            emit-value map-options />
        </div>

        <div class="col-12 col-md-3">
          <q-select v-model="filters.notes" :options="notesOptions" placeholder="Заметки" outlined dense dark class="modern-input" clearable
            emit-value map-options />
        </div>

        <div class="col-12 col-md-3">
          <q-select v-model="filters.sort" :options="sortOptions" placeholder="Сортировка" outlined dense dark class="modern-input" emit-value
            map-options />
        </div>
      </div>

      <div class="row q-mt-sm">
        <div class="col-12">
          <q-btn label="Сбросить фильтры" color="orange" flat dense @click="resetFilters" :disable="!hasActiveFilters" />
        </div>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-row">
      <q-chip dense class="stat-chip">
        <q-avatar color="orange" text-color="white">📚</q-avatar>
        Всего: {{ booksStore.getBooksCount }}
      </q-chip>
      <q-chip dense class="stat-chip">
        <q-avatar color="orange" text-color="white">🔍</q-avatar>
        Найдено: {{ filteredBooks.length }}
      </q-chip>
      <q-chip dense class="stat-chip">
        <q-avatar color="orange" text-color="white">📝</q-avatar>
        С заметками: {{ booksStore.getBooksWithNotesCount }}
      </q-chip>
    </div>

    <!-- Книги -->
    <div class="books-grid">
      <div v-if="booksStore.loading" class="text-center q-py-lg">
        <q-spinner color="orange" size="3em" />
        <div class="q-mt-sm text-white">Загрузка...</div>
      </div>

      <div v-else-if="filteredBooks.length === 0" class="text-center q-pa-xl">
        <q-icon name="search_off" size="80px" color="orange" />
        <div class="text-h6 text-white q-mt-md">Книги не найдены</div>
      </div>

      <div v-else class="row q-col-gutter-md">
        <div v-for="book in filteredBooks" :key="book.id" class="col-6 col-sm-4 col-md-3 col-lg-2">
          <div class="book-card" @click="openPreview(book)">
            <q-img :src="book.coverUrl || defaultCover" :ratio="3 / 4" fit="cover" class="rounded-borders">
              <div class="book-overlay">
                <div class="book-title">{{ book.title }}</div>
                <div class="book-author">{{ book.author }}</div>
                <q-badge color="orange" floating>
                  {{ book.notes.length }}
                  <q-icon name="description" size="12px" />
                </q-badge>
              </div>
            </q-img>
          </div>
        </div>
      </div>
    </div>

    <!-- Диалоги -->
    <q-dialog v-model="showAddDialog">
      <q-card dark class="q-pa-md" style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">📖 Добавить книгу</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newBook.title" label="Название *" outlined dark class="q-mb-sm" />
          <q-input v-model="newBook.author" label="Автор *" outlined dark class="q-mb-sm" />
          <q-input v-model="newBook.coverUrl" label="URL обложки" outlined dark />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Отмена" color="white" flat v-close-popup />
          <q-btn label="Добавить" color="orange" @click="addBook" :disable="!newBook.title || !newBook.author" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="previewDialog">
      <q-card v-if="selectedBook" dark class="q-pa-md" style="min-width: 400px; max-width: 600px;">
        <q-card-section class="row">
          <div class="col-4">
            <q-img :src="selectedBook.coverUrl || defaultCover" :ratio="3 / 4" fit="cover" class="rounded-borders" />
          </div>
          <div class="col-8 q-pl-md">
            <div class="text-h6">{{ selectedBook.title }}</div>
            <div class="text-subtitle1 q-mb-md">{{ selectedBook.author }}</div>

            <q-separator class="q-mb-md" />

            <div class="row items-center q-mb-sm">
              <span class="text-subtitle1">📝 Заметки</span>
              <q-space />
              <q-btn size="sm" color="orange" flat icon="add" @click="addNoteToBook" />
            </div>

            <q-input v-model="newNote" label="Новая заметка" outlined dense dark class="q-mb-md" @keyup.enter="addNoteToBook" />

            <div v-if="selectedBook.notes.length === 0" class="text-center text-grey">
              Нет заметок
            </div>

            <div v-for="(note, index) in selectedBook.notes" :key="index" class="note-item">
              <q-icon name="bookmark" color="orange" size="16px" class="q-mr-sm" />
              {{ note }}
              <q-btn icon="close" size="xs" flat dense color="red" class="q-ml-auto" @click="deleteNoteFromBook(index)" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Закрыть" color="white" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useBooksStore } from 'src/stores/books-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const booksStore = useBooksStore()

// Состояние
const showAddDialog = ref(false)
const previewDialog = ref(false)
const selectedBook = ref(null)
const newNote = ref('')
const defaultCover = 'https://via.placeholder.com/300x400/2a1c14/FFFFFF?text=Нет+обложки'

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

// Эмит для управления drawer
const emit = defineEmits(['toggleDrawer'])

// Опции
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

// Фильтрация
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

// Методы
const resetFilters = () => {
  filters.search = ''
  filters.author = null
  filters.notes = null
  filters.sort = 'title'
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
}

.filters-panel {
  padding: 16px 32px;
  border-bottom: 1px solid rgba($primary-orange, 0.05);
}

.stats-row {
  display: flex;
  gap: 12px;
  padding: 12px 32px;
  border-bottom: 1px solid rgba($primary-orange, 0.05);
}

.stat-chip {
  background: $bg-card !important;
  color: $text-primary !important;
}

.books-grid {
  padding: 24px 32px;
}

.book-card {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    z-index: 10;
  }
}

.book-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0 0 8px 8px;

  .book-card:hover & {
    opacity: 1;
  }
}

.book-title {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.book-author {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.note-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: $bg-card;
  border-left: 3px solid $primary-orange;
  border-radius: 4px;
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
    flex-wrap: wrap;
  }

  .books-grid {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }
}
</style>
