import ApiPrefix from '@/utils/ApiPrefix';
import AuthService from '@/services/common/auth';

class HomeworkService extends ApiPrefix {
    constructor() {
        super();
    }

    async getTodayHomework(cid) {
        try {
            const data = await this.api.get(`/homework/get?cid=${cid}`);
            console.log(data.data.message)

            if (data.data.code !== 0) {
                Error(data.data.message);
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getHomeworkByDate(cid, date) {
        try {
            const data = await this.api.get(`/homework/get?cid=${cid}&date=${date}`);
            console.log(data.data.message)

            if (data.data.code !== 0) {
                Error(data.data.message);
            }
            console.log(data.data.data)
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // 新增函数：提交作业
    async postHomework(payload) {
        try {
            // 使用 AuthService 获取 token
            const token = AuthService.getToken();

            let data;
            if (token) {
                // 有 token 就带上
                data = await this.api.post('/homework/post', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // 没有 token 就不带（当天作业可以不需要认证）
                data = await this.api.post('/homework/post', payload);
            }

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

export default new HomeworkService();
