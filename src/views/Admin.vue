<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <ion-icon name="settings-outline" class="text-brand-600"></ion-icon>
        Administração
      </h1>
      <p class="text-gray-600">Painel de administração do sistema</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6 items-start">
      <nav class="bg-cream-50 border border-muted-100 rounded-xl p-3 space-y-2 lg:sticky lg:top-6 shadow-sm">
        <button
          @click="handleTabChange('usuarios')"
          :class="[
            'w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center',
            activeTab === 'usuarios'
              ? 'bg-brand-100 text-brand-700'
              : 'text-muted-500 hover:bg-brand-50/60 hover:text-muted-800'
          ]"
        >
          <ion-icon name="people-outline" class="text-base mr-2"></ion-icon>
          Usuários
        </button>
        <button
          @click="handleTabChange('fichas')"
          :class="[
            'w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center',
            activeTab === 'fichas'
              ? 'bg-brand-100 text-brand-700'
              : 'text-muted-500 hover:bg-brand-50/60 hover:text-muted-800'
          ]"
        >
          <ion-icon name="document-text-outline" class="text-base mr-2"></ion-icon>
          Fichas
        </button>
        <button
          @click="handleTabChange('bibliotecas')"
          :class="[
            'w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center',
            activeTab === 'bibliotecas'
              ? 'bg-brand-100 text-brand-700'
              : 'text-muted-500 hover:bg-brand-50/60 hover:text-muted-800'
          ]"
        >
          <ion-icon name="library-outline" class="text-base mr-2"></ion-icon>
          Bibliotecas
        </button>
      </nav>

      <AdminUsuarios v-if="activeTab === 'usuarios'" />

      <AdminFichas v-else-if="activeTab === 'fichas'" />

      <AdminBibliotecas v-else-if="activeTab === 'bibliotecas'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminUsuarios from './AdminUsuarios.vue'
import AdminFichas from './AdminFichas.vue'
import AdminBibliotecas from './AdminBibliotecas.vue'

const activeTab = ref('usuarios')

const handleTabChange = (tab) => {
  activeTab.value = tab
}
</script>
