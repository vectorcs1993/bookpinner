<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-drawer v-model="leftDrawerOpen" side="left" bordered overlay :width="280" :breakpoint="500" :show-if-above="false" :dark="$q.dark.isActive"
      @click-outside="closeDrawer">
      <div class="drawer-header">
        <div class="drawer-logo">
          <div class="logo-text">
            <div class="logo-title">BookPinner</div>
            <div class="logo-subtitle">Pin your books. Track your progress!</div>
          </div>
        </div>
        <UButton icon="close" variant="ghost" shape="round" :dark="$q.dark.isActive" @click="closeDrawer" />
      </div>

      <q-list>
        <q-item v-for="item in menuItems" :key="item.route" clickable v-ripple :active="isActiveRoute(item.route)" @click="navigate(item.route)">
          <q-item-section avatar>
            <q-icon :name="item.icon" color="primary" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>

        <q-separator :dark="$q.dark.isActive" />

        <q-item clickable v-ripple @click="toggleDarkMode">
          <q-item-section avatar>
            <q-icon :name="darkIcon" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ darkLabel }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle :model-value="$q.dark.isActive" color="primary" @update:model-value="toggleDarkMode" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view @toggleDrawer="toggleDrawer" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { UButton } from 'src/components/ui'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const leftDrawerOpen = ref(false)

const darkIcon = computed(() => $q.dark.isActive ? 'dark_mode' : 'light_mode')
const darkLabel = computed(() => $q.dark.isActive ? 'Темная тема' : 'Светлая тема')

const menuItems = [
  { label: 'Моя библиотека', icon: 'menu_book', route: '/library' },
  { label: 'Мои книжные полки', icon: 'shelves', route: '/shelves' },
  { label: 'Статистика', icon: 'trending_up', route: '/statistics' },
]

const toggleDarkMode = () => {
  $q.dark.toggle()
  // Сохраняем состояние в localStorage
  localStorage.setItem('quasar-dark', JSON.stringify($q.dark.isActive))
}

const toggleDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const closeDrawer = () => {
  leftDrawerOpen.value = false
}

const isActiveRoute = (path) => {
  return route.path === path
}

const navigate = (routePath) => {
  router.push(routePath)
  closeDrawer()
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.main-layout {
  min-height: 100vh;
}

.drawer-header {
  padding: 24px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $border-color;
}

body.body--light .drawer-header {
  border-bottom-color: $border-color-light;
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: $text-primary;
}

body.body--light .logo-title {
  color: $text-primary-light;
}

.logo-subtitle {
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: $text-muted;
}

body.body--light .logo-subtitle {
  color: $text-muted-light;
}
</style>
