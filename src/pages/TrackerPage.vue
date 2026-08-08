<template>
  <div class="tracker-page q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="row items-center">
          <UButton icon="menu" variant="ghost" @click="$emit('toggleDrawer')" />
          <span class="page-title q-ml-sm">Мой книжный трекер</span>
        </div>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-grid q-mb-md">
      <div class="stats-row row q-col-gutter-sm">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="stat-content">
              <q-icon name="menu_book" size="32px" color="primary" />
              <div class="stat-value">{{ booksStore.getBooksCount }}</div>
              <div class="stat-label">Всего книг</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="stat-content">
              <q-icon name="description" size="32px" color="primary" />
              <div class="stat-value">{{ booksStore.getTotalNotesCount }}</div>
              <div class="stat-label">Всего заметок</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="stat-content">
              <q-icon name="bookmark" size="32px" color="primary" />
              <div class="stat-value">{{ booksStore.getBooksWithNotesCount }}</div>
              <div class="stat-label">Книг с заметками</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="stat-content">
              <q-icon name="trending_up" size="32px" color="primary" />
              <div class="stat-value">{{ readingProgress }}%</div>
              <div class="stat-label">Прогресс чтения</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- График активности (демо) -->
    <div class="filters-panel q-mb-md">
      <div class="text-subtitle1 q-mb-sm">📊 Активность чтения</div>
      <div class="chart-placeholder">
        <div class="chart-bars">
          <div v-for="(item, index) in activityData" :key="index" class="chart-bar-wrapper">
            <div class="chart-bar" :style="{ height: `${item.value}%` }">
              <div class="chart-bar-tooltip">{{ item.value }}</div>
            </div>
            <div class="chart-bar-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Топ книг -->
    <div class="filters-panel">
      <div class="text-subtitle1 q-mb-sm">🏆 Топ книг по заметкам</div>
      <div v-if="topBooks.length === 0" class="empty-state text-center">
        Нет книг с заметками
      </div>
      <div v-else class="top-books-list">
        <div v-for="(book, index) in topBooks" :key="book.id" class="top-book-item row items-center">
          <div class="col-1 top-book-rank">#{{ index + 1 }}</div>
          <div class="col-2">
            <q-img :src="book.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="top-book-thumb" />
          </div>
          <div class="col">
            <div class="text-weight-medium">{{ book.title }}</div>
            <div class="text-caption" style="opacity: 0.6">{{ book.author }}</div>
          </div>
          <div class="col-auto">
            <q-chip :color="getColorByIndex(index)" text-color="white" size="sm">
              <q-icon name="description" size="14px" class="q-mr-xs" />
              {{ book.notes.length }}
            </q-chip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBooksStore } from 'src/stores/books-store'
import { UButton } from 'src/components/ui'

const booksStore = useBooksStore()

defineEmits(['toggleDrawer'])

const defaultCover = 'https://via.placeholder.com/60x84/8C3800/FFFFFF?text=Нет+обложки'

const readingProgress = computed(() => {
  const total = booksStore.getBooksCount
  if (total === 0) return 0
  const withNotes = booksStore.getBooksWithNotesCount
  return Math.round((withNotes / total) * 100)
})

const topBooks = computed(() => {
  return [...booksStore.getBooks]
    .filter(book => book.notes.length > 0)
    .sort((a, b) => b.notes.length - a.notes.length)
    .slice(0, 5)
})

// Демо-данные для графика активности
const activityData = [
  { label: 'Пн', value: 45 },
  { label: 'Вт', value: 60 },
  { label: 'Ср', value: 30 },
  { label: 'Чт', value: 75 },
  { label: 'Пт', value: 90 },
  { label: 'Сб', value: 50 },
  { label: 'Вс', value: 40 },
]

const getColorByIndex = (index) => {
  const colors = ['orange', 'amber', 'deep-orange', 'brown', 'grey']
  return colors[index % colors.length]
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

.stats-grid {
  .stat-card {
    background: $bg-card;
    border-radius: $radius-md;
    border: 1px solid rgba($primary, 0.1);
    height: 100%;
  }
}

body.body--light .stat-card {
  background: $bg-card-light;
  border-color: rgba($primary, 0.05);
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px !important;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-top: 8px;
  color: $text-primary;
}

body.body--light .stat-value {
  color: $text-primary-light;
}

.stat-label {
  font-size: 14px;
  opacity: 0.6;
  color: $text-muted;
  margin-top: 4px;
}

body.body--light .stat-label {
  color: $text-muted-light;
}

.chart-placeholder {
  padding: 16px 8px;
  min-height: 120px;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 120px;
  gap: 8px;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.chart-bar {
  width: 100%;
  max-width: 40px;
  background: linear-gradient(to top, $primary, $secondary);
  border-radius: 4px 4px 0 0;
  min-height: 8px;
  transition: height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  cursor: pointer;

  &:hover .chart-bar-tooltip {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.chart-bar-tooltip {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
  white-space: nowrap;
}

.chart-bar-label {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 6px;
  color: $text-muted;
}

body.body--light .chart-bar-label {
  color: $text-muted-light;
}

.top-books-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-book-item {
  padding: 10px 14px;
  border-radius: $radius-sm;
  background: rgba($primary, 0.03);
  transition: background 0.2s;

  &:hover {
    background: rgba($primary, 0.08);
  }
}

body.body--light .top-book-item {
  background: rgba($primary, 0.02);

  &:hover {
    background: rgba($primary, 0.06);
  }
}

.top-book-rank {
  font-size: 20px;
  font-weight: 700;
  color: $primary;
  opacity: 0.5;
}

.top-book-thumb {
  width: 40px;
  border-radius: 4px;
}

.empty-state {
  padding: 30px 20px;
  opacity: 0.6;
  font-style: italic;
  color: $text-muted;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 22px;
  }

  .chart-bars {
    height: 80px;
  }

  .top-book-rank {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .stats-grid .stat-card {
    margin-bottom: 8px;
  }
}
</style>
