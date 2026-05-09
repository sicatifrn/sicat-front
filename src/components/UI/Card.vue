<template>
  <div :class="['p-6 rounded-3xl border border-muted-100 bg-cream-50 shadow-sm', padding && `p-${padding}`]">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  padding: String
})
</script>

