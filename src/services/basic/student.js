import ApiPrefix from '@/utils/ApiPrefix';

class StudentService extends ApiPrefix {
  constructor() {
    super();
  }

  // 获取指定班级的完整学生列表
  async getStudentList(cid) {
    try {
      if (!cid) throw new Error('班级ID必填');

      // 第一步：获取总数
      const first = await this.api.get('/student/list', {
        params: { cid, page: 1, size: 1 }
      });

      console.log('获取学生列表第一步:', first.data.message);

      if (first.data.code !== 0) {
        throw new Error(first.data.message);
      }

      const total = first.data.pagination?.total || 0;
      if (total === 0) return { data: [], total: 0 };

      // 第二步：获取完整列表
      const second = await this.api.get('/student/list', {
        params: { cid, page: 1, size: total }
      });

      console.log('获取学生列表第二步:', second.data.message);

      if (second.data.code !== 0) {
        throw new Error(second.data.message);
      }

      return second;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 提交学生事件
  async submitStudentEvents(events) {
    try {
      const data = await this.api.put('/student/event', events);
      console.log('提交学生事件:', data.data.message);

      if (data.data.code !== 0) {
        throw new Error(data.data.message);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new StudentService();
