<template>
  <div class="shelves-page q-pa-md">
    <div class="filters-panel q-mb-md">
      <div class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md-4">
          <UInput v-model="newShelfName" placeholder="Название новой полки..." dense clearable :dark="$q.dark.isActive" @keyup.enter="createShelf">
            <template #prepend>
              <q-icon name="shelves" color="primary" />
            </template>
          </UInput>
        </div>
        <div class="col-12 col-md-auto">
          <UButton label="Создать полку" icon="add" color="primary" rounded :disabled="!newShelfName.trim()" @click="createShelf" />
        </div>
      </div>
    </div>

    <div class="filters-panel q-mb-md">
      <div class="row q-gutter-sm">
        <UChip color="primary" text-color="white" :dark="$q.dark.isActive">
          <q-icon name="shelves" size="18px" class="q-mr-xs" />
          Всего полок: <strong class="q-ml-xs">{{ shelvesStore.getShelvesCount }}</strong>
        </UChip>
        <UChip color="primary" text-color="white" :dark="$q.dark.isActive">
          <q-icon name="menu_book" size="18px" class="q-mr-xs" />
          Всего книг: <strong class="q-ml-xs">{{ totalBooksInShelves }}</strong>
        </UChip>
      </div>
    </div>

    <div v-if="shelvesStore.loading" class="text-center q-py-lg">
      <USpinner size="3em" text="Загрузка полок..." :dark="$q.dark.isActive" />
    </div>

    <div v-else-if="shelvesStore.getShelves.length === 0" class="text-center q-py-lg">
      <q-icon name="shelves" size="80px" color="primary" />
      <div class="text-h6 q-mt-md">У вас пока нет полок</div>
      <div class="text-subtitle1" style="opacity: 0.5">
        Создайте первую полку, чтобы организовать книги
      </div>
    </div>

    <div v-else class="shelves-grid">
      <div v-for="shelf in shelvesStore.getShelves" :key="shelf.id" class="shelf-card">
        <q-card class="shelf-card-inner" @click="openShelf(shelf)">
          <q-card-section class="shelf-card-header">
            <div class="row items-center">
              <div class="col">
                <div class="shelf-name">{{ shelf.name }}</div>
                <div class="shelf-meta">
                  <q-icon name="menu_book" size="14px" />
                  {{ shelf.books.length }} книг
                  <span class="q-ml-sm">
                    <q-icon name="description" size="14px" />
                    {{ shelfBooksNotesCount(shelf) }} заметок
                  </span>
                </div>
              </div>
              <UButton icon="delete" color="primary" size="sm" rounded @click.stop="deleteShelf(shelf.id)" />
            </div>
          </q-card-section>

          <q-card-section class="shelf-books-preview">
            <div class="row q-col-gutter-xs">
              <div v-for="book in shelf.books.slice(0, 6)" :key="book.id" class="col-2">
                <q-img :src="book.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="shelf-book-thumb" />
              </div>
              <div v-if="shelf.books.length > 6" class="col-2 shelf-more">
                <div class="shelf-more-text">+{{ shelf.books.length - 6 }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <UDialog v-model="shelfDialogVisible" :title="`📚 ${selectedShelf?.name || ''}`" :dark="$q.dark.isActive">
      <div v-if="selectedShelf" class="shelf-dialog-content">
        <div class="row items-center q-mb-md">
          <div class="col">
            <div class="text-subtitle1">Книги на полке: {{ selectedShelf.books.length }}</div>
          </div>
          <UButton label="Добавить книгу" icon="add" color="primary" rounded size="sm" @click="showAddToShelf = true" />
        </div>

        <div v-if="selectedShelf.books.length === 0" class="empty-state text-center">
          На этой полке пока нет книг
        </div>

        <div v-else class="shelf-books-list">
          <div v-for="book in selectedShelf.books" :key="book.id" class="shelf-book-item row items-center">
            <div class="col-1">
              <q-img :src="book.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="shelf-book-thumb-small" />
            </div>
            <div class="col">
              <div class="text-weight-medium">{{ book.title }}</div>
              <div class="text-caption" style="opacity: 0.6">{{ book.author }}</div>
            </div>
            <div>
              <UButton icon="close" flat size="sm" rounded @click="removeBookFromShelf(book.id)" />
            </div>
          </div>
        </div>
      </div>

      <template #actions>
        <UButton label="Закрыть" color="negative" rounded @click="shelfDialogVisible = false" />
      </template>
    </UDialog>

    <UDialog v-model="showAddToShelf" title="Добавить книгу на полку" :dark="$q.dark.isActive">
      <div class="add-to-shelf-form">
        <USelect v-model="selectedBookForShelf" :options="availableBooksOptions" label="Выберите книгу" dense placeholder="Книга..." emit-value
          map-options :dark="$q.dark.isActive" />
      </div>

      <template #actions>
        <UButton label="Отмена" color="ghost" rounded @click="showAddToShelf = false" />
        <UButton label="Добавить" color="primary" rounded :disabled="!selectedBookForShelf" @click="addBookToShelf" />
      </template>
    </UDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useShelvesStore } from 'src/stores/shelves-store'
