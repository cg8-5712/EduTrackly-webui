import ApiPrefix from '@/utils/ApiPrefix';

class HomeworkService extends ApiPrefix {
    constructor() {
        super();
    }

    async getTodayHomework(cid) {
        try {
            const data = await this.api.get(`/homework/get?cid=${cid}`);
            console.log(data);
            console.log(data.data.code);

            if (data.data.code !== 0) {
                Error(data.data.message);
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new HomeworkService();