<template>
    <div class="app">
        <div class="toolbar">
            <a-button type="primary" v-hasPermi="['sys:menu:add']" @click="addModalVisible = true">
                <template #icon> <icon-plus /></template>新增菜单</a-button>
        </div>
        <a-table :data="menuList" row-key="menuId" :scroll="{ y: 350 }" v-model:expandedKeys="expandedKeys"
            show-empty-tree>
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
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="父级菜单" required>
                            <a-tree-select v-model="addForm.parentId" :data="selectMenu"
                                :field-names="{ key: 'menuId', title: 'menuName', children: 'children' }"
                                placeholder="请选择父级菜单" style="width: 100%" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="排序">
                            <a-input-number v-model="addForm.orderNum" placeholder="请输入排序" :min="1" :max="10"
                                style="width: 100%" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="菜单名称" required>
                            <a-input v-model="addForm.menuName" placeholder="请输入菜单名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="权限标识" required>
                            <a-input v-model="addForm.perms" placeholder="请输入权限标识" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="路径" required>
                            <a-input v-model="addForm.url" placeholder="请输入路径" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="类型" required>
                            <a-select v-model="addForm.menuType" placeholder="请选择类型">
                                <a-option value="M">目录</a-option>
                                <a-option value="C">菜单</a-option>
                                <a-option value="F">按钮</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="图标">
                            <a-input v-model="addForm.icon" placeholder="请输入图标名称" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import * as ArcoIcons from '@arco-design/web-vue/es/icon';
import { getUserMenuTreeWithButton, saveMenu } from '@/api/sysMenuController';
import { Message } from '@arco-design/web-vue';

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

// ================= 新增菜单 =================
const addModalVisible = ref<boolean>(false);
const addForm = reactive<any>({});
function filterMenuData(data: MenuItem[]): MenuItem[] {
    return data.map(item => {
        const newItem: MenuItem = {
            menuId: item.menuId,
            menuName: item.menuName,
            children: item.children ? filterMenuData(item.children) : []
        }
        return newItem
    })
}

// 用在 computed 里
const selectMenu = computed(() => {
    return filterMenuData(menuList.value) // 假设 menuList 是 ref
})

// 新增菜单确定
const handleAddOk = () => {
    console.log(addForm);
    saveMenu(addForm).then(() => {
        addModalVisible.value = false;
        // 刷新表格数据
        fetchMenuList();
        Message.success('新增菜单成功');
    }).catch((error) => {
        Message.error('新增菜单失败!', error.message);
    })
};

const handleAddCancel = () => {
    addModalVisible.value = false;
};

// ================= 表格操作 ================
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
});
</script>

<style scoped>
.toolbar {
    margin-bottom: 16px;
    text-align: right;
}
</style>
