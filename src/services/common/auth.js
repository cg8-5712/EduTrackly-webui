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

    adminLogin(password) {
        return axios
            .post(`${import.meta.env.VITE_APP_API_URL}/admin/login`, {
                password
            })
            .then(response => {
                if (response.data.data && response.data.data.access_token) {
                    const { access_token, aid, expires_in, last_login_time, last_login_ip } = response.data.data;

                    localStorage.setItem('admin_token', access_token);
                    localStorage.setItem('admin_aid', aid);
                    localStorage.setItem('admin_last_login_time', last_login_time);
                    localStorage.setItem('admin_last_login_ip', last_login_ip);

                    // 计算过期时间戳并存储
                    const currentTime = Math.floor(Date.now() / 1000);
                    const expiresAtTimestamp = currentTime + expires_in;
                    localStorage.setItem('admin_expires_in', expiresAtTimestamp);
                }
                return response.data;
            })
            .catch(error => {
                console.error('Admin login error:', error);
                throw error;
            });
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_aid');
        localStorage.removeItem('admin_expires_in');
        localStorage.removeItem('admin_last_login_time');
        localStorage.removeItem('admin_last_login_ip');
    }

    getToken() {
        return localStorage.getItem('access_token');
    }

    getAdminToken() {
        return localStorage.getItem('admin_token');
    }

    getAdminInfo() {
        return {
            aid: localStorage.getItem('admin_aid'),
            token: localStorage.getItem('admin_token'),
            expiresIn: localStorage.getItem('admin_expires_in'),
            lastLoginTime: localStorage.getItem('admin_last_login_time'),
            lastLoginIp: localStorage.getItem('admin_last_login_ip')
        };
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

    isAdminAuthenticated() {
        const token = this.getAdminToken();
        if (!token) {
            return false;
        }

        try {
            // 首先检查JWT是否有效
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                NotificationService.notify('Admin session expired, please login again', 'error');
                this.logout();
                return false;
            }

            // 检查存储的过期时间（如果有的话）
            const storedExpiresIn = localStorage.getItem('admin_expires_in');
            if (storedExpiresIn) {
                const expiresInTimestamp = parseInt(storedExpiresIn);
                const currentTimestamp = Date.now() / 1000;

                if (currentTimestamp >= expiresInTimestamp) {
                    NotificationService.notify('Admin session expired, please login again', 'error');
                    this.logout();
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Error validating admin token:', error);
            this.logout();
            return false;
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