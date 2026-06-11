<template>
  <div>
    <Table
      :columns="columns"
      :items="fichas"
      :loading="loading"
      loading-text="A carregar fichas…"
      empty-text="Nenhuma ficha encontrada"
      empty-icon="document-text-outline"
    >
      <template #cell-biblioteca="{ item }">
        <span class="text-sm text-muted-800">{{ item.biblioteca_nome || '—' }}</span>
      </template>

      <template #cell-status="{ item }">
        <span
          :class="[
            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
            item.status === 'aprovado'
              ? 'bg-green-100 text-green-800'
              : item.status === 'negado'
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-900'
          ]"
        >
          <ion-icon
            :name="
              item.status === 'aprovado'
                ? 'checkmark-circle'
                : item.status === 'negado'
                  ? 'close-circle'
                  : 'time-outline'
            "
            class="text-sm"
          ></ion-icon>
          {{
            item.status === 'aprovado'
              ? 'Aprovado'
              : item.status === 'negado'
                ? 'Negado'
                : 'Aguardando'
          }}
        </span>
      </template>

      <template #cell-acoes="{ item }">
        <Button size="sm" variant="outline" class="gap-1.5 font-semibold" @click="abrirDrawer(item)">
          Ver mais
          <ion-icon name="chevron-forward-outline" class="text-base"></ion-icon>
        </Button>
      </template>
    </Table>

    <Drawer
      :show="!!fichaDrawer"
      :title="fichaDrawer?.titulo || 'Ficha'"
      :subtitle="fichaDrawer ? `ID ${fichaDrawer.id_curto} · ${fichaDrawer.biblioteca_nome || '—'}` : ''"
      wide
      @close="fichaDrawer = null"
    >
      <div v-if="fichaDrawer" class="space-y-6">
        <div class="flex flex-wrap gap-2">
          <span
            :class="[
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
              fichaDrawer.status === 'aprovado'
                ? 'bg-green-100 text-green-800'
                : fichaDrawer.status === 'negado'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-900'
            ]"
          >
            {{ labelStatus(fichaDrawer.status) }}
          </span>
        </div>

        <dl class="grid gap-3 text-sm sm:grid-cols-2">
          <div class="sm:col-span-2">
            <dt class="font-semibold text-muted-500">Autor</dt>
            <dd class="mt-0.5 text-muted-900">{{ fichaDrawer.autor_nome_completo }}</dd>
          </div>
          <div>
            <dt class="font-semibold text-muted-500">Curso</dt>
            <dd class="mt-0.5 text-muted-900">{{ fichaDrawer.curso }}</dd>
          </div>
          <div>
            <dt class="font-semibold text-muted-500">Campus (ficha)</dt>
            <dd class="mt-0.5 text-muted-900">{{ fichaDrawer.campus }}</dd>
          </div>
          <div>
            <dt class="font-semibold text-muted-500">Tipo de trabalho</dt>
            <dd class="mt-0.5 text-muted-900">{{ fichaDrawer.tipo_trabalho }}</dd>
          </div>
          <div>
            <dt class="font-semibold text-muted-500">Data</dt>
            <dd class="mt-0.5 text-muted-900">
              {{ fichaDrawer.data_dia }}/{{ fichaDrawer.data_mes }}/{{ fichaDrawer.data_ano }}
            </dd>
          </div>
          <div v-if="fichaDrawer.revisor_nome">
            <dt class="font-semibold text-muted-500">Revisada por</dt>
            <dd class="mt-0.5 text-muted-900">{{ fichaDrawer.revisor_nome }}</dd>
          </div>
          <div v-if="fichaDrawer.data_revisao">
            <dt class="font-semibold text-muted-500">Data da revisão</dt>
            <dd class="mt-0.5 text-muted-900">
              {{ new Date(fichaDrawer.data_revisao).toLocaleString('pt-BR') }}
            </dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="font-semibold text-muted-500">Palavras-chave</dt>
            <dd class="mt-0.5 text-muted-900">{{ fichaDrawer.palavras_chave }}</dd>
          </div>
        </dl>

        <div v-if="logsDrawer.length" class="rounded-xl border border-gray-200 p-4">
          <p class="mb-3 text-sm font-semibold text-muted-900">Histórico</p>
          <div class="space-y-3">
            <div v-for="log in logsDrawer" :key="log.id" class="text-sm">
              <p class="font-medium text-muted-900">
                {{ labelAcao(log.acao) }} por {{ log.usuario_nome || 'Usuário' }}
              </p>
              <p class="text-xs text-muted-500">
                {{ new Date(log.data_criacao).toLocaleString('pt-BR') }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="fichaDrawer.status === 'aguardando_autorizacao'"
          class="rounded-xl border border-amber-200 bg-amber-50/80 p-4"
        >
          <p class="mb-3 text-sm font-medium text-amber-950">Decisão de autorização</p>
          <div class="flex flex-wrap gap-2">
            <Button type="button" :loading="decidindo === 'sim'" @click="decidirFicha(true)">
              Aprovar
            </Button>
            <Button
              type="button"
              variant="outline"
              class="border-red-300 text-red-800 hover:bg-red-50"
              :loading="decidindo === 'nao'"
              @click="decidirFicha(false)"
            >
              Negar
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Table from '../components/UI/Table.vue'
import Button from '../components/UI/Button.vue'
import Drawer from '../components/UI/Drawer.vue'
import api from '../services/api'
import { notifyApiError, notifyError, notifySuccess } from '../services/toast'

const fichas = ref([])
const loading = ref(false)
const fichaDrawer = ref(null)
const decidindo = ref(null)
const logsDrawer = ref([])

const columns = [
  { key: 'titulo', label: 'Título' },
  { key: 'id_curto', label: 'ID' },
  { key: 'autor_nome_completo', label: 'Autor' },
  { key: 'biblioteca', label: 'Biblioteca' },
  { key: 'status', label: 'Estado' },
  { key: 'acoes', label: 'Ações' }
]

const labelStatus = (s) => {
  if (s === 'aprovado') return 'Aprovado'
  if (s === 'negado') return 'Negado'
  return 'Aguardando autorização'
}

const labelAcao = (acao) => {
  if (acao === 'aprovacao') return 'Aprovação'
  if (acao === 'negacao') return 'Negação'
  return 'Atualização'
}

const carregarFichas = async () => {
  loading.value = true
  try {
    const [fichasResp, bibliotecasResp] = await Promise.all([
      api.get('/api/admin/fichas'),
      api.get('/api/public/bibliotecas')
    ])

    const bibliotecasMap = new Map(
      (bibliotecasResp.data || []).map((biblioteca) => [
        biblioteca.id,
        `${biblioteca.nome} — ${biblioteca.campus}`
      ])
    )

    fichas.value = (fichasResp.data || []).map((ficha) => ({
      ...ficha,
      biblioteca_nome: bibliotecasMap.get(ficha.biblioteca_id) || '—'
    }))
  } catch {
    notifyError('Não foi possível carregar as fichas.')
  } finally {
    loading.value = false
  }
}

const abrirDrawer = async (item) => {
  fichaDrawer.value = { ...item }
  logsDrawer.value = []
  try {
    const response = await api.get(`/api/admin/fichas/${item.id}/logs`)
    logsDrawer.value = response.data || []
  } catch {
    logsDrawer.value = []
  }
}

const decidirFicha = async (aprovado) => {
  if (!fichaDrawer.value) return
  decidindo.value = aprovado ? 'sim' : 'nao'
  try {
    await api.post(`/api/admin/fichas/${fichaDrawer.value.id}/aprovacao`, { aprovado })
    notifySuccess(aprovado ? 'Ficha aprovada.' : 'Ficha negada.')
    await carregarFichas()
    const atual = fichas.value.find((f) => f.id === fichaDrawer.value.id)
    fichaDrawer.value = atual ? { ...atual } : null
    if (fichaDrawer.value) {
      const logsResponse = await api.get(`/api/admin/fichas/${fichaDrawer.value.id}/logs`)
      logsDrawer.value = logsResponse.data || []
    }
  } catch (error) {
    notifyApiError(error, 'Erro ao atualizar a ficha.')
  } finally {
    decidindo.value = null
  }
}

onMounted(() => {
  carregarFichas()
})
</script>
