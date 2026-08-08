<template>
  <q-badge :label="label" :color="color" :text-color="textColor" :floating="floating" :transparent="transparent" :multi-line="multiLine"
    :class="['u-badge', badgeClass]" v-bind="$attrs">
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

const badgeClass = {
  'u-badge-outline': props.variant === 'outline',
  'u-badge-glow': props.variant === 'glow',
  'u-badge-dot': props.variant === 'dot',
}
</script>

<style scoped lang="scss">
.u-badge {
  &-outline {
    background: transparent !important;
    border: 1px solid currentColor !important;
  }

  &-glow {
    box-shadow: 0 0 20px rgba(196, 81, 0, 0.2) !important;
  }

  &-dot {
    width: 8px !important;
    height: 8px !important;
    padding: 0 !important;
    min-width: 8px !important;
    border-radius: 50% !important;
  }
}
</style>
