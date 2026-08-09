<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { Dark } from 'quasar'

onMounted(() => {
  // Восстанавливаем тему из localStorage при загрузке
  const saved = localStorage.getItem('quasar-dark')
  if (saved !== null) {
    Dark.set(JSON.parse(saved))
  } else {
    // Если нет сохраненной, используем системные настройки
    Dark.set(Dark.isActive)
  }
})
</script>
