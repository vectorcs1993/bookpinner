<template>
  <q-dialog v-model="dialogVisible" class="preview-dialog">
    <q-card v-if="book" class="antique-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-white" style="font-weight: 300;">{{ book.title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense color="#C45100" v-close-popup />
      </q-card-section>

      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-sm-4">
          <q-img :src="book.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="rounded-borders antique-img" />
        </div>

        <div class="col-12 col-sm-8">
          <div class="text-subtitle1 text-white q-mb-md">
            <strong>Автор:</strong> {{ book.author }}
          </div>

          <q-separator :style="{ backgroundColor: 'rgba(140, 56, 0, 0.4)' }" class="q-mb-md" />

          <div class="row items-center q-mb-sm">
            <div class="text-subtitle1 text-white" style="font-weight: 300;">📝 Заметки</div>
            <q-space />
            <q-btn label="Добавить" class="modern-btn-sm" size="sm" flat icon="add" @click="addNote" />
          </div>

          <q-input v-model="newNoteText" label="Текст заметки" outlined dense dark class="q-mb-md modern-input" @keyup.enter="addNote" />

          <div v-if="book.notes.length === 0" class="empty-state text-center" style="color: rgba(255,255,255,0.5)">
            Нет заметок для этой книги
          </div>

          <div v-for="(note, index) in book.notes" :key="index" class="note-item row items-center">
            <div class="col text-white">
              <q-icon name="bookmark" color="#E05F0A" size="16px" class="q-mr-sm" />
              {{ note }}
            </div>
            <div>
              <q-btn icon="delete" size="sm" flat dense color="#C45100" @click="deleteNote(index)" />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn label="Закрыть" class="modern-btn" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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
    min-width: 400px;
  }
}

.note-item {
  border-left: 4px solid $primary-orange;
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
  padding: 20px;
  color: $text-muted;
}

@media (max-width: 768px) {
  .preview-dialog {
    :deep(.q-dialog__inner) {
      min-width: 320px;
    }
  }
}
</style>
