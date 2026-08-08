<template>
  <q-dialog v-model="dialogVisible" class="preview-dialog">
    <q-card v-if="book" class="antique-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-white" style="font-weight: 300;">{{ book.title }}</div>
        <q-space />
        <UButton icon="close" variant="ghost" shape="round" size="sm" @click="dialogVisible = false" />
      </q-card-section>

      <q-card-section class="row q-col-gutter-lg">
        <div class="col-12 col-sm-5 col-md-4">
          <q-img :src="book.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="rounded-borders antique-img" />
        </div>

        <div class="col-12 col-sm-7 col-md-8">
          <div class="text-h6 text-white q-mb-md">
            <strong>Автор:</strong> {{ book.author }}
          </div>

          <q-separator :style="{ backgroundColor: 'rgba(196, 81, 0, 0.4)' }" class="q-mb-md" />

          <div class="notes-section">
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle1 text-white" style="font-weight: 300;">📝 Заметки</div>
              <q-space />
              <UButton icon="add" variant="primary" shape="round" size="sm" @click="addNote" />
            </div>

            <q-input v-model="newNoteText" label="Текст заметки" outlined dense dark class="q-mb-md modern-input" @keyup.enter="addNote" />

            <div v-if="book.notes.length === 0" class="empty-state text-center">
              Нет заметок для этой книги
            </div>

            <div v-for="(note, index) in book.notes" :key="index" class="note-item row items-center">
              <div class="col text-white">
                <q-icon name="bookmark" color="primary" size="16px" class="q-mr-sm" />
                {{ note }}
              </div>
              <div>
                <UButton icon="delete" variant="ghost" size="sm" shape="round" color="negative" @click="deleteNote(index)" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <UButton label="Закрыть" icon="close" variant="primary" shape="round" size="md" @click="dialogVisible = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { UButton } from 'src/components/ui'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  book: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'addNote', 'deleteNote'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const newNoteText = ref('')
const defaultCover = 'https://via.placeholder.com/300x420/8C3800/FFFFFF?text=Нет+обложки'

const addNote = () => {
  if (!props.book || !newNoteText.value.trim()) return
  emit('addNote', props.book.id, newNoteText.value.trim())
  newNoteText.value = ''
}

const deleteNote = (index) => {
  if (!props.book) return
  emit('deleteNote', props.book.id, index)
}

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    newNoteText.value = ''
  }
})
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.preview-dialog {
  :deep(.q-dialog__inner) {
    min-width: 600px;
    max-width: 90vw;

    @media (max-width: 768px) {
      min-width: 90vw;
    }
  }

  :deep(.q-card) {
    min-height: 400px;
    max-height: 85vh;
  }
}

.antique-card {
  border-radius: $radius-lg !important;
  background: linear-gradient(145deg, #1a100a, #2a1c14) !important;
}

body.body--light .antique-card {
  background: linear-gradient(145deg, #e8dcd5, #f5f0ed) !important;
}

.notes-section {
  max-height: 40vh;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: $primary;
    border-radius: 2px;
  }
}

.note-item {
  border-left: 4px solid $primary;
  background: $bg-card;
  margin-bottom: 10px;
  padding: 12px 16px;
  border-radius: 0 $radius-sm $radius-sm 0;
  transition: 0.2s;

  &:hover {
    background: $bg-card-hover;
  }
}

.empty-state {
  opacity: 0.6;
  font-style: italic;
  padding: 30px 20px;
  color: $text-muted;
  text-align: center;
}

body.body--light .note-item {
  background: $bg-card-light;

  &:hover {
    background: $bg-card-hover-light;
  }
}

@media (max-width: 768px) {
  .preview-dialog {
    :deep(.q-dialog__inner) {
      min-width: 90vw;
    }
  }
}
</style>
