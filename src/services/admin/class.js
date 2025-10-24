import ApiPrefix from '@/utils/ApiPrefix';
import i18n from '@/i18n';

const t = (key) => i18n.global.t(key);

class AdminClassService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 获取班级列表（分页）- 管理员权限
   * @param {Object} params - 参数对象
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @param {string} params.order - 排序方式 (asc/desc)
   */
  async getClassList(params = {}) {
    try {
      const { page = 1, size = 10, order = 'asc' } = params;
      const url = `/class/list?order=${order}`;

      // page 和 size 作为 body 内容发送
      const bodyData = { page, size };
      const response = await this.get(url, bodyData);
      console.log(t('service.getClassListSuccess') + ':', response.message);

      if (response.code !== 0) {
        Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getClassListFailed') + ':', error);
      throw error;
    }
  }

  /**
   * 获取班级详情（包含学生列表）- 管理员权限
   * @param {number} cid - 班级ID
   * @param {string} className - 班级名称（与cid二选一）
   */
  async getClassDetail(cid = null, className = null) {
    try {
      if (!cid && !className) {
        Error(t('error.classIdOrNameRequired'));
      }

      let url = '/class/get?';
      if (cid) {
        url += `cid=${cid}`;
      } else {
        url += `class_name=${encodeURIComponent(className)}`;
      }

      const response = await this.adminGet(url);
      console.log(t('service.getClassDetailSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getClassDetailFailed') + ':', error);
      throw error;
    }
  }

  /**
   * 创建班级 - 管理员权限
   * @param {string} className - 班级名称
   */
  async createClass(className) {
    try {
      if (!className) {
        throw new Error(t('error.classNameRequired'));
      }

      const url = `/class/create?class_name=${encodeURIComponent(className)}`;
      const response = await this.adminPost(url);
      console.log(t('service.createClassSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.createClassFailed') + ':', error);
      throw error;
    }
  }

  /**
   * 删除班级 - 管理员权限
   * @param {number} cid - 班级ID
   */
  async deleteClass(cid) {
    try {
      if (!cid) {
        throw new Error(t('error.classIdEmpty'));
      }

      const url = `/class/delete?cid=${cid}`;
      const response = await this.adminDelete(url);
      console.log(t('service.deleteClassSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.deleteClassFailed') + ':', error);
      throw error;
    }
  }

  /**
   * 获取班级分析数据 - 管理员权限
   * @param {number} cid - 班级ID
   */
  async getClassAnalysis(cid) {
    try {
      if (!cid) {
        throw new Error(t('error.classIdEmpty'));
      }

      const url = `/analysis/class?cid=${cid}`;
      const response = await this.adminGet(url);
      console.log(t('service.getClassAnalysisSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getClassAnalysisFailed') + ':', error);
      throw error;
    }
  }
}

export default new AdminClassService();