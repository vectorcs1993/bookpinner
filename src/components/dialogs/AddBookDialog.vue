<template>
  <UDialog v-model="dialogVisible" title="📖 Добавить книгу">
    <UInput v-model="form.title" label="Название *" class="q-mb-sm" />
    <UInput v-model="form.author" label="Автор *" class="q-mb-sm" />
    <UInput v-model="form.coverUrl" label="URL обложки" />
    <template #actions>
      <UButton label="Отмена" variant="ghost" @click="dialogVisible = false" />
      <UButton label="Добавить книгу" variant="primary" :disabled="!form.title || !form.author" @click="submit" />
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
