// stores/shelves-store.js
import { defineStore } from 'pinia'

export const useShelvesStore = defineStore('shelves', {
  state: () => ({
    shelves: [
      {
        id: 1,
        name: 'Любимое',
        books: [1, 2, 3],
      },
      {
        id: 2,
        name: 'Хочу прочитать',
        books: [4, 5],
      },
      {
        id: 3,
        name: 'Классика',
        books: [1, 4, 7],
      },
    ],
    loading: false,
  }),

  getters: {
    getShelves: (state) => state.shelves,
    getShelvesCount: (state) => state.shelves.length,
    getShelfById: (state) => (id) => state.shelves.find(shelf => shelf.id === id),
    getShelfByName: (state) => (name) => state.shelves.find(shelf => shelf.name === name),
  },

  actions: {
    addShelf(name) {
      const newShelf = {
        id: Date.now(),
        name: name,
        books: [],
      }
      this.shelves.push(newShelf)
    },

    deleteShelf(id) {
      this.shelves = this.shelves.filter(shelf => shelf.id !== id)
    },

    updateShelf(id, updates) {
      const index = this.shelves.findIndex(shelf => shelf.id === id)
      if (index !== -1) {
        this.shelves[index] = { ...this.shelves[index], ...updates }
      }
    },

    addBookToShelf(shelfId, book) {
      const shelf = this.shelves.find(s => s.id === shelfId)
      if (shelf && !shelf.books.some(b => b.id === book.id)) {
        shelf.books.push(book)
      }
    },

    removeBookFromShelf(shelfId, bookId) {
      const shelf = this.shelves.find(s => s.id === shelfId)
      if (shelf) {
        shelf.books = shelf.books.filter(book => book.id !== bookId)
      }
    },

    setLoading(status) {
      this.loading = status
    },

    clearShelves() {
      this.shelves = []
    },

    async fetchShelves() {
      this.setLoading(true)
      try {
        // Здесь будет запрос к API
      } catch (error) {
        console.error('Ошибка загрузки полок:', error)
      } finally {
        this.setLoading(false)
      }
    },
  },
})
