<template>
  <Button
    type="button"
    variant="outline"
    :size="size"
    class="flex-shrink-0 whitespace-nowrap"
    :aria-pressed="enabled"
    :title="enabled ? 'Desativar alto contraste' : 'Ativar alto contraste'"
    @click="handleToggle"
  >
    <ion-icon :name="enabled ? 'contrast' : 'contrast-outline'"></ion-icon>
    <span>{{ enabled ? 'Contraste ativo' : 'Alto contraste' }}</span>
  </Button>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Button from './UI/Button.vue'
import { applyHighContrast, isHighContrastEnabled, toggleHighContrast } from '../services/accessibility'

defineProps({
  size: {
    type: String,
    default: 'sm'
  }
})

const enabled = ref(isHighContrastEnabled())

const handleToggle = () => {
  enabled.value = toggleHighContrast()
}

const handleAccessibilityChange = (event) => {
  enabled.value = !!event.detail?.highContrast
}

onMounted(() => {
  applyHighContrast()
  window.addEventListener('accessibility-changed', handleAccessibilityChange)
})

onUnmounted(() => {
  window.removeEventListener('accessibility-changed', handleAccessibilityChange)
})
</script>

