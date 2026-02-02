import ApiPrefix from '@/utils/ApiPrefix';

class RateLimitService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 获取所有速率限制配置 (仅超级管理员)
   */
  async getRateLimitList() {
    try {
      const response = await this.adminGet('/admin/rate-limit/list');
      console.log('Get rate limit list success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get rate limit list failed:', error);
      throw error;
    }
  }

  /**
   * 获取单个速率限制配置 (仅超级管理员)
   * @param {string} key - 配置key
   */
  async getRateLimit(key) {
    try {
      if (!key) {
        throw new Error('Config key is required');
      }

      const response = await this.adminGet(`/admin/rate-limit/get?key=${encodeURIComponent(key)}`);
      console.log('Get rate limit success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get rate limit failed:', error);
      throw error;
    }
  }

  /**
   * 创建速率限制配置 (仅超级管理员)
   * @param {Object} data - 配置数据
   * @param {string} data.key - 配置key
   * @param {number} data.max_requests - 最大请求数
   * @param {number} data.window_ms - 时间窗口(毫秒)
   */
  async createRateLimit(data) {
    try {
      if (!data.key || !data.max_requests || !data.window_ms) {
        throw new Error('Key, max_requests, and window_ms are required');
      }

      const response = await this.adminPost('/admin/rate-limit/create', data);
      console.log('Create rate limit success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Create rate limit failed:', error);
      throw error;
    }
  }

  /**
   * 更新速率限制配置 (仅超级管理员)
   * @param {string} key - 配置key
   * @param {Object} data - 更新数据
   * @param {number} data.max_requests - 最大请求数
   * @param {number} data.window_ms - 时间窗口(毫秒)
   */
  async updateRateLimit(key, data) {
    try {
      if (!key) {
        throw new Error('Config key is required');
      }

      const response = await this.adminPut(`/admin/rate-limit/update?key=${encodeURIComponent(key)}`, data);
      console.log('Update rate limit success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Update rate limit failed:', error);
      throw error;
    }
  }

  /**
   * 删除速率限制配置 (仅超级管理员)
   * @param {string} key - 配置key
   */
  async deleteRateLimit(key) {
    try {
      if (!key) {
        throw new Error('Config key is required');
      }

      const response = await this.adminDelete(`/admin/rate-limit/delete?key=${encodeURIComponent(key)}`);
      console.log('Delete rate limit success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Delete rate limit failed:', error);
      throw error;
    }
  }
}

export default new RateLimitService();
