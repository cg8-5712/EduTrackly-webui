import axios from 'axios'
import { getApiUrl } from '@/config/apiConfig'

const API_BASE_URL = getApiUrl()

const settingService = {
  // 获取设置
  async getSetting(cid) {
    try {
      const response = await axios.get(`${API_BASE_URL}/setting/get`, {
        params: { cid }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // 更新设置
  async updateSetting(cid, data) {
    try {
      const response = await axios.put(`${API_BASE_URL}/setting/update`, data, {
        params: { cid }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default settingService

