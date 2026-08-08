<template>
  <q-radio v-model="localValue" :val="value" :label="label" :color="color" :dark="dark" :disable="disabled" :dense="dense" :size="size"
    :class="{ 'u-radio-error': error }" v-bind="$attrs" @update:model-value="handleUpdate">
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </q-radio>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: null },
  value: { type: [String, Number, Boolean], required: true },
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
.u-radio-error {
  :deep(.q-radio__inner) {
    border-color: #c10015 !important;
  }
}
</style>
