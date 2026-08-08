<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <UButton icon="menu" variant="ghost" @click="toggleDrawer" />
      <span class="page-title">{{ title }}</span>
    </div>
    <div class="top-bar-right">
      <UButton label="Добавить книгу" icon="add" variant="primary" @click="openAddDialog" />
    </div>
  </div>
</template>

<script setup>
import { UButton } from 'src/components/ui'

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

  .page-title {
    font-size: 20px;
  }
}
</style>
