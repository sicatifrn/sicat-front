<template>
  <div>
    <button
      v-if="isMobile"
      @click="isOpen = !isOpen"
      class="fixed top-4 left-4 z-40 inline-flex items-center justify-center rounded-lg border border-muted-200 bg-cream-50 p-2 text-muted-700 shadow-sm"
      aria-label="Abrir menu"
    >
      <ion-icon :name="isOpen ? 'close-outline' : 'menu-outline'" class="text-xl"></ion-icon>
    </button>

    <div
      v-if="isMobile && isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-30 bg-black/40"
    ></div>

    <aside
      :class="[
        'bg-cream-50 border-r border-muted-100 h-screen overflow-y-auto z-40 flex flex-col',
        isMobile
          ? `fixed top-0 left-0 w-72 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'sticky top-0 w-64 flex-shrink-0'
      ]"
    >
      <div class="p-4 border-b border-muted-100">
        <router-link to="/dashboard" class="flex items-center gap-2">
          <ion-icon name="library-outline" class="text-xl text-brand-600"></ion-icon>
          <span class="text-lg font-bold text-muted-800">SICAT</span>
        </router-link>
      </div>

      <nav class="p-3 space-y-2 flex-1 min-h-0">
        <router-link
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          @click="closeOnMobile"
          :class="[
            'flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition-colors',
            route.path.startsWith(item.match) ? item.activeClass : 'text-muted-600 hover:bg-brand-50/80 hover:text-muted-900'
          ]"
        >
          <ion-icon :name="item.icon"></ion-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="border-t border-muted-200 p-3 bg-cream-100/80 shrink-0">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-2 text-left text-xs font-semibold text-muted-800 hover:text-brand-800"
          @click="apiPanelOpen = !apiPanelOpen"
        >
          <span class="flex items-center gap-1.5">
            <ion-icon name="code-slash-outline" class="text-base text-brand-600"></ion-icon>
            API (origem das chamadas)
          </span>
          <ion-icon :name="apiPanelOpen ? 'chevron-up-outline' : 'chevron-down-outline'" class="text-lg text-muted-500"></ion-icon>
        </button>

        <div v-show="apiPanelOpen" class="mt-2 space-y-2">
          <p class="text-[10px] font-medium uppercase tracking-wide text-muted-500">Base URL (SICAT)</p>
          <code class="block max-h-20 overflow-y-auto break-all rounded border border-muted-200 bg-white p-2 text-[10px] leading-snug text-muted-900">
            {{ apiBaseUrlResolved }}
          </code>
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="rounded-full border border-muted-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-muted-700 hover:bg-brand-50"
              @click="copyApiBase"
            >
              Copiar URL
            </button>
            <button
              type="button"
              class="rounded-full border border-muted-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-muted-700 hover:bg-red-50"
              @click="clearApiRequestLog"
            >
              Limpar log
            </button>
          </div>
          <p class="text-[10px] font-medium uppercase tracking-wide text-muted-500">Últimas respostas</p>
          <ul class="max-h-40 space-y-1 overflow-y-auto rounded border border-muted-200 bg-white p-2 text-[10px]">
            <li v-if="!apiRequestLog.length" class="text-muted-500">Nenhuma chamada ainda nesta sessão.</li>
            <li
              v-for="(row, idx) in apiRequestLog"
              :key="idx"
              class="break-all font-mono leading-tight"
              :class="row.ok ? 'text-green-800' : 'text-red-700'"
            >
              <span class="text-muted-500">{{ row.source }}</span>
              {{ row.method }} {{ row.path }} → {{ row.status }}
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import '../services/api'
import { apiBaseUrlResolved, apiRequestLog, clearApiRequestLog } from '../services/apiDebug'
import { notifySuccess, notifyError } from '../services/toast'

const route = useRoute()
const isOpen = ref(false)
const isMobile = ref(false)
const userRole = ref(localStorage.getItem('user_role') || '')
const apiPanelOpen = ref(true)

const copyApiBase = async () => {
  const url = apiBaseUrlResolved.value
  if (!url) return
  try {
    await navigator.clipboard.writeText(url)
    notifySuccess('URL da API copiada.')
  } catch {
    notifyError('Não foi possível copiar para a área de transferência.')
  }
}

const updateViewport = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isOpen.value = false
  }
}

const items = computed(() => {
  const base = [
    { to: '/dashboard', match: '/dashboard', label: 'Dashboard', icon: 'grid-outline', activeClass: 'bg-brand-100 text-brand-800' },
    { to: '/fichas', match: '/fichas', label: 'Fichas', icon: 'document-text-outline', activeClass: 'bg-brand-100 text-brand-800' },
    { to: '/perfil', match: '/perfil', label: 'Perfil', icon: 'person-outline', activeClass: 'bg-brand-100 text-brand-800' }
  ]

  if (userRole.value === 'admin') {
    base.splice(2, 0, { to: '/admin', match: '/admin', label: 'Admin', icon: 'settings-outline', activeClass: 'bg-muted-100 text-muted-800' })
  }
  if (userRole.value === 'bibliotecario') {
    base.splice(2, 0, { to: '/bibliotecario', match: '/bibliotecario', label: 'Solicitações', icon: 'book-outline', activeClass: 'bg-brand-100 text-brand-800' })
  }

  return base
})

const closeOnMobile = () => {
  if (isMobile.value) isOpen.value = false
}

const handleAuthChange = () => {
  userRole.value = localStorage.getItem('user_role') || ''
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
  window.addEventListener('auth-changed', handleAuthChange)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport)
  window.removeEventListener('auth-changed', handleAuthChange)
})
</script>
