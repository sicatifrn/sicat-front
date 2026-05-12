<template>
  <div>
    <Table
      :columns="columns"
      :items="usuarios"
      :loading="loading"
      loading-text="A carregar utilizadores…"
      empty-text="Nenhum utilizador encontrado"
      empty-icon="people-outline"
    >
      <template #cell-tipo="{ item }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
            item.tipo === 'admin'
              ? 'bg-brand-100 text-brand-800'
              : item.tipo === 'bibliotecario'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
          ]"
        >
          {{
            item.tipo === 'admin'
              ? 'Admin'
              : item.tipo === 'bibliotecario'
                ? 'Bibliotecário'
                : 'Utilizador'
          }}
        </span>
      </template>

      <template #cell-biblioteca="{ item }">
        <span
          v-if="item.tipo === 'bibliotecario' && item.biblioteca"
          class="inline-flex items-center text-sm font-medium text-blue-700"
        >
          <ion-icon name="library-outline" class="mr-1 shrink-0"></ion-icon>
          {{ item.biblioteca.nome }} — {{ item.biblioteca.campus }}
        </span>
        <span v-else class="text-sm text-muted-400">—</span>
      </template>

      <template #cell-acoes="{ item }">
        <Button size="sm" variant="outline" class="gap-1.5 font-semibold" @click="abrirDrawer(item)">
          Ver mais
          <ion-icon name="chevron-forward-outline" class="text-base"></ion-icon>
        </Button>
      </template>
    </Table>

    <Drawer
      :show="!!utilizadorDrawer"
      :title="utilizadorDrawer?.nome_completo || 'Utilizador'"
      :subtitle="utilizadorDrawer ? `Matrícula ${utilizadorDrawer.matricula}` : ''"
      @close="fecharDrawer"
    >
      <div v-if="utilizadorDrawer" class="space-y-6">
        <dl class="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="font-semibold text-muted-500">CPF</dt>
            <dd class="mt-0.5 text-muted-900">{{ utilizadorDrawer.cpf }}</dd>
          </div>
          <div>
            <dt class="font-semibold text-muted-500">Matrícula</dt>
            <dd class="mt-0.5 text-muted-900">{{ utilizadorDrawer.matricula }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="font-semibold text-muted-500">Biblioteca (se bibliotecário)</dt>
            <dd class="mt-0.5 text-muted-900">
              <template v-if="utilizadorDrawer.tipo === 'bibliotecario' && utilizadorDrawer.biblioteca">
                {{ utilizadorDrawer.biblioteca.nome }} — {{ utilizadorDrawer.biblioteca.campus }}
              </template>
              <span v-else class="text-muted-400">—</span>
            </dd>
          </div>
        </dl>

        <div class="rounded-xl border border-muted-200 bg-cream-50/80 p-4">
          <label for="tipo-utilizador" class="mb-2 block text-sm font-semibold text-muted-800">
            Função no sistema
          </label>
          <select
            id="tipo-utilizador"
            v-model="tipoEdit"
            :disabled="utilizadorDrawer.id === currentUserId || salvandoTipo"
            class="w-full rounded-lg border border-muted-300 bg-white px-3 py-2.5 text-sm font-medium text-muted-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="default">Utilizador</option>
            <option value="bibliotecario">Bibliotecário</option>
            <option value="admin">Administrador</option>
          </select>
          <p v-if="utilizadorDrawer.id === currentUserId" class="mt-2 text-xs text-amber-800">
            Não é possível alterar a sua própria função aqui.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" @click="fecharDrawer">Fechar</Button>
          <Button
            type="button"
            :disabled="!utilizadorDrawer || utilizadorDrawer.id === currentUserId || tipoEdit === utilizadorDrawer.tipo"
            :loading="salvandoTipo"
            @click="guardarTipo"
          >
            Guardar função
          </Button>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Table from '../components/UI/Table.vue'
import Button from '../components/UI/Button.vue'
import Drawer from '../components/UI/Drawer.vue'
import api from '../services/api'
import { notifyError, notifyInfo, notifySuccess } from '../services/toast'

const usuarios = ref([])
const loading = ref(false)
const currentUserId = ref(localStorage.getItem('user_id') || '')
const utilizadorDrawer = ref(null)
const tipoEdit = ref('default')
const salvandoTipo = ref(false)

const columns = [
  { key: 'nome_completo', label: 'Nome' },
  { key: 'matricula', label: 'Matrícula' },
  { key: 'cpf', label: 'CPF' },
  { key: 'tipo', label: 'Função' },
  { key: 'biblioteca', label: 'Biblioteca' },
  { key: 'acoes', label: 'Ações' }
]

const carregarUsuarios = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/admin/usuarios')
    usuarios.value = response.data
  } catch {
    notifyError('Não foi possível carregar a lista de utilizadores.')
  } finally {
    loading.value = false
  }
}

const abrirDrawer = (item) => {
  utilizadorDrawer.value = item
  tipoEdit.value = item.tipo
}

const fecharDrawer = () => {
  utilizadorDrawer.value = null
}

watch(utilizadorDrawer, (u) => {
  if (u) tipoEdit.value = u.tipo
})

const guardarTipo = async () => {
  if (!utilizadorDrawer.value) return
  if (utilizadorDrawer.value.id === currentUserId.value) {
    notifyInfo('Não pode alterar a sua própria função.')
    return
  }
  if (tipoEdit.value === utilizadorDrawer.value.tipo) return

  salvandoTipo.value = true
  try {
    await api.patch(`/api/admin/usuarios/${utilizadorDrawer.value.id}/tipo`, {
      tipo: tipoEdit.value
    })
    notifySuccess('Função atualizada.')
    await carregarUsuarios()
    const atualizado = usuarios.value.find((x) => x.id === utilizadorDrawer.value.id)
    if (atualizado) utilizadorDrawer.value = atualizado
  } catch (error) {
    const msg = error.response?.data?.detail || 'Erro ao atualizar a função.'
    notifyError(msg)
    await carregarUsuarios()
  } finally {
    salvandoTipo.value = false
  }
}

onMounted(() => {
  carregarUsuarios()
})
</script>
