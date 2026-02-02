import ApiPrefix from '@/utils/ApiPrefix';
import i18n from '@/i18n';

const t = (key) => i18n.global.t(key);

class AdminService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 获取当前登录管理员信息
   */
  async getMe() {
    try {
      const response = await this.adminGet('/admin/me');
      console.log('Get admin info success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get admin info failed:', error);
      throw error;
    }
  }

  /**
   * 修改密码
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   */
  async changePassword(oldPassword, newPassword) {
    try {
      if (!oldPassword || !newPassword) {
        throw new Error('Old password and new password are required');
      }

      const response = await this.adminPut('/admin/password', {
        old_password: oldPassword,
        new_password: newPassword
      });
      console.log('Change password success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Change password failed:', error);
      throw error;
    }
  }

  /**
   * 创建管理员账号 (仅超级管理员)
   * @param {Object} data - 管理员数据
   * @param {string} data.username - 用户名
   * @param {string} data.password - 密码
   * @param {string} data.role - 角色 (admin/superadmin)
   */
  async createAdmin(data) {
    try {
      if (!data.username || !data.password) {
        throw new Error('Username and password are required');
      }

      const response = await this.adminPost('/admin/create', data);
      console.log('Create admin success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Create admin failed:', error);
      throw error;
    }
  }

  /**
   * 获取管理员信息 (仅超级管理员)
   * @param {number} aid - 管理员ID
   */
  async getAdmin(aid) {
    try {
      if (!aid) {
        throw new Error('Admin ID is required');
      }

      const response = await this.adminGet(`/admin/get?aid=${aid}`);
      console.log('Get admin success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get admin failed:', error);
      throw error;
    }
  }

  /**
   * 获取管理员列表 (仅超级管理员)
   * @param {Object} params - 参数对象
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @param {string} params.role - 角色筛选 (可选)
   */
  async getAdminList(params = {}) {
    try {
      const { page = 1, size = 20, role } = params;

      const bodyData = { page, size };
      if (role) {
        bodyData.role = role;
      }

      const response = await this.adminGet('/admin/list', bodyData);
      console.log('Get admin list success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get admin list failed:', error);
      throw error;
    }
  }

  /**
   * 更新管理员信息 (仅超级管理员)
   * @param {number} aid - 管理员ID
   * @param {Object} data - 更新数据
   */
  async updateAdmin(aid, data) {
    try {
      if (!aid) {
        throw new Error('Admin ID is required');
      }

      const response = await this.adminPut(`/admin/update?aid=${aid}`, data);
      console.log('Update admin success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Update admin failed:', error);
      throw error;
    }
  }

  /**
   * 删除管理员 (仅超级管理员)
   * @param {number} aid - 管理员ID
   */
  async deleteAdmin(aid) {
    try {
      if (!aid) {
        throw new Error('Admin ID is required');
      }

      const response = await this.adminDelete(`/admin/delete?aid=${aid}`);
      console.log('Delete admin success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Delete admin failed:', error);
      throw error;
    }
  }
}

export default new AdminService();
