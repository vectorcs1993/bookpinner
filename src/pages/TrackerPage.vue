<template>
  <div class="tracker-page q-pa-md">
    <div class="filters-panel q-mb-md">
      <div class="row items-center q-col-gutter-sm">
        <div class="col-auto">
          <UChip color="primary" text-color="white" :dark="$q.dark.isActive">
            <q-icon name="menu_book" size="18px" class="q-mr-xs" />
            В трекере: <strong class="q-ml-xs">{{ trackerStore.cards.length }}</strong>
          </UChip>
        </div>
        <div class="col-auto">
          <UChip color="primary" text-color="white" :dark="$q.dark.isActive">
            <q-icon name="schedule" size="18px" class="q-mr-xs" />
            Время чтения: <strong class="q-ml-xs">{{ totalTimeLabel }}</strong>
          </UChip>
        </div>
        <div class="col-auto">
          <UChip color="primary" text-color="white" :dark="$q.dark.isActive">
            <q-icon name="check_circle" size="18px" class="q-mr-xs" />
            Прочитано: <strong class="q-ml-xs">{{ finishedCount }}</strong>
          </UChip>
        </div>

        <q-space />

        <div class="col-auto">
          <UButton label="Новая колонка" icon="view_column" flat rounded @click="showAddColumn = true" />
        </div>
        <div class="col-auto">
          <UButton label="Добавить книгу" icon="add" color="primary" rounded @click="openAddBook()" />
        </div>
      </div>
    </div>

    <div v-if="columns.length === 0" class="text-center q-py-lg">
      <q-icon name="view_column" size="80px" color="primary" />
      <div class="text-h6 q-mt-md">Нет колонок</div>
      <div class="text-subtitle1" style="opacity: 0.5">Создайте первую колонку, чтобы начать трекинг</div>
    </div>

    <div v-else class="tracker-board">
      <TrackerColumn v-for="col in columns" :key="col.id" :column="col" :items="cardsByColumn(col.id)" @add-book="openAddBook" @rename="handleRename"
        @move="handleMove" @delete="handleDeleteColumn" @open-card="handleOpenCard" @remove-card="handleRemoveCard" @drop-card="handleDropCard" />
    </div>

    <AddBookToTrackerDialog v-model="showAddBook" :available-books="availableBooks" :columns="columns" :default-column-id="addBookColumnId"
      @add="handleAddBook" />

    <TrackerCardDialog v-model="showCardDialog" :card="selectedCard" :book="selectedBook" :columns="columns"
      @update-rating="(id, val) => trackerStore.updateCardRating(id, val)" @update-progress="(id, val) => trackerStore.updateCardProgress(id, val)"
      @update-notes="(id, val) => trackerStore.updateCardNotes(id, val)" @start-timer="(id) => trackerStore.startTimer(id)"
      @stop-timer="(id) => trackerStore.stopTimer(id)" @add-time="(id, minutes) => trackerStore.addManualTime(id, minutes)"
      @move-column="(id, colId) => trackerStore.moveCard(id, colId)" @remove="handleRemoveCard" />

    <UDialog v-model="showAddColumn" title="Новая колонка" :dark="$q.dark.isActive">
      <UInput v-model="newColumnTitle" label="Название колонки" dense @keyup.enter="createColumn" />
      <template #actions>
        <UButton label="Отмена" flat rounded @click="showAddColumn = false" />
        <UButton label="Создать" color="primary" rounded :disabled="!newColumnTitle.trim()" @click="createColumn" />
      </template>
    </UDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useTrackerStore } from 'src/stores/tracker-store'
import { useBooksStore } from 'src/stores/books-store'
import TrackerColumn from 'src/components/tracker/TrackerColumn.vue'
import TrackerCardDialog from 'src/components/tracker/TrackerCardDialog.vue'
import AddBookToTrackerDialog from 'src/components/tracker/AddBookToTrackerDialog.vue'
import { UButton, UChip, UDialog, UInput } from 'src/components/ui'

const $q = useQuasar()
const trackerStore = useTrackerStore()
const booksStore = useBooksStore()

const columns = computed(() => trackerStore.getColumns)

const cardsByColumn = (columnId) => {
  return trackerStore.getCardsByColumn(columnId).map(card => ({
    card,
    book: booksStore.getBookById(card.bookId),
  }))
}

const availableBooks = computed(() => {
  const tracked = trackerStore.getTrackedBookIds
  return booksStore.getBooks.filter(b => !tracked.has(b.id))
})

const totalTimeLabel = computed(() => {
  const total = trackerStore.getTotalTimeSpent
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}ч ${m}м` : `${m}м`
})

const finishedCount = computed(() => {
  const lastCol = columns.value[columns.value.length - 1]
  if (!lastCol) return 0
  return trackerStore.getCardsByColumn(lastCol.id).length
})

// Диалог добавления книги
const showAddBook = ref(false)
const addBookColumnId = ref('')
const openAddBook = (columnId) => {
  addBookColumnId.value = columnId || columns.value[0]?.id || ''
  showAddBook.value = true
}
const handleAddBook = (bookId, columnId) => {
  trackerStore.addBookToTracker(bookId, columnId)
  $q.notify({ type: 'positive', message: 'Книга добавлена в трекер!', position: 'top' })
}

// Диалог карточки
const showCardDialog = ref(false)
const selectedCardId = ref(null)
const selectedCard = computed(() => trackerStore.getCardById(selectedCardId.value))
const selectedBook = computed(() => selectedCard.value ? booksStore.getBookById(selectedCard.value.bookId) : null)

const handleOpenCard = (cardId) => {
  selectedCardId.value = cardId
  showCardDialog.value = true
}

const handleRemoveCard = (cardId) => {
  $q.dialog({
    title: 'Удалить книгу из трекера?',
    message: 'Прогресс, время чтения и заметки будут удалены.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    trackerStore.removeCard(cardId)
    showCardDialog.value = false
    $q.notify({ type: 'positive', message: 'Удалено из трекера', position: 'top' })
  })
}

const handleDropCard = (cardId, columnId) => {
  trackerStore.moveCard(cardId, columnId)
}

// Колонки
const showAddColumn = ref(false)
const newColumnTitle = ref('')
const createColumn = () => {
  if (!newColumnTitle.value.trim()) return
  trackerStore.addColumn(newColumnTitle.value.trim())
  newColumnTitle.value = ''
  showAddColumn.value = false
}

const handleRename = (columnId, title) => {
  if (!title || !title.trim()) return
  trackerStore.updateColumn(columnId, { title: title.trim() })
}

const handleMove = (columnId, direction) => {
  trackerStore.moveColumn(columnId, direction)
}

const handleDeleteColumn = (columnId) => {
  if (trackerStore.columns.length <= 1) {
    $q.notify({ type: 'warning', message: 'Должна остаться хотя бы одна колонка', position: 'top' })
    return
  }
  $q.dialog({
    title: 'Удалить колонку?',
    message: 'Книги из этой колонки будут перемещены в первую колонку.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    trackerStore.deleteColumn(columnId)
  })
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.tracker-page {
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

.tracker-board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 12px;
  align-items: flex-start;
}
</style>
