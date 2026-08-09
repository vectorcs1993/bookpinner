<template>
  <div class="library-page q-pa-md">
    <div class="filters-panel q-mb-md">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-4">
          <UInput v-model="filters.search" placeholder="Поиск по названию или автору..." dense clearable :dark="$q.dark.isActive"
            @update:model-value="handleSearch">
            <template #prepend>
              <q-icon name="search" color="primary" />
            </template>
          </UInput>
        </div>

        <div class="col-12 col-md-3">
          <USelect v-model="filters.author" :options="authorOptions" label="Автор" dense clearable emit-value map-options :dark="$q.dark.isActive" />
        </div>

        <div class="col-12 col-md-3">
          <USelect v-model="filters.notes" :options="notesOptions" label="Заметки" dense clearable emit-value map-options :dark="$q.dark.isActive" />
        </div>

        <div class="col-12 col-md-2">
          <USelect v-model="filters.sort" :options="sortOptions" placeholder="Сортировка" dense emit-value map-options :dark="$q.dark.isActive" />
        </div>
      </div>

      <div class="row items-center q-mt-sm q-gutter-xs">
        <UButton v-if="hasActiveFilters" label="Сбросить" icon="clear" variant="flat" size="sm" :dark="$q.dark.isActive" @click="resetFilters" />
        <UChip v-for="(filter, key) in activeFilters" :key="key" :label="`${filter.label}: ${filter.value}`" icon="search" removable color="primary"
          text-color="white" size="sm" :dark="$q.dark.isActive" @remove="removeFilter(key)" />
      </div>
    </div>

    <div class="filters-panel q-mb-md">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-4">
          <UButton label="Добавить книгу" icon="add" variant="primary" :dark="$q.dark.isActive" @click="showAddDialog = true" />
        </div>
        <div class="col-12 col-md-8">
          <div class="row q-gutter-sm justify-end">
            <UChip color="primary" text-color="white" :dark="$q.dark.isActive">
              <q-icon name="menu_book" size="18px" class="q-mr-xs" />
              Всего: <strong class="q-ml-xs">{{ booksStore.getBooksCount }}</strong>
            </UChip>
            <UChip color="primary" text-color="white" :dark="$q.dark.isActive">
              <q-icon name="search" size="18px" class="q-mr-xs" />
              Найдено: <strong class="q-ml-xs">{{ filteredBooks.length }}</strong>
            </UChip>
            <UChip color="primary" text-color="white" :dark="$q.dark.isActive">
              <q-icon name="description" size="18px" class="q-mr-xs" />
              С заметками: <strong class="q-ml-xs">{{ booksStore.getBooksWithNotesCount }}</strong>
            </UChip>
          </div>
        </div>
      </div>
    </div>

    <div v-if="booksStore.loading" class="text-center q-py-lg">
      <USpinner size="3em" text="Загрузка..." :dark="$q.dark.isActive" />
    </div>

    <div v-else-if="filteredBooks.length === 0" class="text-center q-py-lg">
      <q-icon name="search_off" size="80px" color="primary" />
      <div class="text-h6 q-mt-md">Книги не найдены</div>
      <div class="text-subtitle1" style="opacity: 0.5">
        Попробуйте изменить параметры поиска
      </div>
    </div>

    <BookShelf v-else :books="filteredBooks" @book-click="openPreview" />

    <UDialog v-model="showAddDialog" title="📖 Добавить книгу" :dark="$q.dark.isActive">
      <div class="add-book-form">
        <UInput v-model="newBook.title" label="Название *" dense class="q-mb-md" :dark="$q.dark.isActive" />
        <UInput v-model="newBook.author" label="Автор *" dense class="q-mb-md" :dark="$q.dark.isActive" />
        <UInput v-model="newBook.coverUrl" label="URL обложки" dense class="q-mb-md" placeholder="https://example.com/cover.jpg"
          :dark="$q.dark.isActive" />

        <div v-if="newBook.coverUrl" class="cover-preview">
          <q-img :src="newBook.coverUrl" :ratio="5 / 7" fit="cover" style="max-width: 120px; border-radius: 8px;" />
        </div>
      </div>

      <template #actions>
        <UButton label="Отмена" icon="close" variant="ghost" :dark="$q.dark.isActive" @click="showAddDialog = false" />
        <UButton label="Добавить книгу" icon="add" variant="primary" :dark="$q.dark.isActive" :disabled="!newBook.title || !newBook.author"
          @click="addBook" />
      </template>
    </UDialog>

    <BookPreviewDialog v-model="previewDialog" :book="selectedBook" @addNote="addNoteToBook" @deleteNote="deleteNoteFromBook" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useBooksStore } from 'src/stores/books-store'
import BookShelf from 'src/components/books/BookShelf.vue'
import BookPreviewDialog from 'src/components/books/BookPreviewDialog.vue'
import { UButton, UChip, UDialog, UInput, USelect, USpinner } from 'src/components/ui'

const $q = useQuasar()
const booksStore = useBooksStore()

const showAddDialog = ref(false)
const previewDialog = ref(false)
const selectedBook = ref(null)

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

const handleSearch = () => { }

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
}

const addNoteToBook = (bookId, note) => {
  booksStore.addNote(bookId, note)
}

const deleteNoteFromBook = (bookId, index) => {
  booksStore.deleteNote(bookId, index)
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.library-page {
  min-height: 100vh;
}

.filters-panel {
  padding: 16px;
  border-radius: $radius-sm;
  background: $bg-card;
}

body.body--light .filters-panel {
  background: $bg-card-light;
}

.add-book-form {
  min-width: 450px;
  padding: 8px 0;

  .cover-preview {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .add-book-form {
    min-width: unset;
  }
}
</style>
