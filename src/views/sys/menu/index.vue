<template>
    <div>
        <!-- 顶部操作栏 -->
        <div class="toolbar">
            <a-button type="primary" @click="openAddModal">新增菜单</a-button>
        </div>

        <!-- 菜单表格 -->
        <a-table :data="menuList" row-key="menuId" :scroll="{ y: 400 }" v-model:expandedKeys="expandedKeys"
            :row-selection="rowSelection" show-empty-tree>
            <template #columns>
                <a-table-column title="菜单名称" data-index="menuName"></a-table-column>
                <a-table-column title="权限标识" data-index="perms"></a-table-column>
                <a-table-column title="路径" data-index="url"></a-table-column>
                <a-table-column title="类型">
                    <template #cell="{ record }">
                        <a-tag
                            :color="record.menuType === 'M' ? '#2db7f5' : record.menuType === 'C' ? '#87d068' : '#f50'">
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

        <!-- 新增菜单弹窗 -->
        <a-modal v-model:visible="addModalVisible" title="新增菜单" @ok="handleAddOk" @cancel="handleAddCancel">
            <a-form :model="addForm" layout="vertical">
                <a-form-item label="父级菜单">
                    <a-tree-select v-model="addForm.parentId" :tree-data="treeSelectData" placeholder="请选择父级菜单"
                        allow-clear :field-names="{ key: 'key', title: 'title', children: 'children' }"
                        :default-expand-all="true" :check-strictly="true" />
                </a-form-item>

                <a-form-item label="菜单名称" required>
                    <a-input v-model="addForm.menuName" placeholder="请输入菜单名称" />
                </a-form-item>

                <a-form-item label="权限标识" required>
                    <a-input v-model="addForm.perms" placeholder="请输入权限标识" />
                </a-form-item>

                <a-form-item label="路径">
                    <a-input v-model="addForm.url" placeholder="请输入路径" />
                </a-form-item>

                <a-form-item label="类型" required>
                    <a-select v-model="addForm.menuType" placeholder="请选择类型">
                        <a-option value="M">目录</a-option>
                        <a-option value="C">菜单</a-option>
                        <a-option value="F">按钮</a-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="图标">
                    <a-input v-model="addForm.icon" placeholder="请输入图标名称" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import * as ArcoIcons from '@arco-design/web-vue/es/icon';
import { getUserMenuTreeWithButton } from '@/api/sysMenuController';

interface SysMenu {
    menuId: number;
    parentId: number;
    menuName: string;
    perms: string;
    url: string;
    menuType: 'M' | 'C' | 'F';
    icon?: string;
    children?: SysMenu[];
}

const menuList = ref<SysMenu[]>([]);
const expandedKeys = ref<number[]>([]);
const rowSelection = ref({ checkStrictly: false });

// ================= 新增菜单 =================
const addModalVisible = ref(false);
const addForm = reactive<Partial<SysMenu>>({
    parentId: 0,
    menuName: '',
    perms: '',
    url: '',
    menuType: 'C',
    icon: ''
});

const openAddModal = () => {
    addModalVisible.value = true;
};

// 转换菜单为 Arco TreeSelect 需要的格式
const treeSelectData = computed(() => {
    const convert = (nodes: SysMenu[]): any[] =>
        nodes
            .filter(n => n.menuType !== 'F')
            .map(n => ({
                key: n.menuId, // TreeSelect 需要 key
                title: `${n.menuName} (${n.menuType === 'M' ? '目录' : n.menuType === 'C' ? '菜单' : '按钮'})`,
                children: n.children ? convert(n.children) : undefined
            }));

    return [
        {
            key: 0,
            title: '主类目',
            children: convert(menuList.value)
        }
    ];
});

// 新增菜单确定
const handleAddOk = () => {
    const newMenu: SysMenu = {
        menuId: Date.now(),
        parentId: addForm.parentId || 0,
        menuName: addForm.menuName || '',
        perms: addForm.perms || '',
        url: addForm.url || '',
        menuType: addForm.menuType || 'C',
        icon: addForm.icon || '',
        children: []
    };

    if (newMenu.parentId && newMenu.parentId !== 0) {
        const parent = findMenu(menuList.value, newMenu.parentId);
        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(newMenu);
            expandedKeys.value.push(parent.menuId);
        }
    } else {
        menuList.value.push(newMenu);
    }

    expandedKeys.value.push(newMenu.menuId);
    addModalVisible.value = false;
    resetAddForm();
};

const handleAddCancel = () => {
    addModalVisible.value = false;
    resetAddForm();
};

const resetAddForm = () => {
    addForm.parentId = 0;
    addForm.menuName = '';
    addForm.perms = '';
    addForm.url = '';
    addForm.menuType = 'C';
    addForm.icon = '';
};

// 递归查找菜单
const findMenu = (menus: SysMenu[], id: number): SysMenu | null => {
    for (const menu of menus) {
        if (menu.menuId === id) return menu;
        if (menu.children) {
            const res = findMenu(menu.children, id);
            if (res) return res;
        }
    }
    return null;
};

// ================= 表格操作 =================
const handleEdit = (record: SysMenu) => {
    console.log('编辑菜单', record);
};

// 获取图标组件
const getIconComponent = (name: string) => {
    if (!name) return undefined;
    return (ArcoIcons as Record<string, any>)['Icon' + name] || undefined;
};

// 递归获取可展开节点
const getExpandableKeys = (menus: SysMenu[]): number[] => {
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

// 处理菜单树
const processMenuTree = (menus: SysMenu[]): SysMenu[] => {
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

onMounted(() => {
    fetchMenuList()
    console.log(treeSelectData.value);

});
</script>

<style scoped>
.toolbar {
    margin-bottom: 16px;
    text-align: right;
}
</style>