import { useBooksStore } from 'src/stores/books-store'
import { UButton, UDialog, UInput, USelect, UChip, USpinner } from 'src/components/ui'

const $q = useQuasar()
const shelvesStore = useShelvesStore()
const booksStore = useBooksStore()

const newShelfName = ref('')
const shelfDialogVisible = ref(false)
const selectedShelf = ref(null)
const showAddToShelf = ref(false)
const selectedBookForShelf = ref(null)

const defaultCover = 'https://via.placeholder.com/60x84/8C3800/FFFFFF?text=Нет+обложки'

const totalBooksInShelves = computed(() => {
  return shelvesStore.getShelves.reduce((total, shelf) => total + shelf.books.length, 0)
})

const availableBooksOptions = computed(() => {
  const shelfBookIds = new Set(selectedShelf.value?.books.map(b => b.id) || [])
  return booksStore.getBooks
    .filter(book => !shelfBookIds.has(book.id))
    .map(book => ({
      label: `${book.title} — ${book.author}`,
      value: book.id,
    }))
})

const shelfBooksNotesCount = (shelf) => {
  return shelf.books.reduce((total, book) => total + (book.notes?.length || 0), 0)
}

const createShelf = () => {
  if (!newShelfName.value.trim()) return
  shelvesStore.addShelf(newShelfName.value.trim())
  newShelfName.value = ''
  $q.notify({
    type: 'positive',
    message: 'Полка создана!',
    position: 'top'
  })
}

const deleteShelf = (shelfId) => {
  $q.dialog({
    title: 'Удалить полку?',
    message: 'Книги не будут удалены из библиотеки.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    shelvesStore.deleteShelf(shelfId)
    $q.notify({
      type: 'positive',
      message: 'Полка удалена',
      position: 'top'
    })
  })
}

const openShelf = (shelf) => {
  selectedShelf.value = shelf
  shelfDialogVisible.value = true
}

const addBookToShelf = () => {
  if (!selectedShelf.value || !selectedBookForShelf.value) return
  const book = booksStore.getBookById(selectedBookForShelf.value)
  if (book) {
    shelvesStore.addBookToShelf(selectedShelf.value.id, book)
    $q.notify({
      type: 'positive',
      message: 'Книга добавлена на полку!',
      position: 'top'
    })
    selectedBookForShelf.value = null
    showAddToShelf.value = false
  }
}

const removeBookFromShelf = (bookId) => {
  if (!selectedShelf.value) return
  shelvesStore.removeBookFromShelf(selectedShelf.value.id, bookId)
  $q.notify({
    type: 'positive',
    message: 'Книга удалена с полки',
    position: 'top'
  })
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.shelves-page {
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

.shelves-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 8px 0;
}

.shelf-card {
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &-inner {
    background: $bg-card;
    border-radius: $radius-md;
    overflow: hidden;
    border: 1px solid rgba($primary, 0.1);
  }
}

body.body--light .shelf-card-inner {
  background: $bg-card-light;
  border-color: rgba($primary, 0.05);
}

.shelf-card-header {
  padding: 16px !important;
}

.shelf-name {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
}

body.body--light .shelf-name {
  color: $text-primary-light;
}

.shelf-meta {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 4px;
  color: $text-muted;
}

body.body--light .shelf-meta {
  color: $text-muted-light;
}

.shelf-books-preview {
  padding: 8px 16px 16px !important;
}

.shelf-book-thumb {
  border-radius: 4px;
  width: 100%;
  aspect-ratio: 5/7;
  object-fit: cover;
}

.shelf-more {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 5/7;
  background: rgba($primary, 0.1);
  border-radius: 4px;
}

.shelf-more-text {
  font-size: 14px;
  font-weight: 600;
  color: $primary;
}

.shelf-dialog-content {
  min-width: 400px;
  max-height: 50vh;
  overflow-y: auto;
}

.shelf-books-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shelf-book-item {
  padding: 8px 12px;
  border-radius: $radius-sm;
  background: rgba($primary, 0.05);
  transition: background 0.2s;

  &:hover {
    background: rgba($primary, 0.1);
  }
}

.shelf-book-thumb-small {
  width: 40px;
  border-radius: 4px;
}

.empty-state {
  padding: 30px 20px;
  opacity: 0.6;
  font-style: italic;
  color: $text-muted;
}

.add-to-shelf-form {
  min-width: 350px;
  padding: 8px 0;
}

@media (max-width: 768px) {
  .shelves-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }

  .shelf-dialog-content {
    min-width: unset;
  }

  .add-to-shelf-form {
    min-width: unset;
  }
}

@media (max-width: 480px) {
  .shelves-grid {
    grid-template-columns: 1fr;
  }
}
</style>
