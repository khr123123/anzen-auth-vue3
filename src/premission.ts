import { type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router';
import router from './router';
import { Message } from '@arco-design/web-vue';

import { useUserStore } from '@/store/userStore';
import { useTokenStore } from '@/store/tokenStore';
import { getLoginUserInfo } from './api/sysUserController';

//路由守卫

const whiteList: string[] = ['/login', '/register'];
const isWhiteList = (path: string) => whiteList.includes(path);

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore();
    const tokenStore = useTokenStore();
    const token = tokenStore.token;

    if (token) {
        if (to.path === '/login') {
            next({ path: '/' });
            return;
        }

        if (isWhiteList(to.path)) {
            next();
            return;
        }

        // 如果需要拉取用户信息
        if (!userStore.user?.roles || userStore.user?.roles.length === 0) {
            try {
                getLoginUserInfo().then((res) => {
                    userStore.setUser(res.data);
                });
                next();
            } catch (err: any) {
                userStore.clearUser();
                tokenStore.clearToken();
                Message.error(err?.message || '获取用户信息失败，请重新登录');
                next({ path: '/login' });
            }
        } else {
            next();
        }
    } else {
        // 没有 token
        if (isWhiteList(to.path)) {
            next();
        } else {
            next(`/login?redirect=${to.fullPath}`);
        }
    }
});

router.afterEach(() => {
    // 后置守卫可以为空
});
