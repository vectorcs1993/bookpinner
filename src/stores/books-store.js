import { defineStore } from 'pinia'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [
      {
        id: 1,
        title: 'Война и мир',
        author: 'Лев Толстой',
        coverUrl: 'https://covers.openlibrary.org/b/id/8404536-L.jpg',
        notes: ['Классика русской литературы', 'Очень объемный роман', 'Читал 3 месяца'],
      },
      {
        id: 2,
        title: '1984',
        author: 'Джордж Оруэлл',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225116-L.jpg',
        notes: ['Антиутопия', 'Актуально до сих пор', 'Страшная книга'],
      },
      {
        id: 3,
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225120-L.jpg',
        notes: ['Мистический роман', 'Любимая книга', 'Воланд крутой персонаж'],
      },
      {
        id: 4,
        title: 'Преступление и наказание',
        author: 'Фёдор Достоевский',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225117-L.jpg',
        notes: ['Психологический роман', 'Тяжелая тема', 'Обязательно к прочтению'],
      },
      {
        id: 5,
        title: 'Гарри Поттер и философский камень',
        author: 'Джоан Роулинг',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225124-L.jpg',
        notes: ['Детское фэнтези', 'Начало истории', 'Подарил сыну'],
      },
      {
        id: 6,
        title: 'Властелин колец: Братство кольца',
        author: 'Джон Р. Р. Толкин',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225125-L.jpg',
        notes: ['Эпическое фэнтези', 'Лучшая трилогия', 'Перечитал 5 раз'],
      },
      {
        id: 7,
        title: 'Маленький принц',
        author: 'Антуан де Сент-Экзюпери',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225121-L.jpg',
        notes: ['Философская сказка', 'Для детей и взрослых', 'Вдохновляет'],
      },
      {
        id: 8,
        title: 'Алиса в Стране чудес',
        author: 'Льюис Кэрролл',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225122-L.jpg',
        notes: ['Абсурдная сказка', 'Оригинальная история', 'Много загадок'],
      },
      {
        id: 9,
        title: 'Колыбель для кошки',
        author: 'Курт Воннегут',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225123-L.jpg',
        notes: ['Постапокалипсис', 'Черный юмор', 'Фантастика'],
      },
      {
        id: 10,
        title: 'Портрет Дориана Грея',
        author: 'Оскар Уайльд',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225126-L.jpg',
        notes: ['Философский роман', 'Эстетизм', 'Готика'],
      },
    ],
    loading: false,
  }),

  getters: {
    getBooks: (state) => state.books,
    getBooksCount: (state) => state.books.length,
    getBooksWithNotes: (state) => state.books.filter(book => book.notes.length > 0),
    getBooksWithNotesCount: (state) => state.books.filter(book => book.notes.length > 0).length,
    getBookById: (state) => (id) => state.books.find(book => book.id === id),
    getAuthors: (state) => {
      const authors = new Set(state.books.map(book => book.author))
      return Array.from(authors)
    },
    getTotalNotesCount: (state) => {
      return state.books.reduce((total, book) => total + book.notes.length, 0)
    },
  },

  actions: {
    addBook(bookData) {
      const newBook = {
        id: Date.now(),
        title: bookData.title,
        author: bookData.author,
        coverUrl: bookData.coverUrl || '',
        notes: [],
      }
      this.books.push(newBook)
    },

    updateBook(id, updates) {
      const index = this.books.findIndex(book => book.id === id)
      if (index !== -1) {
        this.books[index] = { ...this.books[index], ...updates }
      }
    },

    deleteBook(id) {
      this.books = this.books.filter(book => book.id !== id)
    },

    addNote(bookId, note) {
      const book = this.books.find(book => book.id === bookId)
      if (book) {
        book.notes.push(note)
      }
    },

    deleteNote(bookId, noteIndex) {
      const book = this.books.find(book => book.id === bookId)
      if (book && noteIndex >= 0 && noteIndex < book.notes.length) {
        book.notes.splice(noteIndex, 1)
      }
    },

    updateNote(bookId, noteIndex, newNote) {
      const book = this.books.find(book => book.id === bookId)
      if (book && noteIndex >= 0 && noteIndex < book.notes.length) {
        book.notes[noteIndex] = newNote
      }
    },

    setLoading(status) {
      this.loading = status
    },

    clearBooks() {
      this.books = []
    },

    async fetchBooks() {
      this.setLoading(true)
      try {
        // Здесь будет запрос к API
        // const response = await api.get('/books')
        // this.books = response.data
      } catch (error) {
        console.error('Ошибка загрузки книг:', error)
      } finally {
        this.setLoading(false)
      }
    },
  },
})
