import axios from 'axios';
import AuthService from '@/services/common/auth';

class ApiPrefix {
    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api/v1',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // admin 请求才加 token
    async adminGet(url, params = {}) {
        const token = AuthService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await this.api.get(url, { params, headers });
        return response.data;
    }

    async adminPost(url, data = {}) {
        const token = AuthService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await this.api.post(url, data, { headers });
        return response.data;
    }

    async adminPut(url, params = {}) {
        const token = AuthService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await this.api.put(url, { params, headers });
        return response.data;
    }

    async adminDelete(url, params = {}) {
        const token = AuthService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await this.api.delete(url, { params, headers });
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
}
