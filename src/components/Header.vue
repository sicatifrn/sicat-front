<template>
  <header class="border-b border-muted-100 bg-cream-50/90 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4 overflow-x-auto">
        <div class="flex items-center gap-3 flex-shrink-0">
          <router-link
            to="/"
            class="flex items-center flex-shrink-0 min-w-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
          >
            <img
              src="/logo.svg"
              alt="SICAT — início"
              class="h-7 sm:h-9 w-auto max-w-[min(14rem,55vw)] object-contain object-left shrink-0"
              width="180"
              height="53"
            />
          </router-link>
          <nav v-if="isAuthenticated" class="flex items-center gap-2">
            <router-link to="/dashboard" custom v-slot="{ navigate, isActive }">
              <Button
                type="button"
                size="sm"
                variant="outline"
                class="flex-shrink-0 whitespace-nowrap"
                :class="isActive ? navActiveClass : ''"
                @click="navigate"
              >
                Dashboard
              </Button>
            </router-link>
            <router-link to="/fichas" custom v-slot="{ navigate, isActive }">
              <Button
                type="button"
                size="sm"
                variant="outline"
                class="flex-shrink-0 whitespace-nowrap"
                :class="isActive ? navActiveClass : ''"
                @click="navigate"
              >
                Fichas
              </Button>
            </router-link>
            <router-link
              v-if="userRole === 'admin'"
              to="/admin"
              custom
              v-slot="{ navigate, isActive }"
            >
              <Button
                type="button"
                size="sm"
                variant="outline"
                class="flex-shrink-0 whitespace-nowrap"
                :class="isActive ? navActiveClass : ''"
                @click="navigate"
              >
                Admin
              </Button>
            </router-link>
            <router-link
              v-if="userRole === 'bibliotecario'"
              to="/bibliotecario"
              custom
              v-slot="{ navigate, isActive }"
            >
              <Button
                type="button"
                size="sm"
                variant="outline"
                class="flex-shrink-0 whitespace-nowrap"
                :class="isActive ? navActiveClass : ''"
                @click="navigate"
              >
                Solicitações
              </Button>
            </router-link>
          </nav>
        </div>
        <div v-if="isAuthenticated" class="flex items-center gap-2 flex-shrink-0">
          <router-link to="/perfil" custom v-slot="{ navigate, isActive }">
            <Button
              type="button"
              size="sm"
              variant="outline"
              class="flex-shrink-0 whitespace-nowrap"
              :class="isActive ? navActiveClass : ''"
              @click="navigate"
            >
              <span class="hidden sm:inline">{{ userNome || 'Perfil' }}</span>
              <span class="sm:hidden">Perfil</span>
            </Button>
          </router-link>
        </div>
        <div v-else class="flex items-center gap-2 flex-shrink-0">
          <router-link to="/register" custom v-slot="{ navigate, isActive }">
            <Button
              type="button"
              size="sm"
              variant="outline"
              class="flex-shrink-0 whitespace-nowrap"
              :class="isActive ? navActiveClass : ''"
              @click="navigate"
            >
              Criar conta
            </Button>
          </router-link>
          <router-link to="/login" custom v-slot="{ navigate, isActive }">
            <Button
              type="button"
              size="sm"
              variant="outline"
              class="flex-shrink-0 whitespace-nowrap"
              :class="isActive ? navActiveClass : ''"
              @click="navigate"
            >
              Entrar
            </Button>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Button from './UI/Button.vue'

const route = useRoute()

const navActiveClass =
  'bg-brand-100 text-brand-800 border-brand-200 hover:bg-brand-100 hover:text-brand-900'

const isAuthenticated = ref(!!localStorage.getItem('access_token'))
const userRole = ref(localStorage.getItem('user_role') || '')
const userNome = ref('')

const atualizarEstado = () => {
  isAuthenticated.value = !!localStorage.getItem('access_token')
  userRole.value = localStorage.getItem('user_role') || ''
  const nome = localStorage.getItem('user_nome') || ''
  userNome.value = nome.split(' ')[0] || nome
}

const handleStorageChange = (e) => {
  if (e.key === 'access_token' || e.key === 'user_role' || e.key === 'user_nome') {
    atualizarEstado()
  }
}

const handleAuthChange = () => {
  atualizarEstado()
}

watch(() => route.path, () => {
  atualizarEstado()
}, { immediate: true })

onMounted(() => {
  atualizarEstado()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('auth-changed', handleAuthChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('auth-changed', handleAuthChange)
})
</script>
