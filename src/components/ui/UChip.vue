<template>
  <q-chip v-bind="$attrs" :dark="$q.dark.isActive">
    <slot />
  </q-chip>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>
