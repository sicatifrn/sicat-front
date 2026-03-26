<template>
  <div>
    <button
      v-if="isMobile"
      @click="isOpen = !isOpen"
      class="fixed top-4 left-4 z-40 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm"
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
        'bg-white border-r border-gray-200 h-screen overflow-y-auto z-40',
        isMobile
          ? `fixed top-0 left-0 w-72 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'sticky top-0 w-64 flex-shrink-0'
      ]"
    >
      <div class="p-4 border-b border-gray-200">
        <router-link to="/dashboard" class="flex items-center gap-2">
          <ion-icon name="library-outline" class="text-xl text-purple-600"></ion-icon>
          <span class="text-lg font-bold text-gray-900">SICAT</span>
        </router-link>
      </div>

      <nav class="p-3 space-y-2">
        <router-link
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          @click="closeOnMobile"
          :class="[
            'flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition-colors',
            route.path.startsWith(item.match) ? item.activeClass : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          ]"
        >
          <ion-icon :name="item.icon"></ion-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isOpen = ref(false)
const isMobile = ref(false)
const userRole = ref(localStorage.getItem('user_role') || '')

const updateViewport = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isOpen.value = false
  }
}

const items = computed(() => {
  const base = [
    { to: '/dashboard', match: '/dashboard', label: 'Dashboard', icon: 'grid-outline', activeClass: 'bg-indigo-100 text-indigo-700' },
    { to: '/fichas', match: '/fichas', label: 'Fichas', icon: 'document-text-outline', activeClass: 'bg-emerald-100 text-emerald-700' },
    { to: '/perfil', match: '/perfil', label: 'Perfil', icon: 'person-outline', activeClass: 'bg-amber-100 text-amber-700' }
  ]

  if (userRole.value === 'admin') {
    base.splice(2, 0, { to: '/admin', match: '/admin', label: 'Admin', icon: 'settings-outline', activeClass: 'bg-fuchsia-100 text-fuchsia-700' })
  }
  if (userRole.value === 'bibliotecario') {
    base.splice(2, 0, { to: '/bibliotecario', match: '/bibliotecario', label: 'Solicitações', icon: 'book-outline', activeClass: 'bg-sky-100 text-sky-700' })
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
