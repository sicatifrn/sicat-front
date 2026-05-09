<template>
  <footer class="border-t border-gray-200 bg-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div
        class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
      >
        <div
          class="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4 sm:min-w-0 text-center sm:text-left"
        >
          <div class="flex items-center justify-center sm:justify-start min-w-0">
            <img
              src="/logo.svg"
              alt="SICAT"
              class="h-8 sm:h-9 w-auto max-w-[min(16rem,90vw)] object-contain object-center sm:object-left shrink-0"
              width="200"
              height="58"
            />
          </div>
          <p
            class="text-xs sm:text-sm text-gray-600 leading-snug max-w-prose mx-auto sm:mx-0 px-1 sm:px-0 sm:border-l sm:border-gray-200 sm:pl-4"
          >
            Sistema de Catalogação de Trabalhos Acadêmicos
          </p>
        </div>
        <p
          class="text-xs sm:text-sm text-gray-500 text-center sm:text-right shrink-0 pt-1 border-t border-gray-100 sm:border-0 sm:pt-0"
        >
          © {{ new Date().getFullYear() }} SICAT. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

