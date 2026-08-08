<template>
  <div class="u-spinner-wrapper" :class="{ 'u-spinner-overlay': overlay }">
    <q-spinner :color="color" :size="size" :class="['u-spinner', `u-spinner-${variant}`]" v-bind="$attrs" />
    <span v-if="text" class="u-spinner-text">{{ text }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  color: { type: String, default: 'orange' },
  size: { type: String, default: '3em' },
  text: { type: String, default: '' },
  overlay: { type: Boolean, default: false },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'pulse', 'dots'].includes(v),
  },
})
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.u-spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($bg-dark-start, 0.8);
    backdrop-filter: blur(4px);
    z-index: 9999;
  }
}

.u-spinner-text {
  margin-top: 12px;
  color: $text-muted;
  font-size: 14px;
}
</style>
