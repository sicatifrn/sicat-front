<template>
  <div class="min-h-0 flex-1">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header class="mb-8 border-b border-muted-200 pb-6">
        <h1 class="mb-1 flex items-center gap-2 text-2xl font-bold tracking-tight text-muted-900">
          <ion-icon name="settings-outline" class="text-brand-600"></ion-icon>
          Administração
        </h1>
        <p class="text-sm text-muted-600">
          Gestão de utilizadores, fichas catalográficas e bibliotecas.
        </p>
      </header>

      <nav
        class="mb-8 flex flex-wrap gap-1 rounded-2xl border border-muted-200 bg-cream-50/80 p-1 shadow-sm"
        aria-label="Secções do painel admin"
      >
        <router-link
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:justify-start"
          :class="
            isActive(tab)
              ? 'bg-white text-brand-800 shadow-sm ring-1 ring-muted-200'
              : 'text-muted-600 hover:bg-white/60 hover:text-muted-900'
          "
        >
          <ion-icon :name="tab.icon" class="text-lg shrink-0"></ion-icon>
          <span>{{ tab.label }}</span>
        </router-link>
      </nav>

      <div class="rounded-2xl border border-muted-100 bg-white/90 p-5 shadow-sm sm:p-6">
        <router-view v-slot="{ Component }">
          <Transition name="fade-tab" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { to: '/admin/usuarios', label: 'Utilizadores', icon: 'people-outline' },
  { to: '/admin/fichas', label: 'Fichas', icon: 'document-text-outline' },
  { to: '/admin/bibliotecas', label: 'Bibliotecas', icon: 'library-outline' }
]

const isActive = (tab) => route.path === tab.to
</script>

<style scoped>
.fade-tab-enter-active,
.fade-tab-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-tab-enter-from,
.fade-tab-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
