<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-drawer v-model="leftDrawerOpen" side="left" bordered overlay :width="280" :breakpoint="500" :show-if-above="false"
      @click-outside="closeDrawer">
      <div class="drawer-header">
        <div class="drawer-logo">
          <div class="logo-text">
            <div class="logo-title">BookPinner</div>
            <div class="logo-subtitle">Pin your books. Track your progress!</div>
          </div>
        </div>
        <UButton icon="close" variant="ghost" shape="round" @click="closeDrawer" />
      </div>

      <q-list>
        <q-item v-for="item in menuItems" :key="item.route" clickable v-ripple :active="isActiveRoute(item.route)" @click="navigate(item.route)">
          <q-item-section avatar>
            <q-icon :name="item.icon" color="primary" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="toggleTheme">
          <q-item-section avatar>
            <q-icon :name="themeIcon" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ themeLabel }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <UToggle :model-value="isDark" color="primary" @update:model-value="toggleTheme" />
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
import { useRouter, useRoute } from 'vue-router'
import { useThemeStore } from 'src/stores/theme-store'
import { UButton, UToggle } from 'src/components/ui'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()

const leftDrawerOpen = ref(false)

const isDark = computed(() => themeStore.isDark)
const themeIcon = computed(() => themeStore.themeIcon)
const themeLabel = computed(() => themeStore.themeLabel)

const menuItems = [
  { label: 'Моя библиотека', icon: 'menu_book', route: '/library' },
  { label: 'Мои книжные полки', icon: 'shelves', route: '/shelves' },
  { label: 'Статистика', icon: 'trending_up', route: '/statistics' },
]

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

const toggleTheme = () => {
  themeStore.toggleTheme()
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
