<template>
  <q-drawer v-model="drawerOpen" side="left" bordered overlay :width="280" :breakpoint="500" :show-if-above="false" @click-outside="closeDrawer">
    <!-- Шапка меню -->
    <div class="drawer-header">
      <div class="drawer-logo">
        <div class="logo-text">
          <div class="logo-title">BookPinner</div>
          <div class="logo-subtitle">Pin your books. Track your progress!</div>
        </div>
      </div>
      <q-btn flat round dense icon="close" @click="closeDrawer" />
    </div>

    <!-- Навигация -->
    <q-list>
      <q-item v-for="item in menuItems" :key="item.route" clickable v-ripple :active="isActiveRoute(item.route)" @click="navigate(item.route)">
        <q-item-section avatar>
          <q-icon :name="item.icon" color="orange" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable v-ripple @click="toggleTheme">
        <q-item-section avatar>
          <q-icon :name="themeIcon" color="orange" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ themeLabel }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle :model-value="isDark" color="orange" @update:model-value="toggleTheme" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBooksStore } from 'src/stores/books-store'
import { useThemeStore } from 'src/stores/theme-store'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const route = useRoute()
const booksStore = useBooksStore()
const themeStore = useThemeStore()

const drawerOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isDark = computed(() => themeStore.isDark)
const themeIcon = computed(() => themeStore.themeIcon)
const themeLabel = computed(() => themeStore.themeLabel)

const menuItems = [
  { label: 'Моя библиотека', icon: 'menu_book', route: '/' },
  { label: 'Мои книжные полки', icon: 'shelves', route: '/shelves' },
  { label: 'Мой книжный трекер', icon: 'trending_up', route: '/tracker' },
]

const closeDrawer = () => {
  drawerOpen.value = false
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
}

.logo-subtitle {
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.5px;
  opacity: 0.5;
}
</style>
