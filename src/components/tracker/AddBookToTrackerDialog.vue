<template>
  <UDialog v-model="visible" title="Добавить книгу в трекер" :dark="$q.dark.isActive">
    <div class="add-to-tracker-form">
      <USelect v-model="selectedBookId" :options="bookOptions" label="Книга" dense emit-value map-options class="q-mb-md" />
      <USelect v-model="selectedColumnId" :options="columnOptions" label="Колонка" dense emit-value map-options />
      <div v-if="bookOptions.length === 0" class="empty-hint">
        Все книги уже добавлены в трекер, либо библиотека пуста.
      </div>
    </div>

    <template #actions>
      <UButton label="Отмена" flat rounded @click="visible = false" />
      <UButton label="Добавить" color="primary" rounded :disabled="!selectedBookId" @click="submit" />
    </template>
  </UDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { UDialog, UButton, USelect } from 'src/components/ui'

const $q = useQuasar()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  availableBooks: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  defaultColumnId: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'add'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const selectedBookId = ref(null)
const selectedColumnId = ref(props.defaultColumnId)

watch(visible, (val) => {
  if (val) {
    selectedBookId.value = null
    selectedColumnId.value = props.defaultColumnId || props.columns[0]?.id || null
  }
})

const bookOptions = computed(() => props.availableBooks.map(b => ({ label: `${b.title} — ${b.author}`, value: b.id })))
const columnOptions = computed(() => props.columns.map(c => ({ label: c.title, value: c.id })))

const submit = () => {
  if (!selectedBookId.value) return
  emit('add', selectedBookId.value, selectedColumnId.value)
  visible.value = false
}
</script>

<style scoped lang="scss">
.add-to-tracker-form {
  min-width: 350px;
  padding: 8px 0;
}

.empty-hint {
  opacity: 0.6;
  font-style: italic;
  font-size: 13px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .add-to-tracker-form {
    min-width: unset;
  }
}
</style>
