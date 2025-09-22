<template>
    <div class="app">
        <!-- 搜索栏 + 添加用户按钮 -->
        <div class="search-bar">
            <a-space>
                <a-input-search v-model="searchKeyword" placeholder="请输入用户名或昵称" allow-clear @search="handleSearch"
                    style="width: 300px" />
                <a-button type="primary" @click="openUserModal()">
                    <template #icon>
                        <icon-plus />
                    </template>
                    添加用户</a-button>
            </a-space>
        </div>
        <!-- 表格 -->
        <a-table :data="filteredUsers" row-key="userId" :scroll="{ y: 400 }">
            <template #columns>
                <a-table-column title="用户名" data-index="username" />
                <a-table-column title="昵称" data-index="nickname" />
                <a-table-column title="头像">
                    <template #cell="{ record }">
                        <img :src="record.avatar" alt="avatar" style="width:32px;height:32px;border-radius:50%" />
                    </template>
                </a-table-column>
                <a-table-column title="邮箱" data-index="email" />
                <a-table-column title="状态">
                    <template #cell="{ record }">
                        <a-tag :color="record.status === '0' ? 'green' : 'red'">
                            {{ record.status === '0' ? '正常' : '禁用' }}
                        </a-tag>
                    </template>
                </a-table-column>
                <a-table-column title="创建时间">
                    <template #cell="{ record }">
                        {{ new Date(record.createTime).toLocaleString() }}
                    </template>
                </a-table-column>
                <a-table-column title="操作" :width="310">
                    <template #cell="{ record }">
                        <a-space>
                            <a-button type="primary" size="small" :disabled="record.userId === 1"
                                @click="openUserModal(record)">
                                <template #icon>
                                    <icon-edit />
                                </template>
                                编辑
                            </a-button>
                            <a-button v-hasPermi="['sys:user:role']" type="dashed" size="small"
                                :disabled="record.userId === 1" @click="handleGrantRole(record)">
                                <template #icon>
                                    <icon-user-group />
                                </template>
                                分配角色
                            </a-button>
                            <a-button type="outline" size="small" status="danger" :disabled="record.userId === 1"
                                @click="handleDelete(record)">
                                <template #icon>
                                    <icon-delete />
                                </template>
                                删除
                            </a-button>
                        </a-space>
                    </template>
                </a-table-column>
            </template>
        </a-table>

        <!-- 分配角色对话框 -->
        <a-modal v-model:visible="grantRoleVisible" width="300px" title="分配角色" @ok="submitGrantRole"
            :ok-loading="grantRoleLoading">
            <a-spin :loading="roleLoading">
                <a-checkbox-group v-model="selectedRoleIds" direction="vertical" style="width: 100%">
                    <a-checkbox v-for="role in allRoles" :key="role.roleId" :value="role.roleId">
                        {{ role.roleName }}（{{ role.roleKey }}）
                    </a-checkbox>
                </a-checkbox-group>
            </a-spin>
        </a-modal>

        <!-- 新增 / 编辑用户对话框 -->
        <a-modal v-model:visible="userModalVisible" :title="userModalTitle" @ok="submitUser"
            :ok-loading="userModalLoading">
            <a-form :model="userForm" layout="vertical">
                <a-form-item label="用户名" field="username" required>
                    <a-input v-model="userForm.username" placeholder="请输入用户名" />
                </a-form-item>
                <a-form-item label="昵称" field="nickname">
                    <a-input v-model="userForm.nickname" placeholder="请输入昵称" />
                </a-form-item>
                <a-form-item label="邮箱" field="email">
                    <a-input v-model="userForm.email" placeholder="请输入邮箱" />
                </a-form-item>
                <a-form-item label="状态" field="status">
                    <a-select v-model="userForm.status">
                        <a-option value="0">正常</a-option>
                        <a-option value="1">禁用</a-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { listUser, grantRole, getUserRoles } from '@/api/sysUserController';
import { listRole } from '@/api/sysRoleController';
import { Modal, Message } from '@arco-design/web-vue';

const userList = ref<API.SysUser[]>([]);
const searchKeyword = ref('');

// 过滤后的用户列表
const filteredUsers = computed(() => {
    if (!searchKeyword.value) return userList.value;
    return userList.value.filter(
        (u) =>
            u.username.includes(searchKeyword.value) ||
            u.nickname.includes(searchKeyword.value)
    );
});

// 删除
const handleDelete = (record: API.SysUser) => {
    Modal.confirm({
        title: '确认删除',
        content: `确定要删除用户【${record.username}】吗？`,
        okText: '删除',
        cancelText: '取消',
        onOk: async () => {
            // TODO: 调用后端删除接口
            Message.success(`已删除用户：${record.username}`);
            userList.value = userList.value.filter((u) => u.userId !== record.userId);
        },
    });
};

// ================== 分配角色 ==================
const grantRoleVisible = ref(false);
const grantRoleLoading = ref(false);
const roleLoading = ref(false);
const allRoles = ref<API.SysRole[]>([]);
const selectedRoleIds = ref<number[]>([]);
const currentUserId = ref<number | null>(null);

const handleGrantRole = async (record: API.SysUser) => {
    currentUserId.value = record.userId;
    grantRoleVisible.value = true;
    roleLoading.value = true;

    try {
        const roleRes = await listRole();
        allRoles.value = roleRes.data || [];

        const userRoleRes = await getUserRoles({ id: record.userId });
        selectedRoleIds.value = userRoleRes.data || [];
    } catch (e) {
        Message.error('加载角色失败');
    } finally {
        roleLoading.value = false;
    }
};

const submitGrantRole = async () => {
    if (!currentUserId.value) return;
    grantRoleLoading.value = true;
    try {
        await grantRole({ id: currentUserId.value, roles: selectedRoleIds.value });
        Message.success('角色分配成功');
        grantRoleVisible.value = false;
    } catch (e) {
        Message.error('角色分配失败');
    } finally {
        grantRoleLoading.value = false;
    }
};

// ================== 新增 / 编辑用户 ==================
const userModalVisible = ref(false);
const userModalTitle = ref('新增用户');
const userModalLoading = ref(false);
const userForm = ref<Partial<API.SysUser>>({});

const openUserModal = (record?: API.SysUser) => {
    if (record) {
        userModalTitle.value = '编辑用户';
        userForm.value = { ...record };
    } else {
        userModalTitle.value = '新增用户';
        userForm.value = { username: '', nickname: '', email: '', status: '0' };
    }
    userModalVisible.value = true;
};

const submitUser = async () => {
    userModalLoading.value = true;
    try {
        if (userForm.value.userId) {
            // TODO: 调用后端更新接口
            Message.success('用户更新成功');
            const index = userList.value.findIndex(u => u.userId === userForm.value.userId);
            if (index !== -1) userList.value[index] = { ...userForm.value } as API.SysUser;
        } else {
            // TODO: 调用后端新增接口
            Message.success('用户新增成功');
            userList.value.push({ ...(userForm.value as API.SysUser), userId: Date.now() });
        }
        userModalVisible.value = false;
    } catch (e) {
        Message.error('操作失败');
    } finally {
        userModalLoading.value = false;
    }
};

// 搜索
const handleSearch = () => {
    console.log('搜索关键字：', searchKeyword.value);
};

onMounted(async () => {
    const res = await listUser();
    userList.value = res.data || [];
});
</script>

<style scoped>
.user-page {
    padding: 16px;
}

.search-bar {
    margin-bottom: 16px;
}
</style>
