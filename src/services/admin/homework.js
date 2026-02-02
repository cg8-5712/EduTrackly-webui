import ApiPrefix from '@/utils/ApiPrefix';
import i18n from '@/i18n';

const t = (key) => i18n.global.t(key);

class AdminHomeworkService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 获取指定日期作业
   * @param {number} date - 8位日期（可选，默认今日）
   * @param {number} cid - 班级ID（可选）
   */
  async getHomework(date = null, cid = null) {
    try {
      let url = '/homework/get?';
      const params = [];

      if (date) {
        params.push(`date=${date}`);
      }
      if (cid) {
        params.push(`cid=${cid}`);
      }

      url += params.join('&');

      const response = await this.get(url);
      console.log(t('service.getHomeworkSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getHomeworkFailed') + ':', error);
      throw error;
    }
  }

  /**
   * 获取作业列表（分页）
   * @param {Object} params - 参数对象
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @param {number} params.cid - 班级ID（可选）
   * @param {number} params.startDate - 开始日期（可选）
   * @param {number} params.endDate - 结束日期（可选）
   * @param {string} params.order - 排序方式 (desc/incs)
   */
  async getHomeworkList(params = {}) {
    try {
      const { page = 1, size = 10, cid, startDate, endDate, order = 'desc' } = params;

      let url = `/homework/list?order=${order}`;

      if (cid) {
        url += `&cid=${cid}`;
      }
      if (startDate) {
        url += `&startDate=${startDate}`;
      }
      if (endDate) {
        url += `&endDate=${endDate}`;
      }

      // page 和 size 作为 body 内容发送
      const bodyData = { page, size };
      const response = await this.get(url, bodyData);
      console.log(t('service.getHomeworkListSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.getHomeworkListFailed') + ':', error);
      throw error;
    }
  }

  /**
   * 创建作业
   * @param {Object} data - 作业数据
   * @param {number} data.cid - 班级ID
   * @param {Object|string} data.homework_content - 作业内容（对象格式或JSON字符串）
   * @param {number} data.due_date - 截止日期（8位数字）
   */
  async createHomework(data) {
    try {
      if (!data.cid || !data.homework_content || !data.due_date) {
        throw new Error(t('error.homeworkContentAndDateRequired'));
      }

      const url = '/homework/post';
      const response = await this.optionalAuthPost(url, data);
      console.log(t('service.createHomeworkSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.createHomeworkFailed') + ':', error);
      throw error;
    }
  }

  /**
   * 更新作业 - 管理员权限
   * @param {Object} data - 作业数据
   * @param {number} data.cid - 班级ID
   * @param {Object} data.homework_content - 作业内容（对象格式）
   * @param {number} data.due_date - 截止日期（8位数字）
   */
  async updateHomework(data) {
    try {
      if (!data.cid || !data.homework_content || !data.due_date) {
        throw new Error(t('error.homeworkContentAndDateRequired'));
      }

      const url = '/homework/post';
      const response = await this.optionalAuthPost(url, data);
      console.log(t('service.updateHomeworkSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.updateHomeworkFailed') + ':', error);
      throw error;
    }
  }

  /**
   * 删除作业 - 管理员权限
   * @param {number} cid - 班级ID
   * @param {number} date - 日期（8位数字）
   */
  async deleteHomework(cid, date) {
    try {
      if (!cid) {
        throw new Error(t('error.classIdEmpty'));
      }

      let url = `/homework/delete?cid=${cid}`;
      if (date) {
        url += `&date=${date}`;
      }

      const response = await this.adminDelete(url);
      console.log(t('service.deleteHomeworkSuccess') + ':', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error(t('service.deleteHomeworkFailed') + ':', error);
      throw error;
    }
  }
}

export default new AdminHomeworkService();
