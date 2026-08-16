<template>
  <div class="tracker-card" draggable="true" @dragstart="onDragStart" @click="$emit('open', card.id)">
    <div class="tracker-card-cover" :style="book?.coverUrl ? { backgroundImage: `url(${book.coverUrl})` } : {}">
      <div v-if="!book?.coverUrl" class="tracker-card-cover-placeholder">
        <q-icon name="menu_book" size="20px" />
      </div>
    </div>

    <div class="tracker-card-body">
      <div class="tracker-card-title">{{ book?.title || 'Книга удалена' }}</div>
      <div class="tracker-card-author">{{ book?.author }}</div>

      <q-linear-progress :value="card.progress / 100" color="primary" size="6px" rounded class="q-my-xs" />
      <div class="tracker-card-progress-label">{{ card.progress }}%</div>

      <div class="tracker-card-meta row items-center no-wrap">
        <q-rating :model-value="card.rating" :max="5" size="13px" color="orange" readonly icon="star_border" icon-selected="star" />
        <q-space />
        <UChip v-if="card.timeSpent" :label="formattedTime" icon="schedule" dense size="sm" color="primary" text-color="white" />
        <q-icon v-if="isTimerRunning" name="fiber_manual_record" color="red" size="12px" class="timer-pulse q-ml-xs" />
      </div>
    </div>

    <UButton icon="close" flat round size="xs" class="tracker-card-remove" @click.stop="$emit('remove', card.id)" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { UButton, UChip } from 'src/components/ui'

const props = defineProps({
  card: { type: Object, required: true },
  book: { type: Object, default: null },
})

defineEmits(['open', 'remove'])

const isTimerRunning = computed(() => !!props.card.timerStartedAt)

const formattedTime = computed(() => {
  const total = props.card.timeSpent || 0
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}ч ${m}м` : `${m}м`
})

const onDragStart = (e) => {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.card.id)
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.tracker-card {
  position: relative;
  display: flex;
  gap: 10px;
  padding: 10px;
  background: rgba($primary, 0.05);
  border-radius: $radius-sm;
  border-left: 3px solid $primary;
  cursor: grab;
  transition: background 0.2s, transform 0.15s;

  &:hover {
    background: rgba($primary, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }
}

body.body--light .tracker-card {
  background: rgba($primary, 0.04);

  &:hover {
    background: rgba($primary, 0.08);
  }
}

.tracker-card-cover {
  width: 40px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-color: $accent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tracker-card-cover-placeholder {
  opacity: 0.6;
}

.tracker-card-body {
  flex: 1;
  min-width: 0;
}

.tracker-card-title {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tracker-card-author {
  font-size: 11px;
  opacity: 0.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tracker-card-progress-label {
  font-size: 10px;
  opacity: 0.6;
}

.tracker-card-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.tracker-card:hover .tracker-card-remove {
  opacity: 1;
}

.timer-pulse {
  animation: pulse 1.2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}
</style>
