<template>
  <UDialog v-model="dialogVisible" title="📖 Добавить книгу">
    <div class="add-book-form">
      <q-input v-model="form.title" label="Название *" outlined dense class="q-mb-md" />
      <q-input v-model="form.author" label="Автор *" outlined dense class="q-mb-md" />
      <q-input v-model="form.coverUrl" label="URL обложки" outlined dense class="q-mb-md" placeholder="https://example.com/cover.jpg" />

      <div v-if="form.coverUrl" class="cover-preview">
        <q-img :src="form.coverUrl" :ratio="5 / 7" fit="cover" style="max-width: 120px; border-radius: 8px;" />
      </div>
    </div>

    <template #actions>
      <UButton label="Отмена" icon="close" variant="ghost" shape="round" @click="dialogVisible = false" />
      <UButton label="Добавить книгу" icon="add" variant="primary" shape="round" :disabled="!form.title || !form.author" @click="submit" />
    </template>
  </UDialog>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { UDialog, UInput, UButton } from 'src/components/ui'

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
.add-book-form {
  min-width: 480px;
  padding: 8px 0;

  .cover-preview {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .add-book-form {
    min-width: unset;
  }
}
</style>
