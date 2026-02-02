import ApiPrefix from '@/utils/ApiPrefix';

class CountdownService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 创建倒计时
   * @param {Object} data - 倒计时数据
   * @param {number} data.cid - 班级ID
   * @param {string} data.content - 倒计时内容
   * @param {number} data.deadline - 截止日期 (8位 YYYYMMDD)
   */
  async createCountdown(data) {
    try {
      if (!data.cid || !data.content || !data.deadline) {
        throw new Error('Class ID, content, and deadline are required');
      }

      const response = await this.post('/countdown/create', data);
      console.log('Create countdown success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Create countdown failed:', error);
      throw error;
    }
  }

  /**
   * 获取单个倒计时
   * @param {number} cdid - 倒计时ID
   */
  async getCountdown(cdid) {
    try {
      if (!cdid) {
        throw new Error('Countdown ID is required');
      }

      const response = await this.get(`/countdown/get?cdid=${cdid}`);
      console.log('Get countdown success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get countdown failed:', error);
      throw error;
    }
  }

  /**
   * 获取倒计时列表
   * @param {Object} params - 参数对象
   * @param {number} params.cid - 班级ID (可选)
   * @param {number} params.deadline - 截止日期 (可选)
   * @param {string} params.order - 排序方式 (asc/desc)
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   */
  async getCountdownList(params = {}) {
    try {
      const { cid, deadline, order = 'asc', page = 1, size = 20 } = params;

      let url = `/countdown/list?order=${order}`;
      if (cid) {
        url += `&cid=${cid}`;
      }
      if (deadline) {
        url += `&deadline=${deadline}`;
      }

      const bodyData = { page, size };
      const response = await this.get(url, bodyData);
      console.log('Get countdown list success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get countdown list failed:', error);
      throw error;
    }
  }

  /**
   * 更新倒计时
   * @param {number} cdid - 倒计时ID
   * @param {Object} data - 更新数据
   * @param {string} data.content - 倒计时内容
   * @param {string} data.deadline - 截止日期
   */
  async updateCountdown(cdid, data) {
    try {
      if (!cdid) {
        throw new Error('Countdown ID is required');
      }

      const response = await this.put(`/countdown/update?cdid=${cdid}`, data);
      console.log('Update countdown success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Update countdown failed:', error);
      throw error;
    }
  }

  /**
   * 删除倒计时
   * @param {number} cdid - 倒计时ID
   */
  async deleteCountdown(cdid) {
    try {
      if (!cdid) {
        throw new Error('Countdown ID is required');
      }

      const response = await this.delete(`/countdown/delete?cdid=${cdid}`);
      console.log('Delete countdown success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Delete countdown failed:', error);
      throw error;
    }
  }
}

export default new CountdownService();
