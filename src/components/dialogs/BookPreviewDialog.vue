<template>
  <UDialog v-model="dialogVisible" :title="book?.title || 'Preview'">
    <div v-if="book" class="preview-content">
      <div class="preview-cover">
        <q-img :src="book.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="rounded-borders" />
      </div>
      <div class="preview-info">
        <div class="text-subtitle1 text-white q-mb-md">
          <strong>Автор:</strong> {{ book.author }}
        </div>

        <q-separator :style="{ backgroundColor: 'rgba(140, 56, 0, 0.4)' }" class="q-mb-md" />

        <div class="notes-section">
          <div class="notes-header">
            <span class="text-subtitle1 text-white" style="font-weight: 300;">📝 Заметки</span>
            <UButton icon="add" variant="secondary" size="sm" @click="addNote" />
          </div>

          <UInput v-model="newNoteText" placeholder="Текст заметки..." @keyup.enter="addNote" class="q-mb-sm" />

          <div v-if="book.notes.length === 0" class="empty-notes">
            Нет заметок для этой книги
          </div>

          <div v-for="(note, index) in book.notes" :key="index" class="note-item">
            <UIcon name="bookmark" color="#E05F0A" size="16px" class="q-mr-sm" />
            <span class="text-white">{{ note }}</span>
            <UButton icon="delete" variant="ghost" size="sm" color="negative" class="q-ml-auto" @click="deleteNote(index)" />
          </div>
        </div>
      </div>
    </div>
    <template #actions>
      <UButton label="Закрыть" variant="ghost" @click="dialogVisible = false" />
    </template>
  </UDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { UDialog, UInput, UButton, UIcon } from 'src/components/ui'

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

.preview-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.preview-cover {
  max-width: 300px;

  :deep(.q-img) {
    border: 2px solid rgba($primary-orange-dark, 0.4);
    box-shadow: $shadow-card;
    border-radius: $radius-sm;
  }
}

.preview-info {
  display: flex;
  flex-direction: column;
}

.notes-section {
  flex: 1;
}

.notes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.note-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: $bg-card;
  border-left: 4px solid $primary-orange;
  border-radius: 0 $radius-sm $radius-sm 0;
  transition: background 0.2s;

  &:hover {
    background: $bg-card-hover;
  }
}

.empty-notes {
  padding: 20px;
  text-align: center;
  color: $text-muted;
  font-style: italic;
}
</style>
