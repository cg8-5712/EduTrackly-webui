/**
 * API配置管理
 * 根据当前访问的域名自动选择对应的后端API地址
 * 配置通过环境变量(.env)中的多个VITE_API_URL_*变量定义
 */

/**
 * 从环境变量中解析域名映射
 * 环境变量格式: VITE_API_URL_域名 = API地址
 * 例如: VITE_API_URL_ABC_COM = https://abc.com/api/v1
 *
 * 注意: 域名中的点(.)和连字符(-)会被转换为下划线(_)
 * 例如: abc.com -> ABC_COM, test-domain.com -> TEST_DOMAIN_COM
 */
function parseApiMappingsFromEnv() {
  const mappings = {}

  // 获取所有环境变量
  const env = import.meta.env

  // 遍历环境变量，查找所有以 VITE_API_URL_ 开头的变量
  Object.keys(env).forEach(key => {
    if (key.startsWith('VITE_API_URL_') && key !== 'VITE_API_URL') {
      // 提取域名部分: VITE_API_URL_ABC_COM -> ABC_COM
      const domainKey = key.replace('VITE_API_URL_', '')

      // 将域名键转换回实际域名: ABC_COM -> abc.com
      const domain = domainKey.toLowerCase().replace(/_/g, '.')

      // 存储映射
      mappings[domain] = env[key]

      console.log(`[API Config] Loaded mapping from env: ${domain} -> ${env[key]}`)
    }
  })

  return mappings
}

/**
 * API域名映射配置
 * 从环境变量自动加载
 */
const API_DOMAIN_MAPPING = parseApiMappingsFromEnv()

/**
 * 默认API地址
 * 当前域名未在映射表中时使用
 */
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

/**
 * 获取当前主机名(不含端口)
 * @returns {string} 主机名
 */
function getCurrentHostname() {
  if (typeof window === 'undefined') {
    return 'localhost'
  }

  // 获取完整的hostname(含端口)
  const fullHostname = window.location.hostname

  // 返回不含端口的hostname
  return fullHostname
}

/**
 * 根据当前域名获取对应的API URL
 * @returns {string} API基础URL
 */
export function getApiUrl() {
  const hostname = getCurrentHostname()

  // 从映射表中查找对应的API地址
  const apiUrl = API_DOMAIN_MAPPING[hostname]

  if (apiUrl) {
    console.log(`[API Config] Using mapped API URL for ${hostname}: ${apiUrl}`)
    return apiUrl
  }

  // 如果没有找到映射,使用默认地址
  console.log(`[API Config] Using default API URL for ${hostname}: ${DEFAULT_API_URL}`)
  return DEFAULT_API_URL
}

/**
 * 获取所有域名映射
 * @returns {Object} 域名映射表
 */
export function getAllMappings() {
  return { ...API_DOMAIN_MAPPING }
}

/**
 * 获取当前主机名
 * @returns {string} 当前主机名
 */
export function getCurrentDomain() {
  return getCurrentHostname()
}

// 导出配置
export default {
  getApiUrl,
  getAllMappings,
  getCurrentDomain,
  getCurrentHostname
}
