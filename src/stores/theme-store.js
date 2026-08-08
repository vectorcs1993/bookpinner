import { defineStore } from 'pinia'
import { Dark } from 'quasar'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: Dark.isActive,
  }),

  getters: {
    isDark: (state) => state.darkMode,
    themeIcon: (state) => state.darkMode ? 'dark_mode' : 'light_mode',
    themeLabel: (state) => state.darkMode ? 'Темная тема' : 'Светлая тема',
  },

  actions: {
    toggleTheme() {
      this.darkMode = !this.darkMode
      Dark.set(this.darkMode)
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode))
    },

    initTheme() {
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) {
        this.darkMode = JSON.parse(saved)
      } else {
        this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      Dark.set(this.darkMode)
    },
  },
})
