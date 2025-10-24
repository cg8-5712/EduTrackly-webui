import ApiPrefix from "@/utils/ApiPrefix";
import i18n from '@/i18n';

const t = (key) => i18n.global.t(key);

class ClassService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 获取所有班级（一次性拉取全部数据，便于前端搜索）
   */
  async getAllClasses() {
    try {
      // 第一次获取 total
      const firstResp = await this.api.get("/class/list?order=asc", {
        page: 1,
        size: 1,
      });

      if (firstResp.data.code !== 0) {
        throw new Error(firstResp.data.message);
      }

      const total = firstResp.data.pagination.total;

      // 再请求一次，拿到所有数据
      const resp = await this.api.get("/class/list?order=asc", {
        page: 1,
        size: total,
      });

      if (resp.data.code !== 0) {
        throw new Error(resp.data.message);
      }

      return resp.data.data; // 返回班级数组
    } catch (error) {
      console.error(t('service.getClassesFailed') + ":", error);
      throw error;
    }
  }

  /**
   * 获取班级基本信息（普通权限）
   * @param {number} cid - 班级ID
   * @param {string} className - 班级名称（与cid二选一）
   */
  async getClassInfo(cid = null, className = null) {
    try {
      if (!cid && !className) {
        throw new Error(t('error.classIdOrNameRequired'));
      }

      let url = '/class/get?';
      if (cid) {
        url += `cid=${cid}`;
      } else {
        url += `class_name=${encodeURIComponent(className)}`;
      }

      const response = await this.get(url);
      console.log(t('service.getClassInfoSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getClassInfoFailed') + ':', error);
      throw error;
    }
  }
}

export default new ClassService();