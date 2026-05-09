<template>
  <div class="flex-1 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 mb-2">
          Bem-vindo de volta
        </h1>
        <p class="text-gray-600 text-sm leading-relaxed">
          Entre com sua matrícula e senha para continuar no <span class="font-semibold text-brand-700">SICAT</span>.
        </p>
      </div>
      <Card>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <Input
            id="matricula"
            label="Matrícula"
            v-model="form.matricula"
            placeholder="Digite sua matrícula"
            required
            :error="errors.matricula"
          />
          <Input
            id="senha"
            label="Senha"
            type="password"
            v-model="form.senha"
            placeholder="Digite sua senha"
            required
            :error="errors.senha"
          />
          
          <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200">
            <p class="text-red-600 text-sm flex items-center gap-2">
              <ion-icon name="alert-circle-outline"></ion-icon>
              {{ error }}
            </p>
          </div>

          <div class="flex gap-3">
            <router-link to="/register" class="flex-1">
              <Button variant="outline" class="w-full">
                Criar conta
              </Button>
            </router-link>
            <Button
              type="submit"
              :loading="loading"
              loading-text="Entrando..."
              class="flex-1"
            >
              Entrar
            </Button>
          </div>
          <div class="text-center">
            <router-link to="/recuperar-senha" class="text-sm text-brand-700 hover:text-brand-800 font-medium">
              Esqueci minha senha
            </router-link>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '../services/api'
import Card from '../components/UI/Card.vue'
import Input from '../components/UI/Input.vue'
import Button from '../components/UI/Button.vue'
import { notifySuccess } from '../services/toast'

const router = useRouter()
const route = useRoute()

const form = ref({
  matricula: '',
  senha: ''
})

const errors = ref({})
const error = ref('')
const loading = ref(false)
const checkSuccessMessage = () => {
  const registro = route.query.registro
  const recuperacao = route.query.recuperacao
  if (registro === 'sucesso' || registro === 'true') {
    notifySuccess('Conta criada com sucesso! Agora você pode entrar no sistema.')
    setTimeout(() => {
      router.replace({ query: {} })
    }, 200)
  }
  if (recuperacao === 'sucesso' || recuperacao === 'true') {
    notifySuccess('Senha atualizada com sucesso. Agora entre com sua nova senha.')
    setTimeout(() => {
      router.replace({ query: {} })
    }, 200)
  }
}

onMounted(() => {
  checkSuccessMessage()
})

watch(() => route.query.registro, (newVal) => {
  if (newVal === 'sucesso' || newVal === 'true') {
    notifySuccess('Conta criada com sucesso! Agora você pode entrar no sistema.')
    setTimeout(() => {
      router.replace({ query: {} })
    }, 200)
  }
}, { immediate: true })

watch(() => route.query.recuperacao, (newVal) => {
  if (newVal === 'sucesso' || newVal === 'true') {
    notifySuccess('Senha atualizada com sucesso. Agora entre com sua nova senha.')
    setTimeout(() => {
      router.replace({ query: {} })
    }, 200)
  }
}, { immediate: true })

const handleLogin = async () => {
  errors.value = {}
  error.value = ''
  
  if (!form.value.matricula) {
    errors.value.matricula = 'Matrícula é obrigatória'
    return
  }
  
  if (!form.value.senha) {
    errors.value.senha = 'Senha é obrigatória'
    return
  }
  
  loading.value = true

  try {
    const response = await authAPI.login(form.value.matricula, form.value.senha)
    
    localStorage.setItem('access_token', response.token)
    localStorage.setItem('user_role', response.tipo || '')
    
    try {
      const userData = await authAPI.getMe()
      localStorage.setItem('user_nome', userData.nome_completo || '')
      localStorage.setItem('user_role', userData.tipo || response.tipo || '')
      localStorage.setItem('user_id', userData.id || '')
    } catch (e) {
    }
    
    window.dispatchEvent(new Event('auth-changed'))
    
    router.push('/dashboard')
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Usuário ou senha incorretos'
    } else {
      error.value = 'Erro ao fazer login. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

