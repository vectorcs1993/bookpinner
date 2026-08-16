<template>
  <div class="tracker-column" @dragover.prevent @drop="onDrop">
    <div class="tracker-column-header" :style="{ borderColor: column.color }">
      <div class="row items-center no-wrap">
        <div class="tracker-column-dot" :style="{ backgroundColor: column.color }" />

        <div v-if="!editing" class="tracker-column-title" @dblclick="startEdit">{{ column.title }}</div>
        <UInput v-else v-model="editTitle" dense class="tracker-column-title-input" @keyup.enter="saveEdit" @blur="saveEdit" />

        <UBadge :label="items.length" color="primary" class="q-ml-sm" />
        <q-space />

        <UButton icon="add" flat round size="sm" @click="$emit('add-book', column.id)" />

        <q-btn-dropdown flat dense round icon="more_vert" size="sm" no-icon-animation>
          <q-list>
            <q-item clickable v-close-popup @click="startEdit">
              <q-item-section avatar><q-icon name="edit" /></q-item-section>
              <q-item-section>Переименовать</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="$emit('move', column.id, 'left')">
              <q-item-section avatar><q-icon name="chevron_left" /></q-item-section>
              <q-item-section>Сдвинуть влево</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="$emit('move', column.id, 'right')">
              <q-item-section avatar><q-icon name="chevron_right" /></q-item-section>
              <q-item-section>Сдвинуть вправо</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="$emit('delete', column.id)">
              <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
              <q-item-section class="text-negative">Удалить колонку</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <div class="tracker-column-body">
      <div v-if="items.length === 0" class="tracker-column-empty">
        Перетащите книгу сюда
      </div>
      <TrackerCard v-for="item in items" :key="item.card.id" :card="item.card" :book="item.book" @open="$emit('open-card', $event)"
        @remove="$emit('remove-card', $event)" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UButton, UBadge, UInput } from 'src/components/ui'
import TrackerCard from './TrackerCard.vue'

const props = defineProps({
  column: { type: Object, required: true },
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['add-book', 'rename', 'move', 'delete', 'open-card', 'remove-card', 'drop-card'])

const editing = ref(false)
const editTitle = ref(props.column.title)

const startEdit = () => {
  editTitle.value = props.column.title
  editing.value = true
}

const saveEdit = () => {
  if (editing.value) {
    emit('rename', props.column.id, editTitle.value)
    editing.value = false
  }
}

const onDrop = (e) => {
  const cardId = e.dataTransfer.getData('text/plain')
  if (cardId) emit('drop-card', cardId, props.column.id)
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.tracker-column {
  flex: 0 0 300px;
  width: 300px;
  background: $bg-card;
  border-radius: $radius-md;
  border: 1px solid rgba($primary, 0.1);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 220px);
}

body.body--light .tracker-column {
  background: $bg-card-light;
  border-color: rgba($primary, 0.05);
}

.tracker-column-header {
  padding: 12px 12px 10px;
  border-bottom: 3px solid;
}

.tracker-column-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.tracker-column-title {
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tracker-column-title-input {
  max-width: 140px;
}

.tracker-column-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 80px;
}

.tracker-column-empty {
  text-align: center;
  opacity: 0.5;
  font-style: italic;
  font-size: 13px;
  padding: 20px 10px;
  border: 2px dashed rgba($primary, 0.2);
  border-radius: $radius-sm;
}

@media (max-width: 768px) {
  .tracker-column {
    flex: 0 0 260px;
    width: 260px;
  }
}
</style>
