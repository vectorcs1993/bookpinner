<template>
  <q-chip :label="label" :icon="icon" :color="color" :text-color="textColor" :size="size" :dense="dense" :removable="removable" :clickable="clickable"
    :disable="disable" :class="['u-chip', `u-chip-${variant}`]" @update:model-value="handleRemove" @click="handleClick" v-bind="$attrs">
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </q-chip>
</template>

<script setup>
const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '' },
  textColor: { type: String, default: '' },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'outline', 'glow'].includes(v),
  },
  size: { type: String, default: 'md' },
  dense: { type: Boolean, default: false },
  removable: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  disable: { type: Boolean, default: false },
})

const emit = defineEmits(['remove', 'click'])

const handleRemove = () => {
  emit('remove')
}

const handleClick = (event) => {
  if (props.clickable && !props.disable) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.u-chip {
  transition: all 0.3s ease;

  &-default {
    background: rgba($primary-orange, 0.15) !important;
    color: $text-primary !important;
    border: 1px solid rgba($primary-orange, 0.2) !important;
  }

  &-outline {
    background: transparent !important;
    color: $primary-orange-light !important;
    border: 1px solid $border-color !important;
  }

  &-glow {
    background: rgba($primary-orange, 0.2) !important;
    color: $text-primary !important;
    border: 1px solid rgba($primary-orange, 0.3) !important;
    box-shadow: 0 0 20px rgba($primary-orange, 0.1) !important;
  }
}
</style>
