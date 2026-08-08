<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <AppDrawer v-model="leftDrawerOpen" />

    <q-page-container>
      <router-view @toggleDrawer="toggleDrawer" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import AppDrawer from 'src/components/common/AppDrawer.vue'

const leftDrawerOpen = ref(false)

const toggleDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
}
</style>
