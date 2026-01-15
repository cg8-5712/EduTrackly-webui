import ApiPrefix from '@/utils/ApiPrefix';

class SloganService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 创建标语
   * @param {Object} data - 标语数据
   * @param {number} data.cid - 班级ID
   * @param {string} data.content - 标语内容
   */
  async createSlogan(data) {
    try {
      if (!data.cid || !data.content) {
        throw new Error('Class ID and content are required');
      }

      const response = await this.adminPost('/slogan/create', data);
      console.log('Create slogan success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Create slogan failed:', error);
      throw error;
    }
  }

  /**
   * 获取单个标语
   * @param {number} slid - 标语ID
   */
  async getSlogan(slid) {
    try {
      if (!slid) {
        throw new Error('Slogan ID is required');
      }

      const response = await this.get(`/slogan/get?slid=${slid}`);
      console.log('Get slogan success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get slogan failed:', error);
      throw error;
    }
  }

  /**
   * 获取标语列表
   * @param {Object} params - 参数对象
   * @param {number} params.cid - 班级ID (可选)
   * @param {string} params.order - 排序方式 (asc/desc)
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   */
  async getSloganList(params = {}) {
    try {
      const { cid, order = 'asc', page = 1, size = 20 } = params;

      let url = `/slogan/list?order=${order}`;
      if (cid) {
        url += `&cid=${cid}`;
      }

      const bodyData = { page, size };
      const response = await this.get(url, bodyData);
      console.log('Get slogan list success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get slogan list failed:', error);
      throw error;
    }
  }

  /**
   * 修改标语
   * @param {number} slid - 标语ID
   * @param {Object} data - 更新数据
   * @param {string} data.content - 新的标语内容
   */
  async updateSlogan(slid, data) {
    try {
      if (!slid) {
        throw new Error('Slogan ID is required');
      }
      if (!data.content) {
        throw new Error('Content is required');
      }

      const response = await this.adminPut(`/slogan/update?slid=${slid}`, data);
      console.log('Update slogan success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Update slogan failed:', error);
      throw error;
    }
  }

  /**
   * 删除标语
   * @param {number} slid - 标语ID
   */
  async deleteSlogan(slid) {
    try {
      if (!slid) {
        throw new Error('Slogan ID is required');
      }

      const response = await this.adminDelete(`/slogan/delete?slid=${slid}`);
      console.log('Delete slogan success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Delete slogan failed:', error);
      throw error;
    }
  }
}

export default new SloganService();
