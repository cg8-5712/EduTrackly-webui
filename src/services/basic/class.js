import ApiPrefix from "@/utils/ApiPrefix";

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
      const firstResp = await this.api.post("/class/list?order=asc", {
        page: 1,
        size: 1,
      });

      if (firstResp.data.code !== 0) {
        throw new Error(firstResp.data.message);
      }

      const total = firstResp.data.pagination.total;

      // 再请求一次，拿到所有数据
      const resp = await this.api.post("/class/list?order=asc", {
        page: 1,
        size: total,
      });

      if (resp.data.code !== 0) {
        throw new Error(resp.data.message);
      }

      return resp.data.data; // 返回班级数组
    } catch (error) {
      console.error("获取班级失败:", error);
      throw error;
    }
  }
}

export default new ClassService();
