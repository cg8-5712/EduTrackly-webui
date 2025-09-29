import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/services/common/auth';

const routes = [
    { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
    { path: '/homework', name: 'Homework', component: () => import('@/views/Homework.vue') },
    { path: '/submit', name: 'Submit', component: () => import('@/views/Submit.vue') },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/Admin.vue'),
        meta: { requiresAdminAuth: true }
    },
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 全局路由守卫，检查admin认证
router.beforeEach((to, from, next) => {
    // 检查是否需要admin认证
    if (to.matched.some(record => record.meta.requiresAdminAuth)) {
        // 这里不阻止访问，让Admin.vue组件自己处理认证逻辑
        // 这样可以保证用户看到登录界面而不是被重定向
        next();
    } else {
        next();
    }
});

export default router;
