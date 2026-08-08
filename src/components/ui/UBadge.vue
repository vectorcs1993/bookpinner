<template>
  <q-badge :label="label" :color="color" :text-color="textColor" :floating="floating" :transparent="transparent" :multi-line="multiLine"
    :class="['u-badge', `u-badge-${variant}`]" v-bind="$attrs">
    <slot />
  </q-badge>
</template>

<script setup>
const props = defineProps({
  label: { type: [String, Number], default: '' },
  color: { type: String, default: 'orange' },
  textColor: { type: String, default: 'white' },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'outline', 'glow', 'dot'].includes(v),
  },
  floating: { type: Boolean, default: false },
  transparent: { type: Boolean, default: false },
  multiLine: { type: Boolean, default: false },
})
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.u-badge {
  &-default {
    background: $primary-orange !important;
  }

  &-outline {
    background: transparent !important;
    color: $primary-orange-light !important;
    border: 1px solid $primary-orange !important;
  }

  &-glow {
    background: rgba($primary-orange, 0.2) !important;
    color: $text-primary !important;
    box-shadow: 0 0 20px rgba($primary-orange, 0.2) !important;
  }

  &-dot {
    width: 8px !important;
    height: 8px !important;
    padding: 0 !important;
    min-width: 8px !important;
    border-radius: 50% !important;
    background: $primary-orange !important;
  }
}
</style>
