<template>
  <q-input v-model="localValue" :label="label" :placeholder="placeholder" :type="type" :dense="dense" :outlined="variant === 'outlined'"
    :filled="variant === 'filled'" :standout="variant === 'standout'" :dark="dark" :clearable="clearable" :loading="loading" :disable="disabled"
    :error="error" :error-message="errorMessage" :class="['u-input', `u-input-${variant}`]" v-bind="$attrs" @update:model-value="handleUpdate"
    @focus="handleFocus" @blur="handleBlur">
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
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  variant: {
    type: String,
    default: 'outlined',
    validator: (v) => ['outlined', 'filled', 'standout'].includes(v),
  },
  dense: { type: Boolean, default: false },
  dark: { type: Boolean, default: true },
  clearable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
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

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.u-input {
  :deep(.q-field__control) {
    background: $bg-card !important;
    border: 1px solid $border-color !important;
    border-radius: $radius-md !important;
    transition: all 0.3s ease !important;
    color: $text-primary !important;

    &:hover {
      border-color: $border-color-hover !important;
      background: $bg-card-hover !important;
    }

    &:focus-within {
      border-color: $primary-orange !important;
      box-shadow: 0 0 0 3px rgba($primary-orange, 0.1) !important;
    }
  }

  :deep(.q-field__native) {
    color: $text-primary !important;
  }

  :deep(.q-field__label) {
    color: $text-muted !important;
  }

  &-filled {
    :deep(.q-field__control) {
      background: rgba($bg-card, 0.8) !important;
    }
  }

  &-standout {
    :deep(.q-field__control) {
      background: rgba($bg-card, 0.4) !important;
      border-color: transparent !important;
    }
  }
}
</style>
