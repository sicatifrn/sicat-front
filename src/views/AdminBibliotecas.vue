<template>
  <div>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-muted-600">
        Selecione <strong class="text-muted-800">Ver mais</strong> para editar dados, gerir bibliotecários ou remover a biblioteca.
      </p>
      <Button class="shrink-0 gap-1.5 self-start sm:self-auto" @click="showNovaBiblioteca = true">
        <ion-icon name="add-outline"></ion-icon>
        Nova biblioteca
      </Button>
    </div>

    <Table
      :columns="columns"
      :items="bibliotecas"
      :loading="loading"
      loading-text="A carregar bibliotecas…"
      empty-text="Nenhuma biblioteca cadastrada"
      empty-icon="library-outline"
    >
      <template #empty-action>
        <Button @click="showNovaBiblioteca = true">
          <ion-icon name="add-outline"></ion-icon>
          Criar primeira biblioteca
        </Button>
      </template>

      <template #cell-data_criacao="{ value }">
        {{ value ? new Date(value).toLocaleDateString('pt-BR') : '—' }}
      </template>

      <template #cell-acoes="{ item }">
        <Button size="sm" variant="outline" class="gap-1.5 font-semibold" @click="abrirDrawer(item)">
          Ver mais
          <ion-icon name="chevron-forward-outline" class="text-base"></ion-icon>
        </Button>
      </template>
    </Table>

    <Drawer
      :show="drawerOpen"
      :title="bibliotecaAtiva?.nome || 'Biblioteca'"
      :subtitle="bibliotecaAtiva ? `${bibliotecaAtiva.campus}` : ''"
      wide
      @close="fecharDrawer"
    >
      <div v-if="bibliotecaAtiva" class="space-y-5">
        <div class="flex rounded-xl border border-muted-200 bg-muted-50/80 p-1">
          <button
            type="button"
            class="flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition"
            :class="
              drawerTab === 'dados'
                ? 'bg-white text-brand-800 shadow-sm'
                : 'text-muted-600 hover:text-muted-900'
            "
            @click="drawerTab = 'dados'"
          >
            Geral
          </button>
          <button
            type="button"
            class="flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition"
            :class="
              drawerTab === 'bibliotecarios'
                ? 'bg-white text-brand-800 shadow-sm'
                : 'text-muted-600 hover:text-muted-900'
            "
            @click="abrirTabBibliotecarios"
          >
            Bibliotecários
          </button>
        </div>

        <div v-show="drawerTab === 'dados'" class="space-y-5">
          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt class="font-semibold text-muted-500">Criada em</dt>
              <dd class="mt-0.5 text-muted-900">
                {{ new Date(bibliotecaAtiva.data_criacao).toLocaleString('pt-BR') }}
              </dd>
            </div>
            <div>
              <dt class="font-semibold text-muted-500">Última edição</dt>
              <dd class="mt-0.5 text-muted-900">
                {{ new Date(bibliotecaAtiva.data_edicao).toLocaleString('pt-BR') }}
              </dd>
            </div>
          </dl>

          <form class="space-y-4" @submit.prevent="salvarEdicao">
            <Input v-model="editForm.nome" label="Nome" placeholder="Nome da biblioteca" required />
            <Input v-model="editForm.campus" label="Campus" placeholder="Campus" required />
            <div class="flex justify-end">
              <Button type="submit" :loading="editandoBiblioteca">Guardar alterações</Button>
            </div>
          </form>
        </div>

        <div v-show="drawerTab === 'bibliotecarios'" class="space-y-4">
          <div class="flex justify-end">
            <Button size="sm" class="gap-1" @click="abrirModalAdicionarBibliotecario(bibliotecaAtiva)">
              <ion-icon name="person-add-outline"></ion-icon>
              Adicionar bibliotecário
            </Button>
          </div>

          <div v-if="loadingBibliotecarios" class="flex flex-col items-center py-10 text-muted-600">
            <ion-icon name="hourglass-outline" class="mb-2 text-3xl text-brand-600 animate-spin"></ion-icon>
            <span class="text-sm">A carregar…</span>
          </div>
          <div v-else-if="bibliotecariosDaBiblioteca.length === 0" class="rounded-xl border border-dashed border-muted-300 bg-muted-50/50 py-10 text-center text-sm text-muted-600">
            Nenhum bibliotecário associado.
          </div>
          <ul v-else class="space-y-2">
            <li
              v-for="b in bibliotecariosDaBiblioteca"
              :key="b.id"
              class="flex items-center justify-between gap-3 rounded-xl border border-muted-200 bg-white px-4 py-3"
            >
              <div class="min-w-0">
                <p class="truncate font-medium text-muted-900">{{ b.nome_completo }}</p>
                <p class="text-xs text-muted-500">{{ b.matricula }}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                class="shrink-0 text-red-700 hover:border-red-300 hover:bg-red-50"
                @click="removerBibliotecario(b.id)"
              >
                <ion-icon name="trash-outline"></ion-icon>
              </Button>
            </li>
          </ul>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <Button type="button" variant="outline" class="text-red-700 hover:border-red-300" @click="confirmarDeletar">
            Excluir biblioteca
          </Button>
          <Button type="button" variant="outline" @click="fecharDrawer">Fechar</Button>
        </div>
      </template>
    </Drawer>

    <Modal :show="showNovaBiblioteca" title="Nova biblioteca" @close="showNovaBiblioteca = false">
      <form class="space-y-4" @submit.prevent="criarBiblioteca">
        <Input v-model="novaBiblioteca.nome" label="Nome" placeholder="Nome da biblioteca" required />
        <Input v-model="novaBiblioteca.campus" label="Campus" placeholder="Nome do campus" required />
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="showNovaBiblioteca = false">Cancelar</Button>
          <Button type="submit" :loading="criandoBiblioteca">Criar</Button>
        </div>
      </form>
    </Modal>

    <Modal :show="showAdicionarBibliotecario" @close="showAdicionarBibliotecario = false">
      <template #header>
        <div>
          <h2 class="text-xl font-semibold text-muted-900">Adicionar bibliotecário</h2>
          <p class="mt-1 text-sm text-muted-600">{{ bibliotecaSelecionada?.nome }}</p>
        </div>
      </template>

      <div v-if="loadingUsuariosParaAdicionar" class="flex flex-col items-center py-10 text-muted-600">
        <ion-icon name="hourglass-outline" class="mb-2 text-3xl text-brand-600 animate-spin"></ion-icon>
        <span class="text-sm">A carregar utilizadores…</span>
      </div>
      <div v-else-if="usuariosDisponiveis.length === 0" class="py-8 text-center text-sm text-muted-600">
        Nenhum utilizador disponível.
      </div>
      <div v-else class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-semibold text-muted-700">Utilizador</label>
          <select
            v-model="usuarioSelecionado"
            class="w-full rounded-lg border border-muted-300 bg-white px-4 py-2.5 text-sm text-muted-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
          >
            <option value="">Selecione…</option>
            <option v-for="u in usuariosDisponiveis" :key="u.id" :value="u.id">
              {{ u.nome_completo }} ({{ u.matricula }}) — {{ labelTipo(u.tipo) }}
            </option>
          </select>
        </div>
        <p class="rounded-lg border border-brand-200 bg-brand-50/90 p-3 text-xs text-brand-900">
          O tipo do utilizador passará automaticamente a <strong>bibliotecário</strong>.
        </p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="showAdicionarBibliotecario = false">Cancelar</Button>
          <Button :disabled="!usuarioSelecionado" :loading="adicionandoBibliotecario" @click="adicionarBibliotecario">
            Adicionar
          </Button>
        </div>
      </div>
    </Modal>

    <Modal :show="showConfirmarDeletar" title="Confirmar exclusão" @close="showConfirmarDeletar = false">
      <div v-if="bibliotecaParaDeletar" class="space-y-4">
        <p class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
          Remover <strong>{{ bibliotecaParaDeletar.nome }}</strong>? Esta ação não pode ser anulada. Só é permitido se
          não existirem fichas associadas.
        </p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="showConfirmarDeletar = false">Cancelar</Button>
          <Button
            class="bg-red-600 text-white hover:bg-red-700"
            :loading="deletandoBiblioteca"
            @click="deletarBiblioteca"
          >
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Table from '../components/UI/Table.vue'
import Button from '../components/UI/Button.vue'
import Input from '../components/UI/Input.vue'
import Modal from '../components/UI/Modal.vue'
import Drawer from '../components/UI/Drawer.vue'
import api from '../services/api'
import { notifyError, notifySuccess } from '../services/toast'

