<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <q-btn flat dense icon="menu" color="#C45100" @click="toggleDrawer" class="menu-btn" />
      <span class="page-title">{{ title }}</span>
    </div>
    <div class="top-bar-right">
      <q-btn label="Добавить книгу" icon="add" class="add-book-btn-header" flat @click="openAddDialog" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Моя библиотека',
  },
})

const emit = defineEmits(['toggleDrawer', 'openAddDialog'])

const toggleDrawer = () => {
  emit('toggleDrawer')
}

const openAddDialog = () => {
  emit('openAddDialog')
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid $border-color;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: -0.5px;
}

.menu-btn {
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.add-book-btn-header {
  color: $primary-orange-light !important;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: $radius-sm;
  transition: all 0.3s ease;

  &:hover {
    background: rgba($primary-orange, 0.1) !important;
  }
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
  }

  .top-bar-right {
    width: 100%;
  }

  .add-book-btn-header {
    width: 100%;
    justify-content: center;
  }

  .page-title {
    font-size: 20px;
  }
}
</style>
