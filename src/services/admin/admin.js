import ApiPrefix from '@/utils/ApiPrefix';
import i18n from '@/i18n';

const t = (key) => i18n.global.t(key);

class AdminManagementService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 获取当前管理员信息
   * GET /admin/me
   */
  async getCurrentAdmin() {
    try {
      const response = await this.adminGet('/admin/me');
      console.log(t('service.getCurrentAdminSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getCurrentAdminFailed'), error);
      throw error;
    }
  }

  /**
   * 创建管理员
   * POST /admin/create
   * @param {Object} data - { password: string, role?: 'admin' | 'superadmin' }
   */
  async createAdmin(data) {
    try {
      if (!data.password || data.password.length < 8) {
        throw new Error(t('error.passwordTooShort'));
      }

      const response = await this.adminPost('/admin/create', {
        password: data.password,
        role: data.role || 'admin'
      });
      console.log(t('service.createAdminSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.createAdminFailed'), error);
      throw error;
    }
  }

  /**
   * 根据 ID 获取管理员
   * GET /admin/get?aid={aid}
   * @param {number} aid - 管理员 ID
   */
  async getAdmin(aid) {
    try {
      if (!aid) {
        throw new Error(t('error.adminIdRequired'));
      }

      const response = await this.adminGet(`/admin/get?aid=${aid}`);
      console.log(t('service.getAdminSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getAdminFailed'), error);
      throw error;
    }
  }

  /**
   * 获取管理员列表（分页）
   * GET /admin/list
   * @param {Object} params - { page?: number, size?: number, role?: string }
   */
  async getAdminList(params = {}) {
    try {
      const { page = 1, size = 20, role } = params;

      const bodyData = { page, size };
      if (role && role !== 'all') {
        bodyData.role = role;
      }

      const response = await this.adminGet('/admin/list', bodyData);
      console.log(t('service.getAdminListSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getAdminListFailed'), error);
      throw error;
    }
  }

  /**
   * 更新管理员
   * PUT /admin/update?aid={aid}
   * @param {number} aid - 管理员 ID
   * @param {Object} data - { password?: string, role?: string }
   */
  async updateAdmin(aid, data) {
    try {
      if (!aid) {
        throw new Error(t('error.adminIdRequired'));
      }

      if (data.password && data.password.length < 8) {
        throw new Error(t('error.passwordTooShort'));
      }

      const response = await this.adminPut(`/admin/update?aid=${aid}`, data);
      console.log(t('service.updateAdminSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.updateAdminFailed'), error);
      throw error;
    }
  }

  /**
   * 删除管理员
   * DELETE /admin/delete?aid={aid}
   * @param {number} aid - 管理员 ID
   */
  async deleteAdmin(aid) {
    try {
      if (!aid) {
        throw new Error(t('error.adminIdRequired'));
      }

      const response = await this.adminDelete(`/admin/delete?aid=${aid}`);
      console.log(t('service.deleteAdminSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.deleteAdminFailed'), error);
      throw error;
    }
  }

  /**
   * 分配班级给管理员
   * POST /admin/class/assign?aid={aid}&cid={cid}
   * @param {number} aid - 管理员 ID
   * @param {number} cid - 班级 ID
   */
  async assignClass(aid, cid) {
    try {
      if (!aid || !cid) {
        throw new Error(t('error.adminIdAndClassIdRequired'));
      }

      const response = await this.adminPost(`/admin/class/assign?aid=${aid}&cid=${cid}`);
      console.log(t('service.assignClassSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.assignClassFailed'), error);
      throw error;
    }
  }

  /**
   * 移除管理员的班级分配
   * DELETE /admin/class/remove?aid={aid}&cid={cid}
   * @param {number} aid - 管理员 ID
   * @param {number} cid - 班级 ID
   */
  async removeClass(aid, cid) {
    try {
      if (!aid || !cid) {
        throw new Error(t('error.adminIdAndClassIdRequired'));
      }

      const response = await this.adminDelete(`/admin/class/remove?aid=${aid}&cid=${cid}`);
      console.log(t('service.removeClassSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.removeClassFailed'), error);
      throw error;
    }
  }

  /**
   * 获取管理员的班级列表
   * GET /admin/class/list?aid={aid}
   * @param {number} aid - 管理员 ID
   */
  async getAdminClasses(aid) {
    try {
      if (!aid) {
        throw new Error(t('error.adminIdRequired'));
      }

      const response = await this.adminGet(`/admin/class/list?aid=${aid}`);
      console.log(t('service.getAdminClassesSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getAdminClassesFailed'), error);
      throw error;
    }
  }

  /**
   * 替换管理员的所有班级
   * PUT /admin/class/replace?aid={aid}
   * @param {number} aid - 管理员 ID
   * @param {number[]} cids - 班级 ID 数组
   */
  async replaceClasses(aid, cids) {
    try {
      if (!aid) {
        throw new Error(t('error.adminIdRequired'));
      }

      if (!Array.isArray(cids)) {
        throw new Error(t('error.classIdsArrayRequired'));
      }

      const response = await this.adminPut(`/admin/class/replace?aid=${aid}`, { cids });
      console.log(t('service.replaceClassesSuccess'), response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.replaceClassesFailed'), error);
      throw error;
    }
  }

  /**
   * 批量分配班级（辅助方法）
   * @param {number} aid - 管理员 ID
   * @param {number[]} cids - 班级 ID 数组
   */
  async batchAssignClasses(aid, cids) {
    try {
      const results = await Promise.allSettled(
        cids.map(cid => this.assignClass(aid, cid))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        successful,
        failed,
        total: cids.length
      };
    } catch (error) {
      console.error(t('service.batchAssignFailed'), error);
      throw error;
    }
  }
}

export default new AdminManagementService();
