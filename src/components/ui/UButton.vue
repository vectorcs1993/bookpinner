<template>
  <q-btn :label="label" :icon="icon" :loading="loading" :disabled="disabled" :color="color || 'primary'"
    :flat="variant === 'flat' || variant === 'ghost'" :outline="variant === 'outline'" :dense="size === 'sm'"
    :size="size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'" :rounded="rounded" :square="square" :class="['u-btn', { 'u-btn-full': fullWidth }]"
    v-bind="$attrs" @click="handleClick">
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
  rounded: { type: Boolean, default: true }, // По умолчанию скругленные
  square: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

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
}
</style>
