import ApiPrefix from '@/utils/ApiPrefix';
import AuthService from '@/services/common/auth';
import { getApiUrl } from '@/config/apiConfig';

class AnalysisService extends ApiPrefix {
    constructor() {
        super();
    }

    /**
     * 获取今日出勤分析
     * @param {number} cid - 班级ID
     */
    async getTodayAnalysis(cid) {
        try {
            const response = await this.get(`/analysis/basic?cid=${cid}`);
            console.log('Get today analysis success:', response.message);

            if (response.code !== 0) {
                throw new Error(response.message);
            }
            return response;
        } catch (error) {
            console.error('Get today analysis failed:', error);
            throw error;
        }
    }

    /**
     * 获取指定日期出勤分析
     * @param {number} cid - 班级ID
     * @param {number} date - 8位日期
     */
    async getAnalysisByDate(cid, date) {
        try {
            const response = await this.get(`/analysis/basic?cid=${cid}&date=${date}`);
            console.log('Get analysis by date success:', response.message);

            if (response.code !== 0) {
                throw new Error(response.message);
            }
            return response;
        } catch (error) {
            console.error('Get analysis by date failed:', error);
            throw error;
        }
    }

    /**
     * 获取班级分析数据
     * @param {number} cid - 班级ID
     */
    async getClassAnalysis(cid) {
        try {
            if (!cid) {
                throw new Error('Class ID is required');
            }

            const response = await this.adminGet(`/analysis/class?cid=${cid}`);
            console.log('Get class analysis success:', response.message);

            if (response.code !== 0) {
                throw new Error(response.message);
            }
            return response;
        } catch (error) {
            console.error('Get class analysis failed:', error);
            throw error;
        }
    }

    /**
     * 获取学生分析数据
     * @param {number} sid - 学生ID
     * @param {number} startDate - 开始日期 (可选)
     * @param {number} endDate - 结束日期 (可选)
     */
    async getStudentAnalysis(sid, startDate = null, endDate = null) {
        try {
            if (!sid) {
                throw new Error('Student ID is required');
            }

            let url = `/analysis/student?sid=${sid}`;
            if (startDate) url += `&startDate=${startDate}`;
            if (endDate) url += `&endDate=${endDate}`;

            const response = await this.adminGet(url);
            console.log('Get student analysis success:', response.message);

            if (response.code !== 0) {
                throw new Error(response.message);
            }
            return response;
        } catch (error) {
            console.error('Get student analysis failed:', error);
            throw error;
        }
    }

    /**
     * 导出班级出勤数据Excel
     * @param {number} cid - 班级ID
     * @param {number} startDate - 起始日期 (8位 YYYYMMDD)
     * @param {number} endDate - 结束日期 (8位 YYYYMMDD)
     * @returns {Promise<Blob>} Excel文件Blob
     */
    async exportClassAttendance(cid, startDate, endDate) {
        try {
            if (!cid || !startDate || !endDate) {
                throw new Error('Class ID, start date, and end date are required');
            }

            const token = AuthService.getToken();
            if (!token) throw new Error('未登录或登录已过期');

            const baseURL = getApiUrl();
            const url = `${baseURL}/analysis/export/class?cid=${cid}&startDate=${startDate}&endDate=${endDate}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Export failed');
            }

            const blob = await response.blob();
            console.log('Export class attendance success');
            return blob;
        } catch (error) {
            console.error('Export class attendance failed:', error);
            throw error;
        }
    }

    /**
     * 导出学生出勤数据Excel
     * @param {string|Array<number>} sids - 学生ID列表 (逗号分隔字符串或数组)
     * @param {number} startDate - 起始日期 (8位 YYYYMMDD)
     * @param {number} endDate - 结束日期 (8位 YYYYMMDD)
     * @returns {Promise<Blob>} Excel文件Blob
     */
    async exportStudentsAttendance(sids, startDate, endDate) {
        try {
            if (!sids || !startDate || !endDate) {
                throw new Error('Student IDs, start date, and end date are required');
            }

            const token = AuthService.getToken();
            if (!token) throw new Error('未登录或登录已过期');

            const sidsStr = Array.isArray(sids) ? sids.join(',') : sids;
            const baseURL = getApiUrl();
            const url = `${baseURL}/analysis/export/students?sids=${sidsStr}&startDate=${startDate}&endDate=${endDate}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Export failed');
            }

            const blob = await response.blob();
            console.log('Export students attendance success');
            return blob;
        } catch (error) {
            console.error('Export students attendance failed:', error);
            throw error;
        }
    }

    /**
     * 导出作业数据Excel
     * @param {number} cid - 班级ID
     * @param {number} startDate - 起始日期 (8位 YYYYMMDD)
     * @param {number} endDate - 结束日期 (8位 YYYYMMDD)
     * @returns {Promise<Blob>} Excel文件Blob
     */
    async exportHomeworkData(cid, startDate, endDate) {
        try {
            if (!cid || !startDate || !endDate) {
                throw new Error('Class ID, start date, and end date are required');
            }

            const token = AuthService.getToken();
            if (!token) throw new Error('未登录或登录已过期');

            const baseURL = getApiUrl();
            const url = `${baseURL}/analysis/export/homework?cid=${cid}&startDate=${startDate}&endDate=${endDate}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Export failed');
            }

            const blob = await response.blob();
            console.log('Export homework data success');
            return blob;
        } catch (error) {
            console.error('Export homework data failed:', error);
            throw error;
        }
    }

    /**
     * 下载Excel文件的辅助方法
     * @param {Blob} blob - Excel文件Blob
     * @param {string} filename - 文件名
     */
    downloadExcel(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

export default new AnalysisService();