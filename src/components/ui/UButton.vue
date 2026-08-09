<template>
  <q-btn v-bind="$attrs" :dark="$q.dark.isActive">
    <slot />
  </q-btn>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>
