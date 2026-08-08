<template>
  <div class="filters-panel">
    <div class="filters-row">
      <!-- Поиск -->
      <div class="filter-item search-item">
        <q-input v-model="searchQuery" placeholder="Поиск по названию или автору..." outlined dense dark class="search-input" clearable
          @update:model-value="handleSearch">
          <template v-slot:prepend>
            <q-icon name="search" color="#E05F0A" />
          </template>
        </q-input>
      </div>

      <!-- Фильтр по автору -->
      <div class="filter-item">
        <q-select v-model="filterAuthor" :options="authorOptions" placeholder="Автор" outlined dense dark class="filter-select" clearable emit-value
          map-options @update:model-value="applyFilters" popup-content-class="dark-menu" />
      </div>

      <!-- Фильтр по заметкам -->
      <div class="filter-item">
        <q-select v-model="filterNotes" :options="notesOptions" placeholder="Заметки" outlined dense dark class="filter-select" clearable emit-value
          map-options @update:model-value="applyFilters" popup-content-class="dark-menu" />
      </div>

      <!-- Сортировка -->
      <div class="filter-item">
        <q-select v-model="sortBy" :options="sortOptions" placeholder="Сортировка" outlined dense dark class="filter-select" emit-value map-options
          @update:model-value="applyFilters" popup-content-class="dark-menu" />
      </div>

      <!-- Кнопка сброса -->
      <div class="filter-item reset-item">
        <q-btn label="Сбросить" class="reset-filters-btn" flat dense @click="resetFilters" :disable="!hasActiveFilters" />
      </div>
    </div>

    <!-- Активные фильтры -->
    <div v-if="hasActiveFilters" class="active-filters-row">
      <q-chip v-for="(filter, key) in activeFilters" :key="key" removable @remove="removeFilter(key)" class="filter-chip" dark>
        {{ filter.label }}: {{ filter.value }}
      </q-chip>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  books: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: () => ({
      search: '',
      author: null,
      notes: null,
      sort: 'title',
    }),
  },
})

const emit = defineEmits(['update:modelValue', 'filterChange'])

// Локальное состояние
const searchQuery = ref(props.modelValue.search || '')
const filterAuthor = ref(props.modelValue.author || null)
const filterNotes = ref(props.modelValue.notes || null)
const sortBy = ref(props.modelValue.sort || 'title')

let searchTimeout = null

// Опции
const authorOptions = computed(() => {
  const authors = new Set(props.books.map(book => book.author))
  return Array.from(authors).map(author => ({
    label: author,
    value: author,
  }))
})

const notesOptions = [
  { label: 'Нет заметок', value: 'none' },
  { label: 'Есть заметки', value: 'some' },
  { label: 'Много заметок (3+)', value: 'many' },
]

const sortOptions = [
  { label: 'По названию (А-Я)', value: 'title' },
  { label: 'По названию (Я-А)', value: 'title-desc' },
  { label: 'По автору (А-Я)', value: 'author' },
  { label: 'По автору (Я-А)', value: 'author-desc' },
  { label: 'По количеству заметок', value: 'notes' },
]

// Активные фильтры
const hasActiveFilters = computed(() => {
  return searchQuery.value || filterAuthor.value || filterNotes.value || sortBy.value !== 'title'
})

const activeFilters = computed(() => {
  const filters = {}

  if (searchQuery.value) {
    filters.search = { label: 'Поиск', value: searchQuery.value }
  }

  if (filterAuthor.value) {
    filters.author = { label: 'Автор', value: filterAuthor.value }
  }

  if (filterNotes.value) {
    const label = notesOptions.find(opt => opt.value === filterNotes.value)?.label
    filters.notes = { label: 'Заметки', value: label }
  }

  if (sortBy.value !== 'title') {
    const label = sortOptions.find(opt => opt.value === sortBy.value)?.label
    filters.sort = { label: 'Сортировка', value: label }
  }

  return filters
})

// Методы
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  const filters = {
    search: searchQuery.value,
    author: filterAuthor.value,
    notes: filterNotes.value,
    sort: sortBy.value,
  }

  emit('update:modelValue', filters)
  emit('filterChange', filters)
}

const resetFilters = () => {
  searchQuery.value = ''
  filterAuthor.value = null
  filterNotes.value = null
  sortBy.value = 'title'
  applyFilters()
}

const removeFilter = (key) => {
  switch (key) {
    case 'search':
      searchQuery.value = ''
      break
    case 'author':
      filterAuthor.value = null
      break
    case 'notes':
      filterNotes.value = null
      break
    case 'sort':
      sortBy.value = 'title'
      break
  }
  applyFilters()
}

// Синхронизация с внешним состоянием
watch(() => props.modelValue, (newVal) => {
  searchQuery.value = newVal.search || ''
  filterAuthor.value = newVal.author || null
  filterNotes.value = newVal.notes || null
  sortBy.value = newVal.sort || 'title'
}, { deep: true })
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.filters-panel {
  padding: 16px 32px 12px;
  border-bottom: 1px solid rgba($primary-orange, 0.05);
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 160px;

  &.search-item {
    flex: 2;
    min-width: 200px;
  }

  &.reset-item {
    flex: 0 0 auto;
    min-width: auto;
  }
}

.search-input,
.filter-select {
  :deep(.q-field__control) {
    background: $bg-card !important;
    border: 1px solid $border-color !important;
    border-radius: $radius-md !important;
    transition: all 0.3s ease !important;
    color: $text-primary !important;

    &:hover {
      border-color: $border-color-hover !important;
      background: $bg-card-hover !important;
    }

    &:focus-within {
      border-color: $primary-orange !important;
      box-shadow: 0 0 0 3px rgba($primary-orange, 0.1) !important;
    }
  }

  :deep(.q-field__native) {
    color: $text-primary !important;
  }

  :deep(.q-field__label) {
    color: $text-muted !important;
  }
}

.reset-filters-btn {
  color: $primary-orange-light !important;
  font-size: 13px !important;
  padding: 8px 16px !important;
  border-radius: $radius-sm !important;
  transition: all 0.3s ease !important;

  &:hover:not(:disabled) {
    background: rgba($primary-orange, 0.1) !important;
  }

  &:disabled {
    opacity: 0.3;
  }
}

.active-filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 10px;
}

@media (max-width: 768px) {
  .filters-panel {
    padding: 12px 16px;
  }

  .filters-row {
    flex-direction: column;
    gap: 8px;
  }

  .filter-item {
    width: 100%;
    min-width: unset;

    &.reset-item {
      width: auto;
    }
  }
}
</style>
