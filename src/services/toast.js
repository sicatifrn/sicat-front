import { toast } from 'vue-sonner'

export const notifySuccess = (message) => {
  toast.success(message)
}

export const notifyError = (message) => {
  toast.error(message)
}

export const notifyInfo = (message) => {
  toast.info(message)
}

export const extractApiError = (error, fallback = 'Erro ao processar solicitação. Tente novamente.') => {
  const detail = error?.response?.data?.detail
  let message = fallback

  if (typeof detail === 'string') {
    message = detail
  } else if (Array.isArray(detail) && detail[0]?.msg) {
    message = detail[0].msg
  } else if (detail?.msg) {
    message = detail.msg
  }

  message = String(message || fallback).replace(/^Value error,\s*/i, '')

  if (message.length > 180 || message.includes('[SQL:') || message.includes('pymysql.err')) {
    return fallback
  }

  return message
}

export const notifyApiError = (error, fallback) => {
  notifyError(extractApiError(error, fallback))
}

