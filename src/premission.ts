import router from '@/router'
import { useUserStore } from '@/store/userStore'
import { useTokenStore } from '@/store/tokenStore'
import { useMenuStore, type MenuItem } from '@/store/menuStore'
import type { RouteRecordRaw } from 'vue-router'

const whiteList: string[] = ['/login']

// 前置路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const tokenStore = useTokenStore()
    const menuStore = useMenuStore()

    // 加载路由绑定状态 如果绑定过一次不需要再次解析 (退出成功后再次开启绑定)
    let hasRoutes: boolean = userStore.hasRoutes
    // 加载菜单树
    let menuList: MenuItem[] = menuStore.treeMenus
    // 获取token
    let token: string | null = tokenStore.token

    if (token) {
        if (!hasRoutes) {
            // 动态加载路由
            bindRoute(menuList)
            // 解析完毕后修改状态,防止请求频繁解析
            userStore.setHasRoutes(true)
            next(to.path) // next({ path: '/index' }); // ----------解决刷新白屏问题
        } else {
            next() // 放行
        }
    } else {
        if (whiteList.includes(to.path)) {
            next() // 白名单放行
        } else {
            router.replace('/login')
        }
    }
})

/**
 * 动态绑定路由 
 * 第二级菜单对象是路由目标对象
 * @param menuList 
 */
const bindRoute = (menuList: MenuItem[]): void => {
    menuList.forEach(menuRoot => {
        if (menuRoot.children) {
            menuRoot.children.forEach(menu => {
                // 将菜单转换成路由对象
                let route: RouteRecordRaw | null = menuToRoute(menu, menuRoot.menuName)
                if (route) {
                    router.addRoute('Layout', route)
                }
            })
        }
    })
}

/**
 * 将菜单对象转换成路由对象
 * @param menu 
 * @param parentName 
 * @returns 
 */
const menuToRoute = (menu: MenuItem, parentName: string): RouteRecordRaw | null => {
    if (!menu.url) {
        return null
    }

    const route: RouteRecordRaw = {
        name: menu.menuName,
        path: menu.url,
        meta: {
            parentName, // 面包屑使用
            title: menu.menuName // 标题栏上显示
        },
        component: () =>
            import(/* @vite-ignore */ './views' + menu.url + '.vue').catch(() =>
                import('@/views/404.vue')
            )
    }

    return route
}
