<template>
  <q-icon :name="name" :size="size" :color="color" :class="['u-icon', props.iconClass]" v-bind="$attrs" />
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: '24px' },
  color: { type: String, default: '' },
  iconClass: { type: String, default: '' },
})

</script>
