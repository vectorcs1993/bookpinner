<template>
  <div class="bookshelf-wrapper">
    <div v-if="loading" class="text-center q-py-lg">
      <q-spinner color="#E05F0A" size="3em" />
      <div class="q-mt-sm text-white">Загрузка каталога...</div>
    </div>

    <div v-else class="shelves-container" ref="shelvesContainer">
      <div v-if="shelves.length === 0" class="text-center q-pa-xl">
        <q-icon name="search_off" size="80px" :style="{ color: '#8C3800' }" />
        <div class="text-h6 text-white q-mt-md">Книги не найдены</div>
        <div class="text-subtitle1" style="color: rgba(255,255,255,0.5)">
          Попробуйте изменить параметры поиска
        </div>
      </div>

      <div v-else v-for="(shelf, shelfIndex) in shelves" :key="shelfIndex" class="shelf-row">
        <div class="shelf-content" :style="gridStyle">
          <BookCard v-for="book in shelf" :key="book.id" :book="book" @click="openPreview" />
        </div>
        <div v-if="shelfIndex < shelves.length - 1" class="shelf-divider"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BookCard from './BookCard.vue'

const props = defineProps({
  books: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['bookClick'])

const shelvesContainer = ref(null)
const columnsPerRow = ref(4)
let resizeTimeout = null
let resizeObserver = null

const shelves = computed(() => {
  const perRow = columnsPerRow.value
  const result = []
  for (let i = 0; i < props.books.length; i += perRow) {
    result.push(props.books.slice(i, i + perRow))
  }
  return result
})

const gridStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columnsPerRow.value}, 1fr)`,
    gap: '20px',
    justifyItems: 'center',
    alignItems: 'start',
    width: '100%',
  }
})

const calculateColumns = () => {
  if (!shelvesContainer.value) return 4

  const width = shelvesContainer.value.clientWidth

  let maxBookWidth
  if (width < 480) maxBookWidth = 100
  else if (width < 576) maxBookWidth = 110
  else if (width < 768) maxBookWidth = 130
  else if (width < 992) maxBookWidth = 150
  else if (width < 1200) maxBookWidth = 160
  else if (width < 1440) maxBookWidth = 170
  else maxBookWidth = 180

  const padding = 50
  const gap = 25
  const availableWidth = width - padding
  const columns = Math.floor((availableWidth + gap) / (maxBookWidth + gap))

  return Math.max(1, Math.min(columns, 12))
}

const updateColumns = () => {
  const newColumns = calculateColumns()
  if (columnsPerRow.value !== newColumns) {
    columnsPerRow.value = newColumns
  }
}

const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    updateColumns()
  }, 100)
}

const setupResizeObserver = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      updateColumns()
    }, 100)
  })

  if (shelvesContainer.value) {
    resizeObserver.observe(shelvesContainer.value)
  }

  window.addEventListener('resize', handleResize)
}

const openPreview = (book) => {
  emit('bookClick', book)
}

onMounted(() => {
  nextTick(() => {
    updateColumns()
    setupResizeObserver()
  })
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  window.removeEventListener('resize', handleResize)
  clearTimeout(resizeTimeout)
})
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.bookshelf-wrapper {
  padding: 30px 32px 40px;
  min-height: 400px;
}

.shelves-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: rgba($bg-dark-start, 0.3);
  border-radius: 0;
  border-left: 8px solid rgba($primary-orange, 0.125);
  border-right: 8px solid rgba($primary-orange, 0.125);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba($primary-orange, 0.03);
  overflow: hidden;
}

.shelf-row {
  display: flex;
  flex-direction: column;
  background: rgba($bg-dark-end, 0.15);
  position: relative;

  &:first-child {
    border-top: 8px solid rgba($primary-orange, 0.125);
  }

  &:last-child {
    border-bottom: 8px solid rgba($primary-orange, 0.125);
  }
}

.shelf-content {
  display: flex;
  justify-content: center;
  padding: 20px 25px;
  background: rgba($bg-dark-end, 0.08);
  min-height: 240px;
  position: relative;

  >[style*="display: grid"] {
    justify-content: center !important;
    margin: 0 auto !important;
  }
}

.shelf-divider {
  height: 8px;
  position: relative;
  background: rgba($primary-orange, 0.125);
}

@media (max-width: 1200px) {
  .shelf-content {
    padding: 16px 20px;
    min-height: 220px;
  }

  .bookshelf-wrapper {
    padding: 20px 24px 30px;
  }
}

@media (max-width: 992px) {
  .shelf-content {
    padding: 14px 16px;
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .shelf-content {
    padding: 12px 14px;
    min-height: 180px;
  }

  .bookshelf-wrapper {
    padding: 16px 16px 24px;
  }

  .shelves-container {
    border-left-width: 2px;
    border-right-width: 2px;
  }

  .shelf-row {
    &:first-child {
      border-top-width: 2px;
    }

    &:last-child {
      border-bottom-width: 2px;
    }
  }
}

@media (max-width: 576px) {
  .shelf-content {
    padding: 10px 10px;
    min-height: 160px;
  }
}

@media (max-width: 480px) {
  .shelf-content {
    padding: 8px 8px;
    min-height: 140px;
  }
}
</style>
