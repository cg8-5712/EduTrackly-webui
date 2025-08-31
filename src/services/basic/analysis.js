import ApiPrefix from '@/utils/ApiPrefix';

class AnalysisService extends ApiPrefix {
    constructor() {
        super();
    }

    async getAnalysisByDate(cid, date) {
        try {
            const data = await this.api.get(`/analysis/basic?cid=${cid}&date=${date}`);
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

export default new AnalysisService();