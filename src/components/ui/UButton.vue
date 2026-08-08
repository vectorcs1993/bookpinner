<template>
  <q-btn :label="label" :icon="icon" :loading="loading" :disabled="disabled" :color="color" :flat="variant === 'flat' || variant === 'ghost'"
    :outline="variant === 'outline'" :dense="size === 'sm'" :size="size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'" :class="[
      'u-btn',
      `u-btn-${variant}`,
      { 'u-btn-full': fullWidth }
    ]" v-bind="$attrs" @click="handleClick">
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
  color: { type: String, default: '' },
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
@import 'src/css/quasar.variables.scss';

.u-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-weight: 500;
  border-radius: $radius-sm;
  text-transform: none !important;
  min-height: 36px !important;

  .q-icon {
    font-size: 20px !important;
  }

  &-primary {
    background: linear-gradient(135deg, $primary-orange, $primary-orange-light) !important;
    color: $text-primary !important;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba($primary-orange, 0.4);
    }
  }

  &-secondary {
    background: rgba($primary-orange, 0.15) !important;
    color: $primary-orange-light !important;

    &:hover:not(:disabled) {
      background: rgba($primary-orange, 0.25) !important;
    }
  }

  &-outline {
    background: transparent !important;
    color: $primary-orange-light !important;
    border: 1px solid $border-color !important;

    &:hover:not(:disabled) {
      background: rgba($primary-orange, 0.08) !important;
      border-color: $primary-orange !important;
    }
  }

  &-flat {
    background: transparent !important;
    color: $text-secondary !important;

    &:hover:not(:disabled) {
      background: rgba($text-primary, 0.05) !important;
      color: $text-primary !important;
    }
  }

  &-ghost {
    background: transparent !important;
    color: $text-muted !important;

    &:hover:not(:disabled) {
      color: $text-primary !important;
    }
  }

  &-full {
    width: 100%;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
