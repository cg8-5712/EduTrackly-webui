import ApiPrefix from '@/utils/ApiPrefix';

class AdminClassAssignmentService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 分配班级给管理员 (仅超级管理员)
   * @param {number} aid - 管理员ID
   * @param {number} cid - 班级ID
   */
  async assignClass(aid, cid) {
    try {
      if (!aid || !cid) {
        throw new Error('Admin ID and Class ID are required');
      }

      const response = await this.adminPost(`/admin/class/assign?aid=${aid}&cid=${cid}`);
      console.log('Assign class success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Assign class failed:', error);
      throw error;
    }
  }

  /**
   * 移除管理员的班级分配 (仅超级管理员)
   * @param {number} aid - 管理员ID
   * @param {number} cid - 班级ID
   */
  async removeClass(aid, cid) {
    try {
      if (!aid || !cid) {
        throw new Error('Admin ID and Class ID are required');
      }

      const response = await this.adminDelete(`/admin/class/remove?aid=${aid}&cid=${cid}`);
      console.log('Remove class assignment success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Remove class assignment failed:', error);
      throw error;
    }
  }

  /**
   * 获取管理员的班级列表 (仅超级管理员)
   * @param {number} aid - 管理员ID
   */
  async getAdminClasses(aid) {
    try {
      if (!aid) {
        throw new Error('Admin ID is required');
      }

      const response = await this.adminGet(`/admin/class/list?aid=${aid}`);
      console.log('Get admin classes success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get admin classes failed:', error);
      throw error;
    }
  }

  /**
   * 替换管理员的所有班级分配 (仅超级管理员)
   * @param {number} aid - 管理员ID
   * @param {Array<number>} cids - 班级ID列表
   */
  async replaceClasses(aid, cids) {
    try {
      if (!aid) {
        throw new Error('Admin ID is required');
      }
      if (!Array.isArray(cids)) {
        throw new Error('Class IDs must be an array');
      }

      const response = await this.adminPut(`/admin/class/replace?aid=${aid}`, { cids });
      console.log('Replace classes success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Replace classes failed:', error);
      throw error;
    }
  }
}

export default new AdminClassAssignmentService();
