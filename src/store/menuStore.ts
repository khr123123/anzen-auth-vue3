// src/stores/menu.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

type MenuId = number | string

/** 菜单项（树状结构） */
export interface MenuItem {
    menuId: MenuId
    menuName: string
    parentId?: MenuId
    orderNum?: number
    perms?: string | null
    url?: string | null
    menuType?: string | null
    icon?: string | null
    children?: MenuItem[]
}

const STORAGE_KEY = 'anzen_menu'

export const useMenuStore = defineStore('menu', () => {
    // 树状菜单
    const treeMenus = ref<MenuItem[]>([])

    /** 设置树状菜单（可直接传树状结构，并持久化到 localStorage） */
    function setMenus(menus: MenuItem[]) {
        treeMenus.value = menus
        sortTree(treeMenus.value)
        persist()
    }

    /** 从 localStorage 初始化菜单 */
    function initFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const data: MenuItem[] = JSON.parse(raw)
                treeMenus.value = data
            }
        } catch (e) {
            console.warn('menu init failed', e)
        }
    }

    /** 持久化到 localStorage */
    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(treeMenus.value))
        } catch (e) {
            console.warn('menu persist failed', e)
        }
    }

    /** 递归排序树 */
    function sortTree(nodes: MenuItem[]) {
        nodes.sort((a, b) => (Number(a.orderNum ?? 0) - Number(b.orderNum ?? 0)))
        nodes.forEach(n => {
            if (n.children?.length) sortTree(n.children)
        })
    }

    /** 根据权限数组过滤树（非破坏式） */
    function filterByPermissions(permsArr: string[], includeButtons = false): MenuItem[] {
        const hasPerm = (node: MenuItem) => {
            if (!node.perms) return true
            const nodePerms = String(node.perms).split(',').map(s => s.trim()).filter(Boolean)
            return nodePerms.some(p => permsArr.includes(p))
        }

        const filterRec = (nodes: MenuItem[]): MenuItem[] => {
            const res: MenuItem[] = []
            for (const n of nodes) {
                if (!includeButtons && n.menuType === 'F') continue
                const children = n.children ? filterRec(n.children) : []
                const keepSelf = hasPerm(n)
                if (keepSelf || children.length) {
                    res.push({ ...n, children: children.length ? children : undefined })
                }
            }
            return res
        }

        return filterRec(treeMenus.value)
    }

    /** 清空菜单 */
    function clearMenus() {
        treeMenus.value = []
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
            console.warn('remove menu storage failed', e)
        }
    }

    // 初始化时尝试恢复 localStorage
    initFromStorage()

    return {
        treeMenus,
        setMenus,
        filterByPermissions,
        clearMenus
    }
})
