<template>
  <q-input v-model="localValue" :label="label" :placeholder="placeholder" :type="type" :dense="dense" :outlined="variant === 'outlined'"
    hide-bottom-space hide-hint :filled="variant === 'filled'" :standout="variant === 'standout'" :rounded="rounded" :clearable="clearable"
    :loading="loading" :disable="disabled" :error="error" :error-message="errorMessage" :dark="dark" v-bind="$attrs"
    @update:model-value="handleUpdate" @focus="handleFocus" @blur="handleBlur" color="primary">
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <template v-if="$slots.after" #after>
      <slot name="after" />
    </template>
  </q-input>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: undefined },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  variant: {
    type: String,
    default: 'outlined',
    validator: (v) => ['outlined', 'filled', 'standout'].includes(v),
  },
  rounded: { type: Boolean, default: true },
  dense: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  dark: { type: Boolean, default: null },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change'])

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

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}
</script>
