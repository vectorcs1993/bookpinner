<template>
  <div class="bookshelf-wrapper">
    <div v-if="loading" class="text-center q-py-lg">
      <USpinner size="3em" text="Загрузка каталога..." :dark="$q.dark.isActive" />
    </div>

    <div v-else class="shelves-container">
      <div v-if="books.length === 0" class="text-center q-py-lg">
        <q-icon name="search_off" size="80px" color="primary" />
        <div class="text-h6 q-mt-md">Книги не найдены</div>
        <div class="text-subtitle1" style="opacity: 0.5">
          Попробуйте изменить параметры поиска
        </div>
      </div>

      <div v-else v-for="(shelf, shelfIndex) in shelves" :key="shelfIndex" class="shelf-row">
        <div class="shelf-content">
          <div class="books-grid" :style="gridStyle">
            <BookCard v-for="book in shelf" :key="book.id" :book="book" @click="openPreview" />
          </div>
        </div>
        <div v-if="shelfIndex < shelves.length - 1" class="shelf-divider"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import BookCard from './BookCard.vue'
import { USpinner } from 'src/components/ui'

const $q = useQuasar()

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

const columnsPerRow = ref(4)
let resizeTimeout = null

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
  }
})

const calculateColumns = () => {
  const width = window.innerWidth

  if (width < 480) return 2
  if (width < 576) return 3
  if (width < 768) return 4
  if (width < 992) return 5
  if (width < 1200) return 6
  return 8
}

const updateColumns = () => {
  columnsPerRow.value = calculateColumns()
}

const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    updateColumns()
  }, 100)
}

const openPreview = (book) => {
  emit('bookClick', book)
}

onMounted(() => {
  nextTick(() => {
    updateColumns()
    window.addEventListener('resize', handleResize)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  clearTimeout(resizeTimeout)
})
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.bookshelf-wrapper {
  padding: 16px 0;
  min-height: 400px;
}

.shelves-container {
  max-width: 1600px;
  margin: 0 auto;
  background: rgba($bg-dark-start, 0.3);
  border-left: 8px solid rgba($primary, 0.125);
  border-right: 8px solid rgba($primary, 0.125);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba($primary, 0.03);
  overflow: hidden;
}

.shelf-row {
  display: flex;
  flex-direction: column;
  background: rgba($bg-dark-end, 0.15);
  position: relative;

  &:first-child {
    border-top: 8px solid rgba($primary, 0.125);
  }

  &:last-child {
    border-bottom: 8px solid rgba($primary, 0.125);
  }
}

.shelf-content {
  display: flex;
  justify-content: center;
  padding: 20px 25px;
  background: rgba($bg-dark-end, 0.08);
  min-height: 240px;
  position: relative;
}

.books-grid {
  justify-content: center;
  width: 100%;
}

.shelf-divider {
  height: 8px;
  position: relative;
  background: rgba($primary, 0.125);
}

body.body--light {
  .shelves-container {
    background: rgba($bg-light-start, 0.3);
    border-left-color: rgba($primary, 0.1);
    border-right-color: rgba($primary, 0.1);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1), inset 0 0 60px rgba($primary, 0.02);
  }

  .shelf-row {
    background: rgba($bg-light-end, 0.15);

    &:first-child {
      border-top-color: rgba($primary, 0.1);
    }

    &:last-child {
      border-bottom-color: rgba($primary, 0.1);
    }
  }

  .shelf-content {
    background: rgba($bg-light-end, 0.05);
  }

  .shelf-divider {
    background: rgba($primary, 0.1);
  }
}

@media (max-width: 768px) {
  .bookshelf-wrapper {
    padding: 8px 0;
  }

  .shelf-content {
    padding: 12px 16px;
    min-height: 180px;
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

  .shelf-divider {
    height: 2px;
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
