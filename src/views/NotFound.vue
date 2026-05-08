<!-- src/views/NotFound.vue -->
<template>
  <div class="min-h-screen bg-black text-white flex items-center justify-center px-6">
    <div class="max-w-2xl text-center">
      
      <!-- Código -->
      <h1 class="text-8xl md:text-9xl font-extrabold tracking-widest text-white">
        404
      </h1>

      <!-- Linha decorativa -->
      <div class="w-32 h-1 bg-white mx-auto my-6 rounded-full opacity-70"></div>

      <!-- Título -->
      <h2 class="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4">
        Página não encontrada
      </h2>

      <!-- Texto -->
      <p class="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
        A página que você tentou acessar não existe ou foi movida.
        Verifique o endereço informado ou volte para o sistema.
      </p>

      <!-- Botões -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/dashboard"
          class="px-8 py-3 border border-white text-white font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition duration-300 rounded-lg"
        >
          Ir para Dashboard
        </router-link>

        <router-link
          to="/login"
          class="px-8 py-3 bg-white text-black font-semibold uppercase tracking-wide hover:bg-gray-200 transition duration-300 rounded-lg"
        >
          Fazer Login
        </router-link>
      </div>

      <!-- Rodapé -->
      <p class="mt-12 text-gray-500 text-sm tracking-wide">
        Sistema Biblioteca • Página de erro
      </p>
    </div>
  </div>
</template>

<script setup>
// Tela 404
</script>
