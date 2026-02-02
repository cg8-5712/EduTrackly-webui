import axios from 'axios';
import AuthService from '@/services/common/auth';
import { getApiUrl } from '@/config/apiConfig';

class ApiPrefix {
    constructor() {
        // 使用动态获取的API URL
        const baseURL = getApiUrl();

        this.api = axios.create({
            baseURL: baseURL,
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(`[ApiPrefix] Initialized with baseURL: ${baseURL}`);

        // 添加响应拦截器，处理错误
        this.api.interceptors.response.use(
            response => response,
            error => {
                // 如果后端返回了错误响应
                if (error.response?.data) {
                    const errorData = error.response.data;
                    // 提取错误消息
                    const errorMessage = errorData.message || errorData.error?.message || error.message;
                    // 创建新的错误对象，包含后端返回的消息
                    const newError = new Error(errorMessage);
                    newError.code = errorData.code || errorData.error?.code;
                    newError.status = error.response.status;
                    newError.originalError = error;
                    throw newError;
                }
                throw error;
            }
        );
    }

    /**
     * 获取当前的baseURL
     * @returns {string} 当前API基础URL
     */
    getBaseURL() {
        return this.api.defaults.baseURL;
    }

    /**
     * 动态更新baseURL(用于特殊场景)
     * @param {string} newBaseURL - 新的API基础URL
     */
    updateBaseURL(newBaseURL) {
        this.api.defaults.baseURL = newBaseURL;
        console.log(`[ApiPrefix] BaseURL updated to: ${newBaseURL}`);
    }

    // admin 请求才加 token
    async adminGet(url, params = {}) {
        const token = AuthService.getToken();
        if (!token) throw new Error('未登录或登录已过期');
        const response = await this.api.get(url, {
            params,
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async adminPost(url, data = {}) {
        const token = AuthService.getToken();
        if (!token) throw new Error('未登录或登录已过期');
        const response = await this.api.post(url, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async adminPut(url, data = {}) {
        const token = AuthService.getToken();
        if (!token) throw new Error('未登录或登录已过期');
        const response = await this.api.put(url, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async adminDelete(url, params = {}) {
        const token = AuthService.getToken();
        if (!token) throw new Error('未登录或登录已过期');
        const response = await this.api.delete(url, {
            params,
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    // 其他普通请求可以直接用 get/post/put/delete
    async get(url, params = {}) {
        const response = await this.api.get(url, { params });
        return response.data;
    }

    async post(url, data = {}) {
        const response = await this.api.post(url, data);
        return response.data;
    }

    async put(url, data = {}) {
        const response = await this.api.put(url, data);
        return response.data;
    }

    async delete(url, params = {}) {
        const response = await this.api.delete(url, { params });
        return response.data;
    }

    /**
     * 可选认证的 POST 请求
     * 如果有 token 就带上，没有就不带
     * 后端会根据业务逻辑决定是否需要认证
     * @param {string} url - 请求 URL
     * @param {Object} data - 请求数据
     * @returns {Promise<any>} 响应数据
     */
    async optionalAuthPost(url, data = {}) {
        const token = AuthService.getToken();

        if (token) {
            // 有 token 就带上
            const response = await this.api.post(url, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } else {
            // 没有 token 就不带
            return await this.post(url, data);
        }
    }
}

export default ApiPrefix;