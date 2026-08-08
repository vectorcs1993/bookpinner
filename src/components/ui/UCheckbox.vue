<template>
  <q-checkbox v-model="localValue" :label="label" :color="color" :dark="dark" :disable="disabled" :dense="dense" :size="size"
    :class="{ 'u-checkbox-error': error }" v-bind="$attrs" @update:model-value="handleUpdate">
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </q-checkbox>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  color: { type: String, default: 'orange' },
  dark: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  dense: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  error: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleUpdate = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.u-checkbox-error {
  :deep(.q-checkbox__inner) {
    border-color: #c10015 !important;
  }
}
</style>
