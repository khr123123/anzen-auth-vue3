<template>
    <div class="app">
        <!-- Search bar + Add User button -->
        <div class="search-bar">
            <a-space>
                <a-input-search v-model="searchKeyword" placeholder="Enter username or nickname" allow-clear
                    @search="handleSearch" style="width: 300px" />
                <a-button type="primary" @click="openUserModal()">
                    <template #icon>
                        <icon-plus />
                    </template>
                    Add User
                </a-button>
            </a-space>
        </div>
        <!-- Table -->
        <a-table :data="filteredUsers" row-key="userId" :scroll="{ y: 400 }">
            <template #columns>
                <a-table-column title="Username" data-index="username"  width="90"/>
                <a-table-column title="Nickname" data-index="nickname"  width="100"/>
                <a-table-column title="Avatar" width="60">
                    <template #cell="{ record }">
                        <img :src="record.avatar" alt="avatar" style="width:32px;height:32px;border-radius:50%" />
                    </template>
                </a-table-column>
                <a-table-column title="Email" data-index="email"  width="120"/>
                <a-table-column title="Status" width="60">
                    <template #cell="{ record }">
                        <a-tag :color="record.status === '0' ? 'green' : 'red'">
                            {{ record.status === '0' ? 'Active' : 'Disabled' }}
                        </a-tag>
                    </template>
                </a-table-column>
                <a-table-column title="Created At"  width="140">
                    <template #cell="{ record }">
                        {{ new Date(record.createTime).toLocaleString() }}
                    </template>
                </a-table-column>
                <a-table-column title="Actions" :width="310">
                    <template #cell="{ record }">
                        <a-space>
                            <a-button type="primary" size="small" :disabled="record.userId === 1"
                                @click="openUserModal(record)">
                                <template #icon>
                                    <icon-edit />
                                </template>
                                Edit
                            </a-button>
                            <a-button v-hasPermi="['sys:user:role']" type="dashed" size="small"
                                :disabled="record.userId === 1" @click="handleGrantRole(record)">
                                <template #icon>
                                    <icon-user-group />
                                </template>
                                Assign Role
                            </a-button>
                            <a-button type="outline" size="small" status="danger" :disabled="record.userId === 1"
                                @click="handleDelete(record)">
                                <template #icon>
                                    <icon-delete />
                                </template>
                                Del
                            </a-button>
                        </a-space>
                    </template>
                </a-table-column>
            </template>
        </a-table>

        <!-- Assign Role Modal -->
        <a-modal v-model:visible="grantRoleVisible" width="300px" title="Assign Role" @ok="submitGrantRole"
            :ok-loading="grantRoleLoading">
            <a-spin :loading="roleLoading">
                <a-checkbox-group v-model="selectedRoleIds" direction="vertical" style="width: 100%">
                    <a-checkbox v-for="role in allRoles" :key="role.roleId" :value="role.roleId">
                        {{ role.roleName }} ({{ role.roleKey }})
                    </a-checkbox>
                </a-checkbox-group>
            </a-spin>
        </a-modal>

        <!-- Add / Edit User Modal -->
        <a-modal v-model:visible="userModalVisible" :title="userModalTitle" @ok="submitUser"
            :ok-loading="userModalLoading">
            <a-form :model="userForm" layout="vertical">
                <a-form-item label="Username" field="username" required>
                    <a-input v-model="userForm.username" placeholder="Enter username" />
                </a-form-item>
                <a-form-item label="Nickname" field="nickname">
                    <a-input v-model="userForm.nickname" placeholder="Enter nickname" />
                </a-form-item>
                <a-form-item label="Email" field="email">
                    <a-input v-model="userForm.email" placeholder="Enter email" />
                </a-form-item>
                <a-form-item label="Status" field="status">
                    <a-select v-model="userForm.status">
                        <a-option value="0">Active</a-option>
                        <a-option value="1">Disabled</a-option>
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

// Filtered users
const filteredUsers = computed(() => {
    if (!searchKeyword.value) return userList.value;
    return userList.value.filter(
        (u) =>
            u.username.includes(searchKeyword.value) ||
            u.nickname.includes(searchKeyword.value)
    );
});

// Delete
const handleDelete = (record: API.SysUser) => {
    Modal.confirm({
        title: 'Confirm Delete',
        content: `Are you sure you want to delete user 【${record.username}】?`,
        okText: 'Delete',
        cancelText: 'Cancel',
        onOk: async () => {
            // TODO: call backend delete API
            Message.success(`User deleted: ${record.username}`);
            userList.value = userList.value.filter((u) => u.userId !== record.userId);
        },
    });
};

// ================== Assign Role ==================
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
        Message.error('Failed to load roles');
    } finally {
        roleLoading.value = false;
    }
};

const submitGrantRole = async () => {
    if (!currentUserId.value) return;
    grantRoleLoading.value = true;
    try {
        await grantRole({ id: currentUserId.value, roles: selectedRoleIds.value });
        Message.success('Roles assigned successfully');
        grantRoleVisible.value = false;
    } catch (e) {
        Message.error('Failed to assign roles');
    } finally {
        grantRoleLoading.value = false;
    }
};

// ================== Add / Edit User ==================
const userModalVisible = ref(false);
const userModalTitle = ref('Add User');
const userModalLoading = ref(false);
const userForm = ref<Partial<API.SysUser>>({});

const openUserModal = (record?: API.SysUser) => {
    if (record) {
        userModalTitle.value = 'Edit User';
        userForm.value = { ...record };
    } else {
        userModalTitle.value = 'Add User';
        userForm.value = { username: '', nickname: '', email: '', status: '0' };
    }
    userModalVisible.value = true;
};

const submitUser = async () => {
    userModalLoading.value = true;
    try {
        if (userForm.value.userId) {
            // TODO: call backend update API
            Message.success('User updated successfully');
            const index = userList.value.findIndex(u => u.userId === userForm.value.userId);
            if (index !== -1) userList.value[index] = { ...userForm.value } as API.SysUser;
        } else {
            // TODO: call backend add API
            Message.success('User added successfully');
            userList.value.push({ ...(userForm.value as API.SysUser), userId: Date.now() });
        }
        userModalVisible.value = false;
    } catch (e) {
        Message.error('Operation failed');
    } finally {
        userModalLoading.value = false;
    }
};

// Search
const handleSearch = () => {
    console.log('Search keyword:', searchKeyword.value);
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
