<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { Dark } from 'quasar'

onMounted(() => {
  const saved = localStorage.getItem('quasar-dark')
  if (saved !== null) {
    Dark.set(JSON.parse(saved))
  } else {
    Dark.set(Dark.isActive)
  }
})
</script>