const bibliotecas = ref([])
const loading = ref(false)
const drawerOpen = ref(false)
const drawerTab = ref('dados')
const bibliotecaAtiva = ref(null)
const editForm = ref({ nome: '', campus: '' })

const showNovaBiblioteca = ref(false)
const criandoBiblioteca = ref(false)
const novaBiblioteca = ref({ nome: '', campus: '' })

const showAdicionarBibliotecario = ref(false)
const bibliotecaSelecionada = ref(null)
const usuarioSelecionado = ref('')
const usuariosDisponiveis = ref([])
const loadingUsuariosParaAdicionar = ref(false)
const adicionandoBibliotecario = ref(false)

const bibliotecariosDaBiblioteca = ref([])
const loadingBibliotecarios = ref(false)
const editandoBiblioteca = ref(false)
const deletandoBiblioteca = ref(false)
const bibliotecaParaDeletar = ref(null)
const showConfirmarDeletar = ref(false)

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'campus', label: 'Campus' },
  { key: 'data_criacao', label: 'Criação' },
  { key: 'acoes', label: 'Ações' }
]

const labelTipo = (t) => {
  if (t === 'admin') return 'Admin'
  if (t === 'bibliotecario') return 'Bibliotecário'
  return 'Utilizador'
}

const carregarBibliotecas = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/admin/bibliotecas')
    bibliotecas.value = response.data
  } catch {
    notifyError('Não foi possível carregar as bibliotecas.')
  } finally {
    loading.value = false
  }
}

