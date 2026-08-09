<template>
  <q-btn :label="label" :icon="icon" :loading="loading" :disabled="disabled" :color="computedColor" :flat="variant === 'flat' || variant === 'ghost'"
    :outline="variant === 'outline'" :dense="size === 'sm'" :size="computedSize" :rounded="rounded" :square="square"
    :class="['u-btn', { 'u-btn-full': fullWidth, 'u-btn-shape-round': shape === 'round' }]" v-bind="$attrs" @click="handleClick">
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <slot />
  </q-btn>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'flat', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  rounded: { type: Boolean, default: true },
  square: { type: Boolean, default: false },
  shape: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'round'].includes(v),
  },
  color: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const computedColor = computed(() => {
  if (props.color) return props.color
  if (props.variant === 'primary') return 'primary'
  if (props.variant === 'secondary') return 'secondary'
  return ''
})

const computedSize = computed(() => {
  if (props.size === 'sm') return 'sm'
  if (props.size === 'lg') return 'lg'
  return 'md'
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.u-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-transform: none !important;

  &-full {
    width: 100%;
  }

  &-shape-round {
    border-radius: 50% !important;
    min-width: 40px !important;
    padding: 0 !important;
    width: 40px;
    height: 40px;

    &.size-sm {
      min-width: 32px !important;
      width: 32px;
      height: 32px;
    }

    &.size-lg {
      min-width: 48px !important;
      width: 48px;
      height: 48px;
    }
  }
}
</style>
