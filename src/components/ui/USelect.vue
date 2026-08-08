<template>
  <q-select v-model="localValue" :options="options" :label="label" :placeholder="placeholder" :dense="dense" :outlined="variant === 'outlined'"
    :filled="variant === 'filled'" :dark="dark" :clearable="clearable" :disable="disabled" :loading="loading" :error="error"
    :error-message="errorMessage" :multiple="multiple" :use-chips="multiple" :popup-content-class="'u-select-popup'" :menu-class="'u-select-menu'"
    :class="['u-select', `u-select-${variant}`]" @update:model-value="handleUpdate" v-bind="$attrs">
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <template #option="scope">
      <slot name="option" :opt="scope.opt" :selected="scope.selected" :item-index="scope.itemIndex">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
            <q-item-label v-if="scope.opt.description" caption>
              {{ scope.opt.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section v-if="scope.opt.icon" side>
            <q-icon :name="scope.opt.icon" color="orange" />
          </q-item-section>
        </q-item>
      </slot>
    </template>
  </q-select>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Object, Array], default: null },
  options: { type: Array, required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  variant: {
    type: String,
    default: 'outlined',
    validator: (v) => ['outlined', 'filled'].includes(v),
  },
  dense: { type: Boolean, default: false },
  dark: { type: Boolean, default: true },
  clearable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleUpdate = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.u-select {
  :deep(.q-field__control) {
    background: $bg-card !important;
    border: 1px solid $border-color !important;
    border-radius: $radius-md !important;
    transition: all 0.3s ease !important;
    color: $text-primary !important;
    min-height: 40px !important;

    &:hover {
      border-color: $border-color-hover !important;
      background: $bg-card-hover !important;
    }

    &:focus-within {
      border-color: $primary-orange !important;
      box-shadow: 0 0 0 3px rgba($primary-orange, 0.1) !important;
    }
  }

  :deep(.q-field__native) {
    color: $text-primary !important;
    min-height: 38px !important;
  }

  :deep(.q-field__label) {
    color: $text-muted !important;
  }

  :deep(.q-field__marginal) {
    color: $text-muted !important;
  }

  &-filled {
    :deep(.q-field__control) {
      background: rgba($bg-card, 0.8) !important;
    }
  }
}

:global(.u-select-popup),
:global(.u-select-menu) {
  background: $bg-dark-end !important;
  border: 1px solid $border-color !important;
  border-radius: $radius-md !important;
  box-shadow: $shadow-card !important;

  .q-item {
    color: $text-primary !important;
    padding: 8px 16px !important;
    min-height: 36px !important;

    &:hover {
      background: rgba($primary-orange, 0.15) !important;
    }

    &.q-manual-focusable--focused {
      background: rgba($primary-orange, 0.25) !important;
    }

    &.q-item--active {
      background: rgba($primary-orange, 0.2) !important;
    }
  }

  .q-item__section--main {
    .q-item__label {
      color: $text-primary !important;
    }
  }

  .q-item__section--side {
    .q-icon {
      color: $primary-orange-light !important;
    }
  }
}
</style>
