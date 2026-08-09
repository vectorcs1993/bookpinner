<template>
  <q-tooltip v-bind="$attrs" :dark="$q.dark.isActive">
    <slot />
  </q-tooltip>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>
