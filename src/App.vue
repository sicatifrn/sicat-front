<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="isInternalLayout" class="flex min-h-screen">
      <InternalSidebar />
      <main class="flex-1 lg:ml-0 pt-14 lg:pt-0">
        <router-view />
      </main>
    </div>

    <div v-else class="min-h-screen flex flex-col">
      <Header />
      <main class="flex-1">
        <router-view />
      </main>
      <Footer v-if="showFooter" />
    </div>
    <Toaster rich-colors position="top-right" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import InternalSidebar from './components/InternalSidebar.vue'

const route = useRoute()

const isInternalLayout = computed(() => route.meta.requiresAuth)

const showFooter = computed(() => {
  const routesWithFooter = ['/login', '/register', '/recuperar-senha']
  return routesWithFooter.includes(route.path)
})
</script>
