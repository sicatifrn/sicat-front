<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="show"
        class="fixed inset-0 z-[60] flex justify-end"
        role="dialog"
        aria-modal="true"
        @keydown.escape.prevent="$emit('close')"
      >
        <div
          class="drawer-backdrop absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          aria-hidden="true"
          @click.self="$emit('close')"
        ></div>
        <aside
          :class="[
            'drawer-panel relative z-10 flex h-full w-full flex-col border-l border-muted-200 bg-cream-50 shadow-2xl',
            wide ? 'max-w-xl' : 'max-w-md'
          ]"
        >
          <header
            class="flex shrink-0 items-start justify-between gap-3 border-b border-muted-100 bg-cream-50/95 px-5 py-4"
          >
            <div class="min-w-0 flex-1">
              <h2 v-if="title" class="text-lg font-bold tracking-tight text-muted-900">{{ title }}</h2>
              <slot v-else name="title"></slot>
              <p v-if="subtitle" class="mt-1 text-sm text-muted-600">{{ subtitle }}</p>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-lg p-2 text-muted-500 transition hover:bg-muted-100 hover:text-muted-800"
              aria-label="Fechar"
              @click="$emit('close')"
            >
              <ion-icon name="close-outline" class="text-2xl"></ion-icon>
            </button>
          </header>
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="shrink-0 border-t border-muted-100 bg-cream-50/95 px-5 py-4">
            <slot name="footer"></slot>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  wide: { type: Boolean, default: false }
})

defineEmits(['close'])
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.22s ease;
}
.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
