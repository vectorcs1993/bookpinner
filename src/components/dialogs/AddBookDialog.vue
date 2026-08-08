<template>
  <q-dialog v-model="dialogVisible" class="add-dialog">
    <q-card class="antique-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-white" style="font-weight: 300;">📖 Добавить книгу</div>
        <q-space />
        <q-btn icon="close" flat round dense color="#C45100" v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="filter-group">
          <label class="filter-label">Название *</label>
          <q-input v-model="form.title" placeholder="Введите название" outlined dense dark class="modern-input" />
        </div>

        <div class="filter-group">
          <label class="filter-label">Автор *</label>
          <q-input v-model="form.author" placeholder="Введите автора" outlined dense dark class="modern-input" />
        </div>

        <div class="filter-group">
          <label class="filter-label">URL обложки</label>
          <q-input v-model="form.coverUrl" placeholder="https://..." outlined dense dark class="modern-input" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn label="Отмена" flat color="#C45100" v-close-popup />
        <q-btn label="Добавить книгу" class="add-book-btn-dialog" @click="submit" :disable="!form.title || !form.author" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'addBook'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const form = reactive({
  title: '',
  author: '',
  coverUrl: '',
})

const submit = () => {
  if (!form.title || !form.author) return
  emit('addBook', { ...form })
  form.title = ''
  form.author = ''
  form.coverUrl = ''
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.add-dialog {
  :deep(.q-dialog__inner) {
    min-width: 400px;
  }
}

.filter-group {
  margin-bottom: 16px;
}

.filter-label {
  display: block;
  font-size: 13px;
  color: $text-muted;
  margin-bottom: 6px;
  font-weight: 500;
}

.add-book-btn-dialog {
  background: linear-gradient(135deg, $primary-orange, $primary-orange-light) !important;
  color: $text-primary !important;
  border-radius: $radius-sm !important;
  font-weight: 600 !important;
  padding: 8px 24px !important;
  transition: all 0.3s ease !important;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba($primary-orange, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  .add-dialog {
    :deep(.q-dialog__inner) {
      min-width: 320px;
    }
  }
}
</style>
