<template>
  <q-layout view="lHh LpR fFf" class="main-layout">
    <!-- Хедер -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="row items-center">
            <!-- <q-avatar>
            </q-avatar> -->
            <span class="q-ml-sm">{{ pageTitle }}</span>
          </div>
        </q-toolbar-title>

        <!-- Кнопка переключения темы в хедере -->
        <q-btn dense flat round :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'" @click="toggleTheme" />
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" elevated :dark="$q.dark.isActive">
      <q-list>
        <!-- Логотип в drawer -->
        <q-item class="drawer-header">
          <q-item-section avatar>
            <!-- <q-avatar>
              <img src="/logo/logo-mono-white.svg" alt="BookPinner">
            </q-avatar> -->
          </q-item-section>
          <q-item-section>
            <div class="logo-title">BookPinner</div>
            <div class="logo-subtitle">Pin your books. Track your progress!</div>
          </q-item-section>
        </q-item>

        <q-separator :dark="$q.dark.isActive" />

        <!-- Пункты меню -->
        <q-item v-for="item in menuItems" :key="item.route" clickable v-ripple :active="isActiveRoute(item.route)" @click="navigate(item.route)">
          <q-item-section avatar>
            <q-icon :name="item.icon" color="primary" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>

        <q-separator :dark="$q.dark.isActive" />

        <!-- Переключение темы в drawer -->
        <q-item clickable v-ripple @click="toggleTheme">
          <q-item-section avatar>
            <q-icon :name="$q.dark.isActive ? 'dark_mode' : 'light_mode'" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $q.dark.isActive ? 'Темная тема' : 'Светлая тема' }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle :model-value="$q.dark.isActive" color="primary" @update:model-value="toggleTheme" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Контент -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const leftDrawerOpen = ref(false)

const menuItems = [
  { label: 'Моя библиотека', icon: 'menu_book', route: '/library' },
  { label: 'Мои книжные полки', icon: 'shelves', route: '/shelves' },
  { label: 'Трекер чтения', icon: 'view_column', route: '/tracker' },
  { label: 'Статистика', icon: 'trending_up', route: '/statistics' },
]

// Динамический заголовок в зависимости от текущего маршрута
const pageTitle = computed(() => {
  const currentRoute = route.path
  const item = menuItems.find(item => item.route === currentRoute)
  return item ? item.label : 'BookPinner'
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleTheme = () => {
  $q.dark.toggle()
  localStorage.setItem('quasar-dark', JSON.stringify($q.dark.isActive))
}

const isActiveRoute = (path) => {
  return route.path === path
}

const navigate = (routePath) => {
  router.push(routePath)
  leftDrawerOpen.value = false
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.main-layout {
  min-height: 100vh;
}

.drawer-header {
  padding: 16px 16px 16px 8px;
  background: transparent;
}

.logo-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: $text-primary;
}

body.body--light .logo-title {
  color: $text-primary-light;
}

.logo-subtitle {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.3px;
  color: $text-muted;
  opacity: 0.7;
}

body.body--light .logo-subtitle {
  color: $text-muted-light;
}

// Хедер в светлой теме остается с цветом primary
body.body--light {
  .q-header {
    .q-toolbar {
      color: white;
    }
  }
}
</style>
