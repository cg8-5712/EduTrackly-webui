import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import NotificationService from './notification';

class AuthService {
    login(username, password, rememberMe) {

        return axios
            .post(`${import.meta.env.VITE_APP_API_URL}/auth/login`, {
                username,
                password,
                rememberMe
            })
            .then(response => {
                if (response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('access_token');
    }

    getToken() {
        return localStorage.getItem('access_token');
    }

    isAuthenticated() {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                NotificationService.notify('Session expired, please login again', 'error');
                this.logout();
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }


    getUserInfo() {
        const token = this.getToken();
        if (!token) return null;

        try {
            // 解码JWT获取用户信息
            const decoded = jwtDecode(token);
            console.log('Decoded token:');
            console.log(decoded);
            return decoded;
        } catch (error) {
            console.error('解码token失败:', error);
            return null;
        }
    }

    async validateToken(token) {
        try {
            localStorage.setItem('access_token', token)

            if (this.isAuthenticated()) {
                return true
            } else {
                this.logout()
                return false
            }
        } catch (error) {
            console.error('Error validating token:', error)
            this.logout()
            return false
        }
    }
}

export default new AuthService();