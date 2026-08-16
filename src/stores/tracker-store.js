// stores/tracker-store.js
import { defineStore } from 'pinia'

const STORAGE_KEY = 'bookpinner-tracker'

const defaultColumns = () => ([
  { id: 'col-backlog', title: 'Хочу прочитать', color: '#8C3800', order: 0 },
  { id: 'col-reading', title: 'Читаю', color: '#C45100', order: 1 },
  { id: 'col-done', title: 'Прочитано', color: '#21ba45', order: 2 },
])

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        columns: Array.isArray(parsed.columns) && parsed.columns.length ? parsed.columns : defaultColumns(),
        cards: Array.isArray(parsed.cards) ? parsed.cards : [],
      }
    }
  } catch {
    // повреждённые данные — игнорируем
  }
  return { columns: defaultColumns(), cards: [] }
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const useTrackerStore = defineStore('tracker', {
  state: () => ({
    ...loadState(),
  }),

  getters: {
    getColumns: (state) => [...state.columns].sort((a, b) => a.order - b.order),
    getCardsByColumn: (state) => (columnId) => state.cards.filter(c => c.columnId === columnId),
    getCardById: (state) => (id) => state.cards.find(c => c.id === id),
    getTrackedBookIds: (state) => new Set(state.cards.map(c => c.bookId)),
    getTotalTimeSpent: (state) => state.cards.reduce((sum, c) => sum + (c.timeSpent || 0), 0),
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns: this.columns, cards: this.cards }))
      } catch {
        // localStorage недоступен — молча пропускаем
      }
    },

    // ---- Колонки ----
    addColumn(title, color = '#C45100') {
      const order = this.columns.length ? Math.max(...this.columns.map(c => c.order)) + 1 : 0
      this.columns.push({ id: generateId('col'), title: title.trim(), color, order })
      this.persist()
    },

    updateColumn(id, updates) {
      const col = this.columns.find(c => c.id === id)
      if (col) Object.assign(col, updates)
      this.persist()
    },

    deleteColumn(id) {
      if (this.columns.length <= 1) return
      this.columns = this.columns.filter(c => c.id !== id)
      const fallbackId = this.getColumns[0]?.id
      this.cards.forEach(c => {
        if (c.columnId === id) c.columnId = fallbackId
      })
      this.persist()
    },

    moveColumn(id, direction) {
      const sorted = this.getColumns
      const idx = sorted.findIndex(c => c.id === id)
      const swapWith = direction === 'left' ? idx - 1 : idx + 1
      if (idx === -1 || swapWith < 0 || swapWith >= sorted.length) return
      const a = this.columns.find(c => c.id === sorted[idx].id)
      const b = this.columns.find(c => c.id === sorted[swapWith].id)
      const tmp = a.order
      a.order = b.order
      b.order = tmp
      this.persist()
    },

    // ---- Карточки ----
    addBookToTracker(bookId, columnId) {
      if (this.cards.some(c => c.bookId === bookId)) return
      const targetColumn = columnId || this.getColumns[0]?.id
      this.cards.push({
        id: generateId('card'),
        bookId,
        columnId: targetColumn,
        rating: 0,
        progress: 0,
        timeSpent: 0, // в минутах
        sessions: [],
        timerStartedAt: null,
        notes: '',
        createdAt: Date.now(),
      })
      this.persist()
    },

    removeCard(cardId) {
      this.cards = this.cards.filter(c => c.id !== cardId)
      this.persist()
    },

    moveCard(cardId, columnId) {
      const card = this.cards.find(c => c.id === cardId)
      if (card) {
        card.columnId = columnId
        const lastCol = this.getColumns[this.getColumns.length - 1]
        if (lastCol && columnId === lastCol.id && card.progress < 100) {
          card.progress = 100
        }
      }
      this.persist()
    },

    updateCardRating(cardId, rating) {
      const card = this.cards.find(c => c.id === cardId)
      if (card) card.rating = rating
      this.persist()
    },

    updateCardProgress(cardId, progress) {
      const card = this.cards.find(c => c.id === cardId)
      if (card) card.progress = Math.min(100, Math.max(0, progress))
      this.persist()
    },

    updateCardNotes(cardId, notes) {
      const card = this.cards.find(c => c.id === cardId)
      if (card) card.notes = notes
      this.persist()
    },

    startTimer(cardId) {
      // если где-то ещё идёт таймер — останавливаем
      this.cards.forEach(c => {
        if (c.timerStartedAt && c.id !== cardId) this.stopTimer(c.id)
      })
      const card = this.cards.find(c => c.id === cardId)
      if (card && !card.timerStartedAt) {
        card.timerStartedAt = Date.now()
        this.persist()
      }
    },

    stopTimer(cardId) {
      const card = this.cards.find(c => c.id === cardId)
      if (card && card.timerStartedAt) {
        const elapsedMs = Date.now() - card.timerStartedAt
        const minutes = Math.max(1, Math.round(elapsedMs / 60000))
        card.timeSpent = (card.timeSpent || 0) + minutes
        card.sessions.push({ date: new Date().toISOString(), minutes })
        card.timerStartedAt = null
        this.persist()
      }
    },

    addManualTime(cardId, minutes) {
      const card = this.cards.find(c => c.id === cardId)
      if (card && minutes > 0) {
        card.timeSpent = (card.timeSpent || 0) + minutes
        card.sessions.push({ date: new Date().toISOString(), minutes })
        this.persist()
      }
    },

    clearTracker() {
      this.columns = defaultColumns()
      this.cards = []
      this.persist()
    },
  },
})
