import ApiPrefix from '@/utils/ApiPrefix';

class AnalysisService extends ApiPrefix {
    constructor() {
        super();
    }

    async getTodayAnalysis(cid) {
        try {
            const data = await this.api.get(`/analysis/basic?cid=${cid}`);
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