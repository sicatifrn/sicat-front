<template>
  <div class="min-h-screen bg-cream-100">
    <div v-if="isInternalLayout" class="flex min-h-screen">
      <InternalSidebar />
      <main class="flex-1 lg:ml-0 pt-14 lg:pt-0">
        <router-view />
      </main>
    </div>

    <div v-else class="min-h-screen flex flex-col">
      <Header />
      <main class="flex-1 flex flex-col min-h-0">
        <router-view />
      </main>
      <Footer v-if="showFooter" />
    </div>
    <Toaster rich-colors position="top-right" />
    <div vw class="enabled">
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import InternalSidebar from './components/InternalSidebar.vue'
import { applyHighContrast } from './services/accessibility'

const route = useRoute()

const isInternalLayout = computed(() => route.meta.requiresAuth)

const authRoutes = ['/login', '/register', '/recuperar-senha']

const showFooter = computed(() => authRoutes.includes(route.path))

onMounted(() => {
  applyHighContrast()

  if (document.getElementById('vlibras-plugin-script')) {
    return
  }

  const script = document.createElement('script')
  script.id = 'vlibras-plugin-script'
  script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
  script.onload = () => {
    if (window.VLibras?.Widget) {
      new window.VLibras.Widget('https://vlibras.gov.br/app')
    }
  }
  document.body.appendChild(script)
})
</script>
