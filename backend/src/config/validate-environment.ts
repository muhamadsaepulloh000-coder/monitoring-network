type Environment = Record<string, unknown>

const DEFAULT_FRONTEND_ORIGIN = 'http://localhost:5173'
const DEFAULT_ROUTER_HOST = '192.168.18.1'

function isValidHttpOrigin(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateEnvironment(environment: Environment): Environment {
  const portValue = environment.PORT ?? '3000'
  const port = Number(portValue)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.')
  }

  const originsValue = String(environment.FRONTEND_ORIGIN ?? DEFAULT_FRONTEND_ORIGIN)
  const origins = originsValue.split(',').map((origin) => origin.trim())
  if (origins.length === 0 || origins.some((origin) => !isValidHttpOrigin(origin))) {
    throw new Error('FRONTEND_ORIGIN must contain one or more valid HTTP(S) origins.')
  }

  const routerHost = String(environment.ROUTER_HOST ?? DEFAULT_ROUTER_HOST).trim()
  if (!routerHost) {
    throw new Error('ROUTER_HOST must not be empty.')
  }

  const databaseUrl = String(environment.DATABASE_URL ?? '').trim()
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl)
      if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') {
        throw new Error()
      }
    } catch {
      throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL when provided.')
    }
  }

  return {
    ...environment,
    PORT: port,
    FRONTEND_ORIGIN: origins.join(','),
    ROUTER_HOST: routerHost,
    DATABASE_URL: databaseUrl,
  }
}
