import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Homework from '../views/Homework.vue';
import Submit from '../views/Submit.vue';
import Admin from '../views/Admin.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/homework', component: Homework },
    { path: '/submit', component: Submit },
    { path: '/admin', component: Admin },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
