<template>
  <q-badge v-bind="$attrs" :dark="$q.dark.isActive">
    <slot />
  </q-badge>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>
