const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api').replace(/\/$/, '')

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    })
  } catch (error) {
    console.error('NEXUS API request failed before receiving a response.', error)
    throw new Error('Backend API is unavailable. Start the NestJS service and try again.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string | string[] } | null
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message
    console.error(`NEXUS API returned HTTP ${response.status} for ${path}.`)
    throw new Error(`HTTP ${response.status}: ${message || 'Backend API request failed.'}`)
  }

  return response.json() as Promise<T>
}