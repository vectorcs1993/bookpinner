<template>
  <q-dialog v-model="localValue" :persistent="persistent" :maximized="maximized" :full-width="fullWidth" :full-height="fullHeight"
    :position="position" :class="['u-dialog', dialogClass]" @update:model-value="handleUpdate" v-bind="$attrs">
    <q-card class="u-dialog-card">
      <q-card-section v-if="title || $slots.title" class="u-dialog-header">
        <div class="row items-center">
          <div class="text-h6" style="font-weight: 300;">
            <slot name="title">{{ title }}</slot>
          </div>
          <q-space />
          <UButton v-if="!persistent" icon="close" variant="ghost" size="sm" @click="close" />
        </div>
      </q-card-section>

      <q-separator v-if="title || $slots.title" />

      <q-card-section class="u-dialog-body">
        <slot />
      </q-card-section>

      <q-card-actions v-if="$slots.actions || actions" align="right" class="u-dialog-actions">
        <slot name="actions">
          <UButton v-for="action in actions" :key="action.label" :label="action.label" :variant="action.variant || 'secondary'"
            :loading="action.loading" @click="action.handler" />
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
.u-dialog {
  :deep(.q-dialog__inner) {
    min-width: 400px;

    @media (max-width: 768px) {
      min-width: 320px;
    }

    @media (max-width: 480px) {
      min-width: 280px;
    }
  }
}

.u-dialog-card {
  border-radius: 12px !important;
}

.u-dialog-header {
  padding: 16px 20px !important;
}

.u-dialog-body {
  padding: 16px 20px !important;
}

.u-dialog-actions {
  padding: 12px 20px !important;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
