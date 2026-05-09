<template>
  <div class="flex-1 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md mx-auto">
      <Card>
          <div class="mb-4">
            <div class="mb-3 text-center">
              <h2 class="text-lg font-semibold text-gray-900 mb-1">
                {{ stepTitle }}
              </h2>
              <p class="text-sm text-gray-600">
                {{ stepSubtitle }}
              </p>
            </div>

            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-600">Etapa {{ currentStep }} de 3</span>
              <span class="text-xs font-medium text-gray-600">{{ progressPercentage }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-brand-600 transition-all duration-300 rounded-full"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </div>

          <div v-if="currentStep === 1" class="space-y-4">
            <Input
              id="matricula"
              label="Matrícula"
              v-model="form.matricula"
              placeholder="Digite sua matrícula"
              required
              :error="errors.matricula"
            />
            <Input
              id="senha_suap"
              label="Senha do SUAP"
              type="password"
              v-model="form.senha_suap"
              placeholder="Digite sua senha do SUAP"
              required
              :error="errors.senha_suap"
            />
          </div>

          <div v-else-if="currentStep === 2" class="space-y-4">
            <Card class="bg-brand-50 border-brand-200 p-4">
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
                  <p class="text-gray-900 font-medium">{{ suapDados?.nome_completo || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">CPF</label>
                  <p class="text-gray-900">{{ suapDados?.cpf || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Matrícula</label>
                  <p class="text-gray-900">{{ suapDados?.matricula || form.matricula }}</p>
                </div>
                <div v-if="suapDados?.campus">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Campus</label>
                  <p class="text-gray-900">{{ suapDados.campus }}</p>
                </div>
              </div>
            </Card>
          </div>

          <div v-else class="space-y-4">
            <Input
              id="nova_senha"
              label="Nova Senha"
              type="password"
              v-model="form.nova_senha"
              placeholder="Digite sua nova senha"
              required
              :error="errors.nova_senha"
            />
            <Input
              id="confirmar_senha"
              label="Confirmar Senha"
              type="password"
              v-model="form.confirmar_senha"
              placeholder="Confirme sua nova senha"
              required
              :error="errors.confirmar_senha"
            />
          </div>

          <div v-if="error" class="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p class="text-red-600 text-sm flex items-center gap-2">
              <ion-icon name="alert-circle-outline"></ion-icon>
              {{ error }}
            </p>
          </div>

          <div class="flex gap-3 mt-6">
            <template v-if="currentStep === 1">
              <Button
                type="button"
                @click="handleValidar"
                :loading="validating"
                loading-text="Validando..."
                class="w-full"
              >
                Validar Dados
              </Button>
            </template>
            <template v-else-if="currentStep === 2">
              <Button type="button" variant="outline" @click="currentStep = 1" class="flex-1">
                Voltar
              </Button>
              <Button type="button" @click="currentStep = 3" class="flex-1">
                Continuar
              </Button>
            </template>
            <template v-else>
              <Button type="button" variant="outline" @click="currentStep = 2" class="flex-1">
                Voltar
              </Button>
              <Button
                type="button"
                @click="handleRecuperar"
                :loading="loading"
                loading-text="Atualizando..."
                class="flex-1"
              >
                Criar Nova Senha
              </Button>
            </template>
          </div>
        </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'
import Card from '../components/UI/Card.vue'
import Input from '../components/UI/Input.vue'
import Button from '../components/UI/Button.vue'

const router = useRouter()

const currentStep = ref(1)
const form = ref({
  matricula: '',
  senha_suap: '',
  nova_senha: '',
  confirmar_senha: ''
})

const suapDados = ref(null)
const errors = ref({})
const error = ref('')
const validating = ref(false)
const loading = ref(false)

const progressPercentage = computed(() => Math.round((currentStep.value / 3) * 100))
const stepTitle = computed(() => {
  if (currentStep.value === 1) return 'Recuperação de Senha'
  if (currentStep.value === 2) return 'Confirmação de Dados'
  return 'Nova Senha'
})
const stepSubtitle = computed(() => {
  if (currentStep.value === 1) return 'Valide seus dados com matrícula e senha do SUAP'
  if (currentStep.value === 2) return 'Confira as informações antes de continuar'
  return 'Defina sua nova senha de acesso ao SICAT'
})

const handleValidar = async () => {
  errors.value = {}
  error.value = ''

  if (!form.value.matricula) errors.value.matricula = 'Matrícula é obrigatória'
  if (!form.value.senha_suap) errors.value.senha_suap = 'Senha do SUAP é obrigatória'
  if (Object.keys(errors.value).length) return

  validating.value = true
  try {
    const data = await authAPI.validateSuap(form.value.matricula, form.value.senha_suap)
    if (data?.valido) {
      suapDados.value = data.dados || data
      currentStep.value = 2
    } else {
      error.value = 'Não foi possível validar seus dados.'
    }
  } catch (err) {
    error.value = err.response?.data?.detail || 'Credenciais inválidas no SUAP.'
  } finally {
    validating.value = false
  }
}

const handleRecuperar = async () => {
  errors.value = {}
  error.value = ''

  if (!form.value.nova_senha) {
    errors.value.nova_senha = 'Nova senha é obrigatória'
  }
  if (!form.value.confirmar_senha) {
    errors.value.confirmar_senha = 'Confirmação de senha é obrigatória'
  } else if (form.value.confirmar_senha !== form.value.nova_senha) {
    errors.value.confirmar_senha = 'As senhas não coincidem'
  }

  if (Object.keys(errors.value).length) return

  loading.value = true
  try {
    await authAPI.recuperarAcesso(
      form.value.matricula,
      form.value.senha_suap,
      form.value.nova_senha,
      form.value.confirmar_senha
    )
    router.replace({
      path: '/login',
      query: { recuperacao: 'sucesso' }
    })
  } catch (err) {
    error.value = err.response?.data?.detail || 'Erro ao recuperar senha.'
  } finally {
    loading.value = false
  }
}
</script>
