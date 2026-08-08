<template>
  <q-layout view="lHh Lpr lFf" class="modern-library-theme">
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
@import 'src/css/quasar.variables.scss';

.modern-library-theme {
  background: linear-gradient(180deg, $bg-dark-start 0%, $bg-dark-end 100%) fixed !important;
  min-height: 100vh;
}
</style>
