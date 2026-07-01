<template>
  <div class="flex-1 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 mb-2">
          Bem-vindo ao SICAT
        </h1>
        <p class="text-gray-600 text-sm leading-relaxed">
          Acesse com sua conta do <span class="font-semibold text-brand-700">SUAP</span> para continuar.
        </p>
      </div>
      <Card>
        <div class="space-y-5">
          <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200">
            <p class="text-red-600 text-sm flex items-center gap-2">
              <ion-icon name="alert-circle-outline"></ion-icon>
              {{ error }}
            </p>
          </div>

          <Button
            type="button"
            :loading="loading"
            loading-text="Redirecionando..."
            class="w-full"
            @click="handleSuapLogin"
          >
            Acessar com SUAP
          </Button>

          <p class="text-center text-xs text-gray-500 leading-relaxed">
            Você será redirecionado para o portal do SUAP para autenticação segura.
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '../services/api'
import Card from '../components/UI/Card.vue'
import Button from '../components/UI/Button.vue'

const router = useRouter()
const route = useRoute()

const error = ref('')
const loading = ref(false)

const salvarSessao = async (token, tipo) => {
  localStorage.setItem('access_token', token)
  localStorage.setItem('user_role', tipo || '')

  try {
    const userData = await authAPI.getMe()
    localStorage.setItem('user_nome', userData.nome_completo || '')
    localStorage.setItem('user_role', userData.tipo || tipo || '')
    localStorage.setItem('user_id', userData.id || '')
  } catch {
    // Perfil pode falhar sem invalidar o token recém-emitido
  }

  window.dispatchEvent(new Event('auth-changed'))
  router.replace('/dashboard')
}

onMounted(async () => {
  const token = route.query.token
  const tipo = route.query.tipo
  const erro = route.query.error

  if (erro) {
    error.value = String(erro)
    router.replace({ query: {} })
    return
  }

  if (token) {
    loading.value = true
    try {
      await salvarSessao(String(token), String(tipo || ''))
    } catch {
      error.value = 'Não foi possível concluir o login com o SUAP.'
      router.replace({ query: {} })
    } finally {
      loading.value = false
    }
  }
})

const handleSuapLogin = () => {
  error.value = ''
  loading.value = true
  window.location.href = authAPI.getSuapLoginUrl()
}
</script>
