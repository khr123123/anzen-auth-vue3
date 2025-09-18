// src/stores/menu.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

type MenuId = number | string

/** 对应 sys_menu 表的字段 */
export interface MenuItemRaw {
    menu_id: MenuId
    menu_name: string
    parent_id?: MenuId // DB 默认 0
    order_num?: number
    perms?: string | null // 权限字符串 (如 "system:user:list")
    url?: string | null // 路由地址
    menu_type?: string | null // 'M' 目录, 'C' 菜单, 'F' 按钮
    icon?: string | null
}

/** 带 children 的树节点 */
export interface MenuItem extends MenuItemRaw {
    children?: MenuItem[]
}

const STORAGE_KEY = 'anzen_menu'

export const useMenuStore = defineStore('menu', () => {
    // 存原始扁平结构（从后端拿到的）
    const flatMenus = ref<MenuItemRaw[]>([])
    // 存树状结构（用于渲染）
    const treeMenus = ref<MenuItem[]>([])

    /** 持久化扁平数据（方便恢复） */
    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(flatMenus.value))
        } catch (e) {
            console.warn('menu persist failed', e)
        }
    }

    /** 从 localStorage 恢复（并构建树） */
    function initFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw) as MenuItemRaw[]
                setMenusFromFlat(parsed, { persist: false })
            }
        } catch (e) {
            console.warn('menu init failed', e)
        }
    }

    /**
     * 设置扁平菜单，然后构建树并排序
     * options.persist: 是否写入 localStorage（默认 true）
     */
    function setMenusFromFlat(data: MenuItemRaw[], options: { persist?: boolean } = {}) {
        flatMenus.value = Array.isArray(data) ? data.map(d => ({ ...d })) : []
        buildTreeFromFlat()
        if (options.persist ?? true) persist()
    }

    /** 清空菜单 */
    function clearMenus() {
        flatMenus.value = []
        treeMenus.value = []
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
            console.warn('remove menu storage failed', e)
        }
    }

    /** 扁平转树并按 order_num 排序（递归） */
    function buildTreeFromFlat() {
        const map = new Map<string, MenuItem>()
        flatMenus.value.forEach(item => {
            const copy: MenuItem = { ...item }
            copy.children = []
            map.set(String(item.menu_id), copy)
        })

        const roots: MenuItem[] = []
        map.forEach(node => {
            const pid = node.parent_id ?? 0
            if (pid === 0 || !map.has(String(pid))) {
                roots.push(node)
            } else {
                const parent = map.get(String(pid))!
                parent.children = parent.children ?? []
                parent.children.push(node)
            }
        })

        const sortRec = (arr: MenuItem[]) => {
            arr.sort((a, b) => (Number(a.order_num ?? 0) - Number(b.order_num ?? 0)))
            arr.forEach(n => {
                if (n.children && n.children.length) sortRec(n.children)
                else n.children = n.children && n.children.length ? n.children : undefined
            })
        }

        sortRec(roots)
        treeMenus.value = roots
    }

    /** 返回扁平拷贝 */
    function getFlat(): MenuItemRaw[] {
        return flatMenus.value.slice()
    }

    /** 返回树状拷贝 */
    function getTree(): MenuItem[] {
        return treeMenus.value.slice()
    }

    /** 根据 menu_id 查找（在树中） */
    function findById(id: MenuId, list: MenuItem[] = treeMenus.value): MenuItem | null {
        for (const item of list) {
            if (String(item.menu_id) === String(id)) return item
            if (item.children) {
                const found = findById(id, item.children)
                if (found) return found
            }
        }
        return null
    }

    /** 根据 url 查找 */
    function findByUrl(url: string, list: MenuItem[] = treeMenus.value): MenuItem | null {
        for (const item of list) {
            if (item.url === url) return item
            if (item.children) {
                const found = findByUrl(url, item.children)
                if (found) return found
            }
        }
        return null
    }

    /**
     * 根据权限数组过滤树（非破坏式，返回新树）
     * - permsArr 为用户拥有的权限字符串数组
     * - includeButtons: 是否保留 menu_type === 'F'（按钮），默认 false（通常按钮不在侧栏显示）
     *
     * 过滤规则：
     * - 如果节点没有 perms 字段（或为空），则保留（假设菜单开放）
     * - 如果节点 有 perms，则当 perms 与 permsArr 有任意交集时保留
     * - 即使节点本身权限不通过，但其子节点有通过的，也保留该父节点（只包含通过的子节点）
     */
    function filterByPermissions(permsArr: string[], includeButtons = false): MenuItem[] {
        const hasPerm = (node: MenuItem) => {
            if (!node.perms) return true
            // 后端可能用逗号分隔多个 perms
            const nodePerms = String(node.perms).split(',').map(s => s.trim()).filter(Boolean)
            return nodePerms.some(p => permsArr.includes(p))
        }

        const filterRec = (nodes: MenuItem[]): MenuItem[] => {
            const res: MenuItem[] = []
            for (const n of nodes) {
                if (!includeButtons && n.menu_type === 'F') {
                    continue // 按钮默认跳过
                }
                const children = n.children ? filterRec(n.children) : []
                const keepSelf = hasPerm(n)
                if (keepSelf || children.length) {
                    const copy: MenuItem = { ...n, children: children.length ? children : undefined }
                    res.push(copy)
                }
            }
            return res
        }

        return filterRec(treeMenus.value)
    }

    /** 将后端扁平列表转换为前端路由结构（可选）——示例：保留 url & children */
    function toRouteTree(includeButtons = false): Array<{ path?: string; name: string; meta?: any; children?: any[] }> {
        const filtered = includeButtons ? getTree() : filterByPermissions([], includeButtons)
        const convert = (nodes: MenuItem[]) => {
            return nodes.map(n => {
                const node: any = {
                    path: n.url || '',
                    name: n.menu_name,
                    meta: {
                        perm: n.perms,
                        icon: n.icon,
                        menu_type: n.menu_type
                    }
                }
                if (n.children && n.children.length) node.children = convert(n.children)
                return node
            })
        }
        return convert(filtered)
    }

    // 初始化时尝试恢复
    initFromStorage()

    return {
        // state
        flatMenus,
        treeMenus,
        // actions
        setMenusFromFlat,
        clearMenus,
        persist,
        initFromStorage,
        buildTreeFromFlat,
        // getters / helpers
        getFlat,
        getTree,
        findById,
        findByUrl,
        filterByPermissions,
        toRouteTree
    }
})
