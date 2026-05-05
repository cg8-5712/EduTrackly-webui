const API_ENV_PREFIX = "VITE_API_URL_"
const DEFAULT_API_URL =
  import.meta.env.VITE_API_URL || "http://192.168.101.138/es/api/v2"

function parseApiMappingsFromEnv() {
  const mappings = {}

  Object.entries(import.meta.env).forEach(([key, value]) => {
    if (
      key.startsWith(API_ENV_PREFIX) &&
      key !== "VITE_API_URL" &&
      typeof value === "string" &&
      value.trim()
    ) {
      const domain = key
        .slice(API_ENV_PREFIX.length)
        .toLowerCase()
        .replace(/_/g, ".")

      mappings[domain] = value.trim()
    }
  })

  return mappings
}

const API_DOMAIN_MAPPING = parseApiMappingsFromEnv()

export function getCurrentHostname() {
  if (typeof window === "undefined") {
    return "localhost"
  }

  return window.location.hostname || "localhost"
}

export function getCurrentDomain() {
  return getCurrentHostname()
}

export function getApiUrl() {
  const hostname = getCurrentHostname().trim().toLowerCase()

  if (API_DOMAIN_MAPPING[hostname]) {
    return API_DOMAIN_MAPPING[hostname]
  }

  const envLookupKey = `${API_ENV_PREFIX}${hostname.replace(/[.-]/g, "_").toUpperCase()}`
  const envMappedUrl = import.meta.env[envLookupKey]

  if (typeof envMappedUrl === "string" && envMappedUrl.trim()) {
    return envMappedUrl.trim()
  }

  return DEFAULT_API_URL
}

export function getAllMappings() {
  return { ...API_DOMAIN_MAPPING }
}

export default {
  getApiUrl,
  getAllMappings,
  getCurrentDomain,
  getCurrentHostname,
}
