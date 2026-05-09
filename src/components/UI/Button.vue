<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'rounded-full font-medium transition-all duration-200 cursor-pointer inline-flex items-center justify-center',
      sizeClass,
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream-100',
      variant === 'primary' 
        ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm focus:ring-brand-400 disabled:bg-brand-300 disabled:cursor-not-allowed'
        : variant === 'outline'
        ? 'border border-muted-200 bg-cream-50/80 hover:bg-brand-50 text-muted-700 focus:ring-brand-300 disabled:opacity-50'
        : 'bg-muted-100 hover:bg-muted-200 text-muted-800 focus:ring-muted-300 disabled:opacity-50',
      loading && 'opacity-70 cursor-wait'
    ]"
    @click="$emit('click', $event)"
  >
    <span
      v-if="loading"
      class="flex items-center justify-center"
      :class="size === 'sm' ? 'gap-1.5' : 'gap-2'"
    >
      <ion-icon name="hourglass-outline" class="animate-spin shrink-0"></ion-icon>
      <span>{{ loadingText || 'Carregando...' }}</span>
    </span>
    <span
      v-else
      class="flex items-center justify-center"
      :class="size === 'sm' ? 'gap-1.5' : 'gap-2'"
    >
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const SIZE_CLASSES = {
  sm: 'px-2.5 py-1.5 text-xs min-h-[2rem]',
  md: 'px-4 py-2.5 text-sm min-h-[2.75rem]',
  lg: 'px-6 py-3.5 text-base min-h-[3.25rem]'
}

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: null
  }
})

const sizeClass = computed(() => SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md)

defineEmits(['click'])
</script>
