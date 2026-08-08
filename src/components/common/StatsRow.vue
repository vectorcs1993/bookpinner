<template>
  <div class="stats-row">
    <div class="stat-card-mini">
      <span class="stat-number">{{ totalBooks }}</span>
      <span class="stat-label-mini">Всего книг</span>
    </div>
    <div class="stat-card-mini">
      <span class="stat-number">{{ filteredCount }}</span>
      <span class="stat-label-mini">Найдено</span>
    </div>
    <div class="stat-card-mini">
      <span class="stat-number">{{ booksWithNotes }}</span>
      <span class="stat-label-mini">С заметками</span>
    </div>
  </div>
</template>

<script setup>
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
  gap: 20px;
  padding: 16px 32px;
  border-bottom: 1px solid rgba($primary-orange, 0.05);
}

.stat-card-mini {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: $bg-card;
  border-radius: $radius-md;
  border: 1px solid rgba($primary-orange, 0.08);
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: $primary-orange-light;
}

.stat-label-mini {
  font-size: 13px;
  color: $text-muted;
}

@media (max-width: 768px) {
  .stats-row {
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px 16px;
  }

  .stat-number {
    font-size: 16px;
  }

  .stat-card-mini {
    padding: 6px 12px;
  }
}
</style>
