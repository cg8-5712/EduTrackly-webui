import { createRouter, createWebHistory } from 'vue-router';
// import AuthService from '@/services/AuthService';

const routes = [
    { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
    { path: '/homework', name: 'Homework', component: () => import('@/views/Homework.vue') },
    { path: '/submit', name: 'Submit', component: () => import('@/views/Submit.vue') },
    { path: '/admin', name: 'Admin', component: () => import('@/views/Admin.vue') },
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

/*// 全局路由守卫，检查认证
router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !AuthService.isAuthenticated()) {
        // 未登录，跳转到登录页
        next({ name: 'Login' });
    } else if (to.name === 'Login' && AuthService.isAuthenticated()) {
        // 已登录访问登录页，跳转到首页
        next({ name: 'Home' });
    } else {
        next();
    }
});*/

export default router;
