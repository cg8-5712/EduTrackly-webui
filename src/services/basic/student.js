import ApiPrefix from '@/utils/ApiPrefix';
import i18n from '@/i18n';

const t = (key) => i18n.global.t(key);

class StudentService extends ApiPrefix {
  constructor() {
    super();
  }

  // 获取指定班级的完整学生列表（不分页，返回所有学生）
  async getStudentListAll(cid) {
    try {
      if (!cid) throw new Error('班级ID必填');

      // 第一步：获取总数
      const first = await this.get('/student/list', {
        cid: cid,
        page: 1,
        size: 1
      });

      console.log('获取完整学生列表第一步响应:', first);

      if (first.code !== 0) {
        throw new Error(first.message || '获取学生列表失败');
      }

      const total = first.pagination?.total || 0;
      if (total === 0) return { data: [], total: 0 };

      // 第二步：获取完整列表
      const second = await this.get('/student/list', {
        cid: cid,
        page: 1,
        size: total
      });

      console.log('获取完整学生列表第二步响应:', second);

      if (second.code !== 0) {
        throw new Error(second.message || '获取学生列表失败');
      }

      return second;
    } catch (error) {
      console.error('获取完整学生列表错误:', error);
      throw error;
    }
  }

  // 获取分页学生列表
  async getStudentList(cid, page = 1, size = 20) {
    try {
      if (!cid) throw new Error('班级ID必填');

      const data = await this.get('/student/list', {
        cid: cid,
        page: page,
        size: size
      });

      console.log('获取分页学生列表响应:', data);

      if (data.code !== 0) {
        throw new Error(data.message || '获取分页学生列表失败');
      }

      return data;
    } catch (error) {
      console.error('获取分页学生列表失败:', error);
      throw error;
    }
  }

  // 获取单个学生信息
  async getStudentInfo(sid = null, studentName = null) {
    try {
      let url = '/student/get?';
      if (sid) url += `sid=${sid}`;
      if (studentName) url += `${sid ? '&' : ''}student_name=${encodeURIComponent(studentName)}`;

      const data = await this.get(url);
      console.log('获取学生信息:', data.message);

      if (data.code !== 0) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      console.error('获取学生信息失败:', error);
      throw error;
    }
  }

  // 提交学生事件
  async submitStudentEvents(events, date) {
    try {
      if (!Array.isArray(events) || events.length === 0) {
        throw new Error(t('error.eventDataEmpty'));
      }

      const url = `/student/event`;
      const data = await this.put(url, events);
      console.log(t('service.submittingStudentEvents') + ':', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || t('service.submitStudentEventsFailed'));
      }

      return data;
    } catch (error) {
      console.error(t('service.submitStudentEventsFailed') + ':', error);
      throw new Error(error.message || t('service.submitStudentEventsFailed'));
    }
  }
}

export default new StudentService();
