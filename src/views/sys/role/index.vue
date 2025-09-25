<template>
    <div class="app">
        <!-- Top Toolbar -->
        <div class="toolbar">
            <a-button type="primary" @click="openAddModal">
                <template #icon>
                    <icon-plus />
                </template>
                Add Role
            </a-button>
        </div>

        <!-- Role Table -->
        <a-table :data="roleList" row-key="roleId" :bordered="false">
            <template #columns>
                <a-table-column title="Role Name" data-index="roleName" />
                <a-table-column title="Role Key" data-index="roleKey" />
                <a-table-column title="Status">
                    <template #cell="{ record }">
                        <a-tag :type="record.status === '0' ? 'success' : 'danger'">
                            {{ record.status === '0' ? 'Active' : 'Disabled' }}
                        </a-tag>
                    </template>
                </a-table-column>
                <a-table-column title="Created At">
                    <template #cell="{ record }">
                        {{ new Date(record.createTime).toLocaleString() }}
                    </template>
                </a-table-column>
                <a-table-column title="Actions" align="center" :width="320">
                    <template #cell="{ record }">
                        <a-space>
                            <!-- Edit -->
                            <a-button v-hasPermi="['sys:role:edit']" type="dashed" size="small"
                                @click="handleEdit(record)">
                                <template #icon>
                                    <icon-edit />
                                </template>
                                Edit
                            </a-button>

                            <!-- Delete -->
                            <a-popconfirm content="Are you sure you want to delete this role?"
                                @ok="handleDelete(record)">
                                <a-button v-hasPermi="['sys:role:delete']" type="dashed" size="small" status="danger"
                                    :disabled="record.roleId === 1">
                                    <template #icon>
                                        <icon-delete />
                                    </template>
                                    Delete
                                </a-button>
                            </a-popconfirm>

                            <!-- Assign Permissions -->
                            <a-button v-hasPermi="['sys:role:perm']" type="dashed" size="small" status="warning"
                                @click="openPermModal(record)">
                                <template #icon>
                                    <icon-lock />
                                </template>
                                Assign Permissions
                            </a-button>
                        </a-space>
                    </template>
                </a-table-column>
            </template>
        </a-table>

        <!-- Add Role Modal -->
        <a-modal v-model:visible="addModalVisible" title="Add Role" @ok="handleAddOk" @cancel="handleAddCancel">
            <a-form :model="addForm" layout="vertical">
                <a-form-item field="roleName" label="Role Name" required>
                    <a-input v-model="addForm.roleName" placeholder="Enter role name" />
                </a-form-item>
                <a-form-item field="roleKey" label="Role Key" required>
                    <a-input v-model="addForm.roleKey" placeholder="Enter role key" />
                </a-form-item>
                <a-form-item field="status" label="Status" required>
                    <a-select v-model="addForm.status" placeholder="Select status">
                        <a-option value="0">Active</a-option>
                        <a-option value="1">Disabled</a-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- Assign Permissions Modal -->
        <a-modal v-model:visible="permModalVisible" :title="`Assign Permissions - ${currentRole?.roleName || ''}`"
            :confirm-loading="permLoading" @ok="handlePermOk" @cancel="handlePermCancel" width="420px">
            <a-tree v-if="!permLoading" :data="menuTree" checkable v-model:checked-keys="checkedKeys"
                :field-names="{ key: 'key', title: 'title', children: 'children' }" :default-expand-all="true"
                :check-strictly="true" />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { listRole, getRolePermission, grantPermission } from '@/api/sysRoleController'
import { listMenu2Tree } from '@/api/sysMenuController'
import { Message } from '@arco-design/web-vue'

const roleList = ref<API.SysRole[]>([])

// ================= Add Role =================
const addModalVisible = ref(false)
const addForm = reactive<API.SysRole>({
    roleId: 0,
    roleName: '',
    roleKey: '',
    status: '0',
    createTime: new Date().toISOString(),
})

const openAddModal = () => {
    addModalVisible.value = true
}

const handleAddOk = () => {
    roleList.value.push({ ...addForm, roleId: Date.now() })
    addModalVisible.value = false
    resetAddForm()
}

const handleAddCancel = () => {
    addModalVisible.value = false
    resetAddForm()
}

const resetAddForm = () => {
    addForm.roleId = 0
    addForm.roleName = ''
    addForm.roleKey = ''
    addForm.status = '0'
    addForm.createTime = new Date().toISOString()
}

// ================= Assign Permissions =================
const permModalVisible = ref(false)
const permLoading = ref(false)
const currentRole = ref<API.SysRole | null>(null)

interface TreeNode {
    key: string | number
    title: string
    children?: TreeNode[]
    perms?: string
}

const menuTree = ref<TreeNode[]>([])
const checkedKeys = ref<(string | number)[]>([])

const openPermModal = async (record: API.SysRole) => {
    currentRole.value = record
    permModalVisible.value = true
    permLoading.value = true
    try {
        const res = await getRolePermission({ id: record.roleId })
        // Convert to string for consistency
        checkedKeys.value = (res.data || []).map(String)

        const resTree = await listMenu2Tree()
        menuTree.value = convertBackendMenuToArco(resTree?.data || [])
    } finally {
        permLoading.value = false
    }
}

const convertBackendMenuToArco = (nodes: any[] = []): TreeNode[] =>
    nodes.map((n) => ({
        key: String(n.menuId),
        title: `${n.menuName} (${n.menuType == "M" ? 'Directory' : n.menuType == "C" ? 'Menu' : 'Button'})`,
        children: convertBackendMenuToArco(n.children || []),
        ...(n.perms ? { perms: n.perms } : {}),
    }))

const handlePermOk = async () => {
    const res = await grantPermission({
        id: currentRole.value?.roleId,
        permissions: checkedKeys.value
    })
    if (res.code == 0) {
        Message.success('Role permissions saved successfully!')
    } else {
        Message.error('Failed to save role permissions!')
    }
    permModalVisible.value = false
}
const handlePermCancel = () => {
    permModalVisible.value = false
}

// ================= Other Operations =================
const handleEdit = (record: API.SysRole) => {
    console.log('Edit role', record)
}
const handleDelete = (record: API.SysRole) => {
    roleList.value = roleList.value.filter((r) => r.roleId !== record.roleId)
}

// ================= Init Data =================
onMounted(async () => {
    const res = await listRole()
    roleList.value = res.data || []
})
</script>

<style scoped>
.toolbar {
    margin-bottom: 16px;
    text-align: right;
}
</style>
