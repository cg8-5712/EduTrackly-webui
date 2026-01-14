import ApiPrefix from '@/utils/ApiPrefix';

class SettingService extends ApiPrefix {
  constructor() {
    super();
  }

  /**
   * 获取设置
   * @param {number} cid - 班级ID
   */
  async getSetting(cid) {
    try {
      if (!cid) {
        throw new Error('Class ID is required');
      }

      const response = await this.get(`/setting/get?cid=${cid}`);
      console.log('Get setting success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Get setting failed:', error);
      throw error;
    }
  }

  /**
   * 更新设置
   * @param {number} cid - 班级ID
   * @param {Object} data - 设置数据
   * @param {boolean} data.is_countdown_display - 是否显示倒计时
   * @param {boolean} data.is_slogan_display - 是否显示标语
   */
  async updateSetting(cid, data) {
    try {
      if (!cid) {
        throw new Error('Class ID is required');
      }

      const response = await this.adminPut(`/setting/update?cid=${cid}`, data);
      console.log('Update setting success:', response.message);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response;
    } catch (error) {
      console.error('Update setting failed:', error);
      throw error;
    }
  }
}

export default new SettingService();
