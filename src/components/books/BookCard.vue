<template>
  <div class="book-wrapper" @click="handleClick">
    <div class="book-container">
      <div class="book" :style="{ backgroundImage: `url(${book.coverUrl})` }">
        <div class="book-overlay">
          <div class="book-title">{{ book.title }}</div>
          <div class="book-author">{{ book.author }}</div>
          <UBadge v-if="book.notes.length > 0" :label="book.notes.length" variant="glow" class="book-notes-badge" :dark="$q.dark.isActive" />
        </div>
      </div>
    </div>

    <q-tooltip v-if="book.notes.length > 0" anchor="top middle" self="bottom middle" :offset="[0, 10]">
      <div class="text-weight-medium q-mb-sm">📝 Заметки ({{ book.notes.length }})</div>
      <div v-for="(note, idx) in book.notes" :key="idx" class="note-tooltip-item">
        <q-icon name="bookmark" :color="$q.dark.isActive ? 'orange' : 'primary'" size="12px" class="q-mr-xs" />
        {{ note }}
      </div>
    </q-tooltip>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { UBadge } from 'src/components/ui'

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click'])
const $q = useQuasar()

const handleClick = () => {
  emit('click', props.book)
}
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

.book-wrapper {
  cursor: pointer;
  animation: bookAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  width: 100%;
  max-width: 180px;
  justify-self: center;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    z-index: 10;
  }

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 0.05}s;
    }
  }
}

.book-container {
  width: 100%;
  aspect-ratio: 140 / 200;
  perspective: 1000px;
}

.book {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 3px 6px 6px 3px;
  background-size: cover;
  background-position: center;
  box-shadow: -4px 6px 20px rgba(0, 0, 0, 0.3);
  transform: rotateY(-1deg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  background-color: $accent;

  &:not([style*="url"]) {
    background: linear-gradient(135deg, $accent 0%, #1a100a 100%);
  }

  .book-wrapper:hover & {
    transform: rotateY(-3deg) scale(1.02);
    box-shadow: -8px 12px 35px rgba(0, 0, 0, 0.5);
  }
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.85) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px 18px;
  opacity: 0;
  transition: opacity 0.3s ease;

  .book-wrapper:hover & {
    opacity: 1;
  }
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
  margin-top: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-notes-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.note-tooltip-item {
  padding: 4px 0;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.4;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: flex-start;
  color: rgba(255, 255, 255, 0.7);

  &:last-child {
    border-bottom: none;
  }
}

// Светлая тема через body класс
body.body--light {
  .book {
    background-color: #f0e8e0;
    box-shadow: -4px 6px 20px rgba(0, 0, 0, 0.15);
  }

  .book-overlay {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.6) 100%);
  }

  .book-title {
    color: $text-primary-light;
  }

  .book-author {
    color: $text-secondary-light;
  }

  .note-tooltip-item {
    color: $text-secondary-light;
    border-bottom-color: rgba($text-primary-light, 0.1);
  }
}

@media (max-width: 1440px) {
  .book-wrapper {
    max-width: 170px;
  }
}

@media (max-width: 1200px) {
  .book-wrapper {
    max-width: 160px;
  }
}

@media (max-width: 992px) {
  .book-wrapper {
    max-width: 150px;
  }

  .book-title {
    font-size: 14px;
  }

  .book-author {
    font-size: 12px;
  }

  .book-overlay {
    padding: 14px 12px;
  }
}

@media (max-width: 768px) {
  .book-wrapper {
    max-width: 130px;
  }

  .book-title {
    font-size: 13px;
  }

  .book-author {
    font-size: 11px;
  }

  .book-overlay {
    padding: 12px 10px;
  }
}

@media (max-width: 576px) {
  .book-wrapper {
    max-width: 110px;
  }

  .book-title {
    font-size: 11px;
  }

  .book-author {
    font-size: 10px;
  }

  .book-overlay {
    padding: 10px 8px;
  }
}

@media (max-width: 480px) {
  .book-wrapper {
    max-width: 100px;
  }

  .book-overlay {
    padding: 8px 6px;
  }

  .book-title {
    font-size: 10px;
  }

  .book-author {
    font-size: 9px;
  }
}
</style>
