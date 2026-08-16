<template>
  <UDialog v-model="visible" :title="book?.title" dialog-class="tracker-detail-dialog" :dark="$q.dark.isActive">
    <div v-if="card" class="row q-col-gutter-lg">
      <div class="col-12 col-sm-4">
        <q-img :src="book?.coverUrl || defaultCover" :ratio="5 / 7" fit="cover" class="rounded-borders" />
        <div class="text-caption text-center q-mt-sm" style="opacity: .7">{{ book?.author }}</div>
      </div>

      <div class="col-12 col-sm-8">
        <div class="detail-block">
          <div class="detail-label">Колонка</div>
          <USelect :model-value="card.columnId" :options="columnOptions" dense emit-value map-options
            @update:model-value="val => $emit('move-column', card.id, val)" />
        </div>

        <div class="detail-block">
          <div class="detail-label">Оценка</div>
          <q-rating :model-value="card.rating" :max="5" size="26px" color="orange" icon="star_border" icon-selected="star"
            @update:model-value="val => $emit('update-rating', card.id, val)" />
        </div>

        <div class="detail-block">
          <div class="detail-label">Прогресс: {{ card.progress }}%</div>
          <q-slider :model-value="card.progress" :min="0" :max="100" color="primary" label label-always
            @change="val => $emit('update-progress', card.id, val)" />
        </div>

        <div class="detail-block">
          <div class="detail-label">Время чтения: {{ formattedTime }}</div>
          <div class="row items-center q-gutter-sm">
            <UButton v-if="!isTimerRunning" icon="play_arrow" label="Начать сессию" color="primary" rounded size="sm"
              @click="$emit('start-timer', card.id)" />
            <UButton v-else icon="stop" label="Остановить" color="negative" rounded size="sm" @click="$emit('stop-timer', card.id)" />
            <div v-if="isTimerRunning" class="timer-live">{{ liveElapsed }}</div>
          </div>

          <div class="row items-center q-gutter-sm q-mt-sm">
            <UInput v-model.number="manualMinutes" type="number" dense label="Добавить минут" style="max-width: 160px" />
            <UButton label="Добавить" flat size="sm" :disabled="!manualMinutes" @click="addManual" />
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-label">Заметка</div>
          <UInput :model-value="card.notes" type="textarea" dense autogrow @update:model-value="val => $emit('update-notes', card.id, val)" />
        </div>

        <div v-if="card.sessions?.length" class="detail-block">
          <div class="detail-label">История сессий</div>
          <div class="sessions-list">
            <div v-for="(s, i) in [...card.sessions].reverse()" :key="i" class="session-item">
              {{ formatDate(s.date) }} — {{ s.minutes }} мин
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <UButton label="Удалить из трекера" icon="delete" color="negative" flat @click="$emit('remove', card.id)" />
      <UButton label="Закрыть" icon="close" color="primary" rounded @click="visible = false" />
    </template>
  </UDialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { UDialog, UButton, UInput, USelect } from 'src/components/ui'

const $q = useQuasar()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  card: { type: Object, default: null },
  book: { type: Object, default: null },
  columns: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'update:modelValue', 'update-rating', 'update-progress', 'update-notes',
  'start-timer', 'stop-timer', 'add-time', 'move-column', 'remove',
])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const defaultCover = 'https://via.placeholder.com/300x420/8C3800/FFFFFF?text=Нет+обложки'

const columnOptions = computed(() => props.columns.map(c => ({ label: c.title, value: c.id })))
const isTimerRunning = computed(() => !!props.card?.timerStartedAt)

const manualMinutes = ref(null)
const addManual = () => {
  if (manualMinutes.value > 0) {
    emit('add-time', props.card.id, manualMinutes.value)
    manualMinutes.value = null
  }
}

const formattedTime = computed(() => {
  const total = props.card?.timeSpent || 0
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}ч ${m}м` : `${m}м`
})

const now = ref(Date.now())
let intervalId = null
onMounted(() => { intervalId = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(intervalId))

const liveElapsed = computed(() => {
  if (!props.card?.timerStartedAt) return ''
  const elapsedSec = Math.floor((now.value - props.card.timerStartedAt) / 1000)
  const m = Math.floor(elapsedSec / 60)
  const s = elapsedSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) +
    ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.detail-block {
  margin-bottom: 20px;
}

.detail-label {
  font-size: 12px;
  opacity: 0.6;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.timer-live {
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  color: $primary;
}

.sessions-list {
  max-height: 140px;
  overflow-y: auto;
}

.session-item {
  font-size: 12px;
  padding: 4px 0;
  border-bottom: 1px solid rgba($primary, 0.08);
  opacity: 0.8;

  &:last-child {
    border-bottom: none;
  }
}
</style>
