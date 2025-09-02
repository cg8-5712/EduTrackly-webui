import ApiPrefix from '@/utils/ApiPrefix';

class SystemService extends ApiPrefix {
    constructor() {
        super();
    }

    async getSystemInfo() {
        try {
            const data = await this.api.get(`/system`);
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
}

export default new SystemService();