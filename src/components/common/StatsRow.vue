<template>
  <div class="stats-row">
    <UChip :label="`Всего книг: ${totalBooks}`" icon="menu_book" color="orange" />
    <UChip :label="`Найдено: ${filteredCount}`" icon="search" color="orange" />
    <UChip :label="`С заметками: ${booksWithNotes}`" icon="description" color="orange" />
  </div>
</template>

<script setup>
import { UChip } from 'src/components/ui'

defineProps({
  totalBooks: {
    type: Number,
    required: true,
  },
  filteredCount: {
    type: Number,
    required: true,
  },
  booksWithNotes: {
    type: Number,
    required: true,
  },
})
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 32px;
  border-bottom: 1px solid rgba($primary-orange, 0.05);

  @media (max-width: 768px) {
    padding: 8px 16px;
  }
}
</style>
