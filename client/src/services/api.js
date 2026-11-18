import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60_000,
  headers: { 'Content-Type': 'application/json' },
})

function unwrap(response) {
  const body = response.data
  if (body?.success === false) throw new Error(body.message || 'The request failed.')
  return body?.data ?? body
}

export function getItems() {
  return api.get('/items', { params: { page: 1, limit: 100 } }).then(unwrap)
}

export function saveNote(content) {
  return api.post('/ingest', { type: 'note', content }).then(unwrap)
}

export function saveUrl(url) {
  return api.post('/ingest', { type: 'url', url }).then(unwrap)
}

export function askQuestion(question) {
  return api.post('/query', { question }).then(unwrap)
}

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Something went wrong. Try again.'
}
