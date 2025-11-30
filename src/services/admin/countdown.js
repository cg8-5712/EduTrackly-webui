import axios from 'axios'
import { getApiUrl } from '@/config/apiConfig'

const API_BASE_URL = getApiUrl()

const countdownService = {
  // 创建倒计时
  async createCountdown(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/countdown/create`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // 获取单个倒计时
  async getCountdown(cdid) {
    try {
      const response = await axios.get(`${API_BASE_URL}/countdown/get`, {
        params: { cdid }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // 获取倒计时列表
  async getCountdownList(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/countdown/list`, {
        params: {
          cid: params.cid,
          deadline: params.deadline,
          order: params.order || 'asc',
          page: params.page || 1,
          size: params.size || 20
        }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // 更新倒计时
  async updateCountdown(cdid, data) {
    try {
      const response = await axios.put(`${API_BASE_URL}/countdown/update`, data, {
        params: { cdid }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // 删除倒计时
  async deleteCountdown(cdid) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/countdown/delete`, {
        params: { cdid }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default countdownService

