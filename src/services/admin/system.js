import ApiPrefix from '@/utils/ApiPrefix';

class SystemService extends ApiPrefix {
    constructor() {
        super();
    }

    async getSystemInfo() {
        try {
            const response = await this.adminGet(`/system`);
            console.log('System info retrieved successfully:', response.data.message);

            if (response.data.code !== 0) {
                throw new Error(response.data.message);
            }
            return response.data;
        } catch (error) {
            console.error('System service error:', error);
            throw error;
        }
    }
}

export default new SystemService();