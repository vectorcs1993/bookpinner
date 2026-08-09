<template>
  <UDialog v-model="dialogVisible" :title="book?.title" :persistent="false" dialog-class="preview-dialog" :dark="$q.dark.isActive">
    <div v-if="book" class="preview-content">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-5 col-md-4">
          <q-img :src="book.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="rounded-borders" />
        </div>

        <div class="col-12 col-sm-7 col-md-8">
          <div class="text-h6 q-mb-md">
            <strong>Автор:</strong> {{ book.author }}
          </div>

          <q-separator class="q-mb-md" :dark="$q.dark.isActive" />

          <div class="notes-section">
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle1" style="font-weight: 300;">📝 Заметки</div>
              <q-space />
              <UButton icon="add" variant="primary" shape="round" size="sm" :dark="$q.dark.isActive" @click="addNote" />
            </div>

            <UInput v-model="newNoteText" label="Текст заметки" dense class="q-mb-md" :dark="$q.dark.isActive" @keyup.enter="addNote" />

            <div v-if="book.notes.length === 0" class="empty-state text-center">
              Нет заметок для этой книги
            </div>

            <div v-for="(note, index) in book.notes" :key="index" class="note-item row items-center">
              <div class="col">
                <q-icon name="bookmark" color="primary" size="16px" class="q-mr-sm" />
                {{ note }}
              </div>
              <div>
                <UButton icon="delete" variant="ghost" shape="round" size="sm" color="negative" :dark="$q.dark.isActive" @click="deleteNote(index)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <UButton label="Закрыть" icon="close" variant="primary" :dark="$q.dark.isActive" @click="dialogVisible = false" />
    </template>
  </UDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { UDialog, UButton, UInput } from 'src/components/ui'

const $q = useQuasar()

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
  :deep(.u-dialog-card) {
    min-height: 400px;
    max-height: 85vh;
  }

  :deep(.u-dialog-body) {
    max-height: 60vh;
    overflow-y: auto;
  }
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
</style>
