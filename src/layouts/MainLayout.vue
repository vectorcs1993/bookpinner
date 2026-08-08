<template>
  <q-layout view="lHh Lpr lFf" class="modern-library-theme">
    <!-- Левое меню с overlay -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered overlay class="modern-drawer" :width="280" :breakpoint="500">
      <q-scroll-area class="fit">
        <div class="drawer-header">
          <div class="drawer-logo">
            <div class="logo-icon">📚</div>
            <div class="logo-text">
              <div class="logo-title">Библиотека</div>
              <div class="logo-subtitle">Личная коллекция</div>
            </div>
          </div>
          <q-btn flat round dense icon="close" color="white" @click="leftDrawerOpen = false" class="close-btn" />
        </div>

        <q-separator class="drawer-separator" />

        <q-list dark>
          <q-item v-for="item in menuItems" :key="item.label" clickable v-ripple class="nav-item" :active="item.route === currentRoute"
            @click="navigateTo(item.route)">
            <q-item-section avatar>
              <q-icon :name="item.icon" color="orange" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>

        <q-separator class="drawer-separator" />

        <div class="drawer-footer">
          <div class="footer-stat">
            <q-icon name="menu_book" size="18px" color="orange" />
            <span>{{ booksStore.getBooksCount }} книг</span>
          </div>
          <div class="footer-stat">
            <q-icon name="description" size="18px" color="orange" />
            <span>{{ booksStore.getBooksWithNotesCount }} с заметками</span>
          </div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Основной контент -->
    <q-page-container>
      <router-view @toggleDrawer="toggleDrawer" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from 'src/stores/books-store'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const leftDrawerOpen = ref(false) // По умолчанию закрыто
const currentRoute = computed(() => route.path)

const menuItems = [
  { label: 'Моя библиотека', icon: 'menu_book', route: '/' },
  { label: 'Мои книжные полки', icon: 'shelves', route: '/shelves' },
  { label: 'Мой книжный трекер', icon: 'trending_up', route: '/tracker' },
]

const navigateTo = (routePath) => {
  router.push(routePath)
  leftDrawerOpen.value = false // Закрываем меню после перехода
}

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

.modern-drawer {
  background: linear-gradient(180deg, $bg-dark-start 0%, $bg-dark-end 100%) !important;
  border-right: 1px solid $border-color !important;

  // Анимация для overlay
  :deep(.q-drawer__content) {
    background: transparent !important;
  }
}

.drawer-header {
  padding: 24px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba($primary-orange, 0.05);
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $primary-orange, $primary-orange-light);
  border-radius: $radius-lg;
  box-shadow: 0 4px 15px rgba($primary-orange, 0.125);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-size: 12px;
  color: $text-muted;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.close-btn {
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.drawer-separator {
  background: $border-color !important;
  margin: 8px 0;
}

.nav-item {
  border-radius: $radius-md;
  margin: 2px 8px;
  transition: all 0.3s ease;
  color: $text-secondary !important;

  &:hover {
    background: rgba($primary-orange, 0.08) !important;
    color: $text-primary !important;
  }

  &.q-router-link--active,
  &[active] {
    background: rgba($primary-orange, 0.12) !important;
    color: $text-primary !important;
  }
}

.drawer-footer {
  padding: 20px;
  border-top: 1px solid $border-color;
  margin-top: auto;
}

.footer-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  color: $text-secondary;
  font-size: 14px;
  padding: 6px 0;
}
</style>
