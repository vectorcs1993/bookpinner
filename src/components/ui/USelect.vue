<template>
  <q-select v-model="localValue" :options="options" :label="label" :placeholder="placeholder" :dense="dense" :outlined="variant === 'outlined'"
    :filled="variant === 'filled'" :dark="dark" :clearable="clearable" :disable="disabled" :loading="loading" :error="error"
    :error-message="errorMessage" :multiple="multiple" :use-chips="multiple" :popup-content-class="'u-select-popup'" v-bind="$attrs"
    @update:model-value="handleUpdate" color="primary">
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
            <q-icon :name="scope.opt.icon" color="primary" />
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
