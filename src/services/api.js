import axios from 'axios'

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_role')
      localStorage.removeItem('user_nome')
      localStorage.removeItem('user_id')
      window.dispatchEvent(new Event('auth-changed'))
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  getSuapLoginUrl: () => `${API_BASE_URL}/api/auth/suap/login`,

  getMe: async () => {
    const response = await api.get('/api/auth/perfil')
    return response.data
  }
}

export default api
