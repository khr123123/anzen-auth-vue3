<template>
    <a-table :data="menuList" row-key="menuId" :scroll="{ y: 400 }" v-model:expandedKeys="expandedKeys"
        :row-selection="rowSelection" show-empty-tree>
        <template #columns>
            <a-table-column title="菜单名称" data-index="menuName"></a-table-column>
            <a-table-column title="权限标识" data-index="perms"></a-table-column>
            <a-table-column title="路径" data-index="url"></a-table-column>
            <a-table-column title="类型">
                <template #cell="{ record }">
                    <a-tag :color="record.menuType === 'M' ? '#2db7f5' : record.menuType === 'C' ? '#87d068' : '#f50'">
                        {{ record.menuType === 'M' ? '目录' : record.menuType === 'C' ? '菜单' : '按钮' }}
                    </a-tag>
                </template>
            </a-table-column>
            <a-table-column title="图标">
                <template #cell="{ record }">
                    <component v-if="record.icon" :is="getIconComponent(record.icon)" style="font-size: 18px;" />
                </template>
            </a-table-column>
            <a-table-column title="操作">
                <template #cell="{ record }">
                    <a-button @click="handleEdit(record)">编辑</a-button>
                </template>
            </a-table-column>
        </template>
    </a-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as ArcoIcons from '@arco-design/web-vue/es/icon';
import { getUserMenuTreeWithButton } from '@/api/sysMenuController';

const menuList = ref<API.SysMenu[]>([]);
const expandedKeys = ref<number[]>([]);
const rowSelection = ref({ checkStrictly: false });

// 编辑操作
const handleEdit = (record: API.SysMenu) => {
    console.log('编辑菜单', record);
};

// 获取图标组件
const getIconComponent = (name: string) => {
    if (!name) return undefined;
    return (ArcoIcons as Record<string, any>)['Icon' + name] || undefined;
};

// 递归获取所有可展开节点（排除按钮类型 F）
const getExpandableKeys = (menus: API.SysMenu[]): number[] => {
    let keys: number[] = [];
    menus.forEach(menu => {
        if (menu.menuType !== 'F') {
            keys.push(menu.menuId);
            if (menu.children && menu.children.length > 0) {
                keys = keys.concat(getExpandableKeys(menu.children));
            }
        }
    });
    return keys;
};

// 处理菜单树，按钮类型 F 不显示展开按钮
const processMenuTree = (menus: API.SysMenu[]): API.SysMenu[] => {
    return menus.map(menu => {
        if (menu.menuType === 'F') {
            return { ...menu, children: undefined };
        }
        return {
            ...menu,
            children: menu.children ? processMenuTree(menu.children) : undefined
        };
    });
};

// 获取菜单数据
const fetchMenuList = async () => {
    try {
        const res = await getUserMenuTreeWithButton();
        menuList.value = processMenuTree(res.data || []);
        expandedKeys.value = getExpandableKeys(menuList.value);
    } catch (error) {
        console.error('获取菜单失败', error);
    }
};

onMounted(fetchMenuList);
</script>
