<template>
  <q-chip :label="label" :icon="icon" :color="color || 'primary'" :text-color="textColor" :size="size" :dense="dense" :removable="removable"
    :clickable="clickable" :disable="disable" :dark="dark" :class="['u-chip', chipClass]" @update:model-value="handleRemove" @click="handleClick"
    v-bind="$attrs">
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
  color: { type: String, default: 'primary' },
  textColor: { type: String, default: 'white' },
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
  dark: { type: Boolean, default: null },
})

const emit = defineEmits(['remove', 'click'])

const chipClass = {
  'u-chip-outline': props.variant === 'outline',
  'u-chip-glow': props.variant === 'glow',
}

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
.u-chip {
  &-outline {
    background: transparent !important;
    border: 1px solid currentColor !important;
  }

  &-glow {
    box-shadow: 0 0 20px rgba(196, 81, 0, 0.1) !important;
  }
}
</style>
