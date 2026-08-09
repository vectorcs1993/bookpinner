<template>
  <q-dialog v-model="localValue" :persistent="persistent" :maximized="maximized" :full-width="fullWidth" :full-height="fullHeight"
    :position="position" :dark="dark" :class="['u-dialog', dialogClass]" @update:model-value="handleUpdate" v-bind="$attrs">
    <q-card class="u-dialog-card">
      <q-card-section v-if="title || $slots.title" class="u-dialog-header">
        <div class="row items-center">
          <div class="text-h5" style="font-weight: 300;">
            <slot name="title">{{ title }}</slot>
          </div>
          <q-space />
          <UButton v-if="!persistent" icon="close" variant="ghost" shape="round" size="sm" :dark="dark" @click="close" />
        </div>
      </q-card-section>

      <q-separator v-if="title || $slots.title" :dark="dark" />

      <q-card-section class="u-dialog-body">
        <slot />
      </q-card-section>

      <q-card-actions v-if="$slots.actions || actions" align="right" class="u-dialog-actions">
        <slot name="actions">
          <UButton v-for="action in actions" :key="action.label" :label="action.label" :variant="action.variant || 'secondary'" shape="round"
            :loading="action.loading" :dark="dark" @click="action.handler" />
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import UButton from './UButton.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
  maximized: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
  fullHeight: { type: Boolean, default: false },
  position: {
    type: String,
    default: 'standard',
    validator: (v) => ['standard', 'top', 'bottom', 'left', 'right'].includes(v),
  },
  title: { type: String, default: '' },
  dialogClass: { type: String, default: '' },
  actions: { type: Array, default: () => [] },
  dark: { type: Boolean, default: null },
})

const emit = defineEmits(['update:modelValue', 'close'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleUpdate = (value) => {
  emit('update:modelValue', value)
  if (!value) {
    emit('close')
  }
}

const close = () => {
  localValue.value = false
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.u-dialog {
  :deep(.q-dialog__inner) {
    min-width: 500px;
    max-width: 90vw;

    @media (max-width: 768px) {
      min-width: 90vw;
      max-width: 95vw;
    }

    @media (max-width: 480px) {
      min-width: 95vw;
      max-width: 98vw;
    }
  }
}

.u-dialog-card {
  border-radius: $radius-lg !important;
  min-height: 200px;
  max-height: 85vh;
}

.u-dialog-header {
  padding: 20px 24px !important;

  .text-h5 {
    font-size: 22px;
    font-weight: 600;
  }
}

.u-dialog-body {
  padding: 20px 24px !important;
  max-height: 60vh;
  overflow-y: auto;
}

.u-dialog-actions {
  padding: 16px 24px !important;
  gap: 12px;
  border-top: 1px solid $border-color;

  :deep(.u-btn) {
    min-width: 120px;
  }
}

body.body--light .u-dialog-actions {
  border-top-color: $border-color-light;
}
</style>
