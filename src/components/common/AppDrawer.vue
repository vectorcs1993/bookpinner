<template>
  <q-drawer v-model="drawerOpen" side="left" bordered class="modern-drawer" :width="280" :breakpoint="500" :show-if-above="true">
    <!-- Шапка меню -->
    <div class="drawer-header">
      <div class="drawer-logo">
        <div class="logo-icon">📚</div>
        <div class="logo-text">
          <div class="logo-title">Библиотека</div>
          <div class="logo-subtitle">Личная коллекция</div>
        </div>
      </div>
      <q-btn flat round dense icon="close" color="white" @click="closeDrawer" class="close-btn" />
    </div>

    <!-- Навигация -->
    <div class="drawer-nav">
      <q-list dark>
        <q-item v-for="item in menuItems" :key="item.route" clickable v-ripple class="nav-item" :active-class="'nav-item-active'"
          @click="navigate(item.route)">
          <q-item-section avatar>
            <q-icon :name="item.icon" color="#E05F0A" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-separator class="drawer-separator" />

    <!-- Нижняя часть -->
    <div class="drawer-footer">
      <div class="footer-stat">
        <q-icon name="menu_book" size="18px" color="#E05F0A" />
        <span>{{ booksCount }} книг в коллекции</span>
      </div>
      <div class="footer-stat">
        <q-icon name="description" size="18px" color="#E05F0A" />
        <span>{{ booksWithNotes }} с заметками</span>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from 'src/stores/books-store'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const booksStore = useBooksStore()

const drawerOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const booksCount = computed(() => booksStore.getBooksCount)
const booksWithNotes = computed(() => booksStore.getBooksWithNotesCount)

const menuItems = [
  { label: 'Моя библиотека', icon: 'menu_book', route: '/' },
  { label: 'Мои книжные полки', icon: 'shelves', route: '/shelves' },
  { label: 'Мой книжный трекер', icon: 'trending_up', route: '/tracker' },
]

const closeDrawer = () => {
  drawerOpen.value = false
}

const navigate = (route) => {
  router.push(route)
  closeDrawer()
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.modern-drawer {
  background: linear-gradient(180deg, $bg-dark-start 0%, $bg-dark-end 100%) !important;
  border-right: 1px solid $border-color !important;

  :deep(.q-drawer__content) {
    background: transparent !important;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
}

.drawer-header {
  padding: 24px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba($primary-orange, 0.05);
  border-bottom: 1px solid $border-color;
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

.drawer-nav {
  padding: 16px 12px;
  flex: 1;
}

.nav-item {
  border-radius: $radius-md;
  margin: 2px 0;
  transition: all 0.3s ease;
  color: $text-secondary !important;

  &:hover {
    background: rgba($primary-orange, 0.08) !important;
    color: $text-primary !important;
  }

  &-active {
    background: rgba($primary-orange, 0.12) !important;
    color: $text-primary !important;
  }
}

.drawer-separator {
  background: $border-color !important;
  margin: 0;
}

.drawer-footer {
  padding: 20px;
  border-top: 1px solid $border-color;
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
