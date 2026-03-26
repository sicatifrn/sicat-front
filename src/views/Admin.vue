<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <ion-icon name="settings-outline" class="text-purple-600"></ion-icon>
        Administração
      </h1>
      <p class="text-gray-600">Painel de administração do sistema</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6 items-start">
      <nav class="bg-white border border-gray-200 rounded-xl p-3 space-y-2 lg:sticky lg:top-6">
        <button
          @click="handleTabChange('usuarios')"
          :class="[
            'w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center',
            activeTab === 'usuarios'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
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
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
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
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
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
