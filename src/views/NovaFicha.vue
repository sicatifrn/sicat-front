<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ion-icon name="add-circle-outline" class="text-brand-600"></ion-icon>
            Nova Ficha Catalográfica
          </h1>
          <p class="text-gray-600">Preencha os dados da ficha catalográfica</p>
        </div>
        <Button
          type="button"
          variant="outline"
          @click="preencherDadosAleatorios"
          class="flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <ion-icon name="shuffle-outline"></ion-icon>
          <span class="sm:inline">Preencher com Dados Aleatórios</span>
        </Button>
      </div>
    </div>

    <Card>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Dados do Autor</h2>
          <div>
            <Input
              label="Nome completo"
              v-model="form.autor_nome_completo"
              placeholder="Ex: Cecília Aine da Silva"
              required
            />
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Orientação</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome completo do orientador"
              v-model="form.orientador_nome_completo"
              placeholder="Ex: Dra. Cecília Aine da Silva"
            />
            <Input
              label="Nome completo do coorientador"
              v-model="form.coorientador_nome_completo"
              placeholder="Ex: Dr. João da Silva"
            />
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Dados do Trabalho</h2>
          <div class="space-y-4">
            <Input label="Título" v-model="form.titulo" required />
            <Input label="Subtítulo" v-model="form.subtitulo" />
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dia <span class="text-red-500">*</span></label>
                <select v-model="form.data_dia" required :class="selectClass">
                  <option value="">Dia</option>
                  <option v-for="dia in dias" :key="dia" :value="dia">{{ dia }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mês <span class="text-red-500">*</span></label>
                <select v-model="form.data_mes" required :class="selectClass">
                  <option value="">Mês</option>
                  <option v-for="mes in meses" :key="mes.value" :value="mes.value">{{ mes.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ano <span class="text-red-500">*</span></label>
                <select v-model="form.data_ano" required :class="selectClass">
                  <option value="">Ano</option>
                  <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input label="Cidade" v-model="form.cidade" required />
              <Input label="Campus" v-model="form.campus" required />
            </div>
            <Input label="Programa" v-model="form.programa" required />
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nível de ensino <span class="text-red-500">*</span>
              </label>
              <select v-model="form.nivel_ensino" required :class="selectClass">
                <option value="">Selecione o nível de ensino</option>
                <option v-for="nivel in niveisEnsino" :key="nivel.value" :value="nivel.value">
                  {{ nivel.label }}
                </option>
              </select>
            </div>
            <Input label="Curso" v-model="form.curso" required />
            <Textarea label="Palavras-chave" v-model="form.palavras_chave" required />
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tipo de trabalho <span class="text-red-500">*</span>
              </label>
              <select v-model="form.tipo_trabalho" required :class="selectClass">
                <option value="">Selecione o tipo de trabalho</option>
                <option v-for="tipo in tiposTrabalho" :key="tipo.value" :value="tipo.value">
                  {{ tipo.label }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Biblioteca <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.biblioteca_id"
                required
                :class="selectClass"
                :disabled="loadingBibliotecas"
              >
                <option value="">Selecione uma biblioteca</option>
                <option
                  v-for="biblioteca in bibliotecas"
                  :key="biblioteca.id"
                  :value="biblioteca.id"
                >
                  {{ biblioteca.nome }} - {{ biblioteca.campus }}
                </option>
              </select>
              <p v-if="loadingBibliotecas" class="mt-1 text-xs text-gray-500">Carregando bibliotecas...</p>
              <p v-else-if="bibliotecas.length === 0" class="mt-1 text-xs text-red-600">
                Nenhuma biblioteca disponível. Entre em contato com o administrador.
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">PDF do TCC</label>
              <div class="flex items-center gap-4">
                <label
                  for="pdf_tcc"
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <ion-icon name="document-attach-outline"></ion-icon>
                  {{ pdfFile ? pdfFile.name : 'Selecionar PDF' }}
                </label>
                <input
                  id="pdf_tcc"
                  type="file"
                  accept="application/pdf"
                  @change="handleFileChange"
                  class="hidden"
                />
                <button
                  v-if="pdfFile"
                  type="button"
                  @click="pdfFile = null"
                  class="text-sm text-red-500 hover:text-red-400"
                >
                  Remover
                </button>
              </div>
              <div class="mt-2 space-y-1">
                <p v-if="pdfFile" class="text-sm text-gray-900">
                  Tamanho: <span class="font-medium">{{ formatFileSize(pdfFile.size) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4 pt-4">
          <Button type="button" variant="outline" @click="$router.back()">
            <ion-icon name="close-outline"></ion-icon>
            Cancelar
          </Button>
          <Button type="submit" :loading="loading" loading-text="Criando...">
            <ion-icon name="checkmark-outline"></ion-icon>
            Criar Ficha
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../components/UI/Card.vue'
import Input from '../components/UI/Input.vue'
import Textarea from '../components/UI/Textarea.vue'
import Button from '../components/UI/Button.vue'
import api from '../services/api'
import { notifyApiError, notifyError, notifyInfo } from '../services/toast'

const router = useRouter()

const selectClass = 'w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'

const niveisEnsino = [
  { value: 'tecnico', label: 'Técnico' },
  { value: 'graduacao', label: 'Graduação' },
  { value: 'especializacao', label: 'Especialização' },
  { value: 'mestrado', label: 'Mestrado' },
  { value: 'doutorado', label: 'Doutorado' }
]

const tiposTrabalho = [
  { value: 'tcc', label: 'TCC' },
  { value: 'monografia', label: 'Monografia' },
  { value: 'dissertacao', label: 'Dissertação' },
  { value: 'tese', label: 'Tese' },
  { value: 'artigo', label: 'Artigo' },
  { value: 'anais', label: 'Anais' },
  { value: 'livro_fisico', label: 'Livro físico' },
  { value: 'ebook', label: 'E-book' },
  { value: 'produto_educacional', label: 'Produto educacional' }
]

const meses = [
  { value: '01', label: '01 - Janeiro' },
  { value: '02', label: '02 - Fevereiro' },
  { value: '03', label: '03 - Março' },
  { value: '04', label: '04 - Abril' },
  { value: '05', label: '05 - Maio' },
  { value: '06', label: '06 - Junho' },
  { value: '07', label: '07 - Julho' },
  { value: '08', label: '08 - Agosto' },
  { value: '09', label: '09 - Setembro' },
  { value: '10', label: '10 - Outubro' },
  { value: '11', label: '11 - Novembro' },
  { value: '12', label: '12 - Dezembro' }
]

const dias = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'))
const anoAtual = new Date().getFullYear()
const anos = Array.from({ length: anoAtual - 1948 }, (_, index) => String(anoAtual + 1 - index))

const form = ref({
  autor_nome_completo: '',
  orientador_nome_completo: '',
  coorientador_nome_completo: '',
  titulo: '',
  subtitulo: '',
  data_dia: '',
  data_mes: '',
  data_ano: '',
  cidade: '',
  campus: '',
  programa: '',
  nivel_ensino: '',
  curso: '',
  palavras_chave: '',
  tipo_trabalho: '',
  biblioteca_id: ''
})

const pdfFile = ref(null)
const loading = ref(false)
const bibliotecas = ref([])
const loadingBibliotecas = ref(false)

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      notifyError('Apenas arquivos PDF são permitidos')
      e.target.value = ''
      return
    }
    pdfFile.value = file
  }
}

const preencherDadosAleatorios = () => {
  const nomes = ['Maria', 'João', 'Ana', 'Pedro', 'Carla', 'Lucas', 'Juliana', 'Rafael']
  const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Almeida', 'Pereira']
  const nomesCompletos = [
    'Maria Silva Santos',
    'João Pedro Oliveira',
    'Ana Carolina Souza',
    'Pedro Henrique Costa',
    'Carla Beatriz Ferreira',
    'Lucas Gabriel Almeida',
    'Juliana Maria Pereira',
    'Rafael Augusto Lima'
  ]
  
  const orientadores = [
    'Prof. Dr. Carlos Eduardo Mendes',
    'Prof. Dra. Fernanda Rodrigues',
    'Prof. Dr. Roberto Alves',
    'Prof. Dra. Patricia Santos'
  ]
  
  const coorientadores = [
    'Prof. Me. André Luiz',
    'Prof. Dra. Luciana Martins',
    null
  ]
  
  const titulos = [
    'Análise de Sistemas de Informação',
    'Desenvolvimento de Aplicações Web',
    'Inteligência Artificial e Machine Learning',
    'Banco de Dados e Big Data',
    'Segurança da Informação',
    'Engenharia de Software',
    'Redes de Computadores',
    'Sistemas Embarcados'
  ]
  
  const subtitulos = [
    'Uma Abordagem Prática',
    'Estudo de Caso',
    'Aplicações em Ambiente Real',
    'Análise Comparativa',
    null
  ]
  
  const cidades = ['Natal', 'Mossoró', 'Caicó', 'Currais Novos', 'Pau dos Ferros']
  const campus = ['Natal - Central', 'Mossoró', 'Caicó', 'Currais Novos', 'Pau dos Ferros']
  const programas = ['Técnico em Informática', 'Técnico em Redes', 'Superior em Tecnologia']
  const cursos = [
    'Técnico em Informática',
    'Técnico em Redes de Computadores',
    'Tecnologia em Análise e Desenvolvimento de Sistemas',
    'Tecnologia em Redes de Computadores'
  ]
  
  const palavrasChave = [
    'Sistemas de Informação, Desenvolvimento Web, Tecnologia',
    'Inteligência Artificial, Machine Learning, Python',
    'Banco de Dados, MySQL, PostgreSQL',
    'Segurança, Criptografia, Redes',
    'Software, Engenharia, Metodologias Ágeis'
  ]
  
  const nomeCompleto = nomesCompletos[Math.floor(Math.random() * nomesCompletos.length)]
  
  const orientador = orientadores[Math.floor(Math.random() * orientadores.length)]
  
  const coorientador = coorientadores[Math.floor(Math.random() * coorientadores.length)]
  let coorientadorNomeCompleto = null
  
  if (coorientador) {
    coorientadorNomeCompleto = coorientador
  }
  
  const hoje = new Date()
  const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
  const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  const ano = String(hoje.getFullYear() - Math.floor(Math.random() * 5))
  
  form.value = {
    autor_nome_completo: nomeCompleto,
    orientador_nome_completo: orientador,
    coorientador_nome_completo: coorientadorNomeCompleto,
    titulo: titulos[Math.floor(Math.random() * titulos.length)],
    subtitulo: subtitulos[Math.floor(Math.random() * subtitulos.length)],
    data_dia: dia,
    data_mes: mes,
    data_ano: ano,
    cidade: cidades[Math.floor(Math.random() * cidades.length)],
    campus: campus[Math.floor(Math.random() * campus.length)],
    programa: programas[Math.floor(Math.random() * programas.length)],
    nivel_ensino: niveisEnsino[Math.floor(Math.random() * niveisEnsino.length)].value,
    curso: cursos[Math.floor(Math.random() * cursos.length)],
    palavras_chave: palavrasChave[Math.floor(Math.random() * palavrasChave.length)],
    tipo_trabalho: tiposTrabalho[Math.floor(Math.random() * tiposTrabalho.length)].value,
    biblioteca_id: bibliotecas.value.length > 0 ? bibliotecas.value[Math.floor(Math.random() * bibliotecas.value.length)].id : ''
  }
}

const carregarBibliotecas = async () => {
  loadingBibliotecas.value = true
  try {
    const response = await api.get('/api/public/bibliotecas')
    bibliotecas.value = response.data
  } catch (error) {
    notifyError('Erro ao carregar bibliotecas. Tente novamente.')
  } finally {
    loadingBibliotecas.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.biblioteca_id) {
    notifyInfo('Por favor, selecione uma biblioteca')
    return
  }
  
  loading.value = true
  
  try {
    const formData = new FormData()
    
    formData.append('ficha_json', JSON.stringify(form.value))
    
    if (pdfFile.value) {
      formData.append('pdf_tcc', pdfFile.value)
    }
    
    await api.post('/api/fichas/', formData)
    
    router.push('/fichas')
  } catch (error) {
    notifyApiError(error, 'Erro ao criar ficha. Verifique os dados e tente novamente.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregarBibliotecas()
})
</script>

