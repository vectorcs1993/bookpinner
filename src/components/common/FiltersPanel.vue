<template>
  <div class="filters-panel">
    <div class="filters-grid">
      <UInput v-model="searchQuery" placeholder="Поиск по названию или автору..." clearable @update:model-value="handleSearch">
        <template #prepend>
          <UIcon name="search" color="orange" />
        </template>
      </UInput>

      <USelect v-model="filterAuthor" :options="authorOptions" placeholder="Автор" clearable @update:model-value="applyFilters" />

      <USelect v-model="filterNotes" :options="notesOptions" placeholder="Заметки" clearable @update:model-value="applyFilters" />

      <USelect v-model="sortBy" :options="sortOptions" placeholder="Сортировка" @update:model-value="applyFilters" />
    </div>

    <div class="filters-actions">
      <UButton label="Сбросить" variant="secondary" size="sm" :disabled="!hasActiveFilters" @click="resetFilters" />
      <UChip v-for="(filter, key) in activeFilters" :key="key" :label="`${filter.label}: ${filter.value}`" variant="outline" dense removable
        @remove="removeFilter(key)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { UInput, USelect, UButton, UChip, UIcon } from 'src/components/ui'

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

const searchQuery = ref(props.modelValue.search || '')
const filterAuthor = ref(props.modelValue.author || null)
const filterNotes = ref(props.modelValue.notes || null)
const sortBy = ref(props.modelValue.sort || 'title')

let searchTimeout = null

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

@media (max-width: 768px) {
  .filters-panel {
    padding: 12px 16px;
  }
}
</style>