const abrirDrawer = (item) => {
  bibliotecaAtiva.value = item
  editForm.value = { nome: item.nome, campus: item.campus }
  drawerTab.value = 'dados'
  drawerOpen.value = true
  bibliotecariosDaBiblioteca.value = []
}

const fecharDrawer = () => {
  drawerOpen.value = false
  bibliotecaAtiva.value = null
}

const carregarBibliotecarios = async () => {
  if (!bibliotecaAtiva.value) return
  loadingBibliotecarios.value = true
  try {
    const response = await api.get(`/api/admin/bibliotecas/${bibliotecaAtiva.value.id}/bibliotecarios`)
    bibliotecariosDaBiblioteca.value = response.data
  } catch {
    notifyError('Erro ao carregar bibliotecários.')
    bibliotecariosDaBiblioteca.value = []
  } finally {
    loadingBibliotecarios.value = false
  }
}

const abrirTabBibliotecarios = () => {
  drawerTab.value = 'bibliotecarios'
  carregarBibliotecarios()
}

const criarBiblioteca = async () => {
  criandoBiblioteca.value = true
  try {
    await api.post('/api/admin/bibliotecas', novaBiblioteca.value)
    showNovaBiblioteca.value = false
    novaBiblioteca.value = { nome: '', campus: '' }
    await carregarBibliotecas()
    notifySuccess('Biblioteca criada.')
  } catch {
    notifyError('Erro ao criar biblioteca.')
  } finally {
    criandoBiblioteca.value = false
  }
}

const salvarEdicao = async () => {
  if (!bibliotecaAtiva.value) return
  editandoBiblioteca.value = true
  try {
    await api.patch(`/api/admin/bibliotecas/${bibliotecaAtiva.value.id}`, {
      nome: editForm.value.nome,
      campus: editForm.value.campus
    })
    await carregarBibliotecas()
    const atual = bibliotecas.value.find((b) => b.id === bibliotecaAtiva.value.id)
    if (atual) {
      bibliotecaAtiva.value = atual
      editForm.value = { nome: atual.nome, campus: atual.campus }
    }
    notifySuccess('Biblioteca atualizada.')
  } catch (error) {
    notifyError(error.response?.data?.detail || 'Erro ao guardar.')
  } finally {
    editandoBiblioteca.value = false
  }
}

const abrirModalAdicionarBibliotecario = async (biblioteca) => {
  bibliotecaSelecionada.value = biblioteca
  usuarioSelecionado.value = ''
  showAdicionarBibliotecario.value = true
  loadingUsuariosParaAdicionar.value = true
  try {
    const response = await api.get('/api/admin/usuarios')
    usuariosDisponiveis.value = response.data
  } catch {
    notifyError('Erro ao carregar utilizadores.')
  } finally {
    loadingUsuariosParaAdicionar.value = false
  }
}

const adicionarBibliotecario = async () => {
  if (!usuarioSelecionado.value || !bibliotecaSelecionada.value) return
  adicionandoBibliotecario.value = true
  try {
    await api.post('/api/admin/bibliotecas/adicionar-bibliotecario', {
      usuario_id: usuarioSelecionado.value,
      biblioteca_id: bibliotecaSelecionada.value.id
    })
    showAdicionarBibliotecario.value = false
    bibliotecaSelecionada.value = null
    usuarioSelecionado.value = ''
    notifySuccess('Bibliotecário adicionado.')
    if (drawerOpen.value && bibliotecaAtiva.value) await carregarBibliotecarios()
    await carregarBibliotecas()
  } catch (error) {
    notifyError(error.response?.data?.detail || 'Erro ao adicionar.')
  } finally {
    adicionandoBibliotecario.value = false
  }
}

const removerBibliotecario = async (usuarioId) => {
  if (!bibliotecaAtiva.value) return
  if (!confirm('Remover este bibliotecário desta biblioteca?')) return
  try {
    await api.delete(`/api/admin/bibliotecas/${bibliotecaAtiva.value.id}/bibliotecarios/${usuarioId}`)
    await carregarBibliotecarios()
    notifySuccess('Removido.')
  } catch (error) {
    notifyError(error.response?.data?.detail || 'Erro ao remover.')
  }
}

const confirmarDeletar = () => {
  if (!bibliotecaAtiva.value) return
  bibliotecaParaDeletar.value = bibliotecaAtiva.value
  showConfirmarDeletar.value = true
}

const deletarBiblioteca = async () => {
  if (!bibliotecaParaDeletar.value) return
  deletandoBiblioteca.value = true
  try {
    await api.delete(`/api/admin/bibliotecas/${bibliotecaParaDeletar.value.id}`)
    showConfirmarDeletar.value = false
    bibliotecaParaDeletar.value = null
    fecharDrawer()
    await carregarBibliotecas()
    notifySuccess('Biblioteca excluída.')
  } catch (error) {
    notifyError(error.response?.data?.detail || 'Não foi possível excluir.')
  } finally {
    deletandoBiblioteca.value = false
  }
}

onMounted(() => {
  carregarBibliotecas()
})
</script>
