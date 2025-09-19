<template>
    <div>
        <!-- 顶部操作栏 -->
        <div class="toolbar">
            <a-button type="primary" @click="openAddModal">
                <template #icon>
                    <icon-plus />
                </template>
                新增角色
            </a-button>
        </div>

        <!-- 角色表格 -->
        <a-table :data="roleList" row-key="roleId" :bordered="false">
            <template #columns>
                <a-table-column title="角色名称" data-index="roleName" />
                <a-table-column title="角色标识" data-index="roleKey" />
                <a-table-column title="状态">
                    <template #cell="{ record }">
                        <a-tag :type="record.status === '0' ? 'success' : 'danger'">
                            {{ record.status === '0' ? '正常' : '禁用' }}
                        </a-tag>
                    </template>
                </a-table-column>
                <a-table-column title="创建时间">
                    <template #cell="{ record }">
                        {{ new Date(record.createTime).toLocaleString() }}
                    </template>
                </a-table-column>
                <a-table-column title="操作" align="center" :width="320">
                    <template #cell="{ record }">
                        <a-space>
                            <!-- 编辑 -->
                            <a-button v-hasPermi="['sys:role:edit']" type="dashed" size="small"
                                @click="handleEdit(record)">
                                <template #icon>
                                    <icon-edit />
                                </template>
                                编辑
                            </a-button>

                            <!-- 删除 -->
                            <a-popconfirm content="确认删除该角色？" @ok="handleDelete(record)">
                                <a-button v-hasPermi="['sys:role:delete']" type="dashed" size="small" status="danger"
                                    :disabled="record.roleId === 1">
                                    <template #icon>
                                        <icon-delete />
                                    </template>
                                    删除
                                </a-button>
                            </a-popconfirm>

                            <!-- 分配权限 -->
                            <a-button v-hasPermi="['sys:role:perm']" type="dashed" size="small" status="warning"
                                @click="openPermModal(record)">
                                <template #icon>
                                    <icon-lock />
                                </template>
                                分配权限
                            </a-button>
                        </a-space>
                    </template>
                </a-table-column>
            </template>
        </a-table>

        <!-- 新增角色弹窗 -->
        <a-modal v-model:visible="addModalVisible" title="新增角色" @ok="handleAddOk" @cancel="handleAddCancel">
            <a-form :model="addForm" layout="vertical">
                <a-form-item field="roleName" label="角色名称" required>
                    <a-input v-model="addForm.roleName" placeholder="请输入角色名称" />
                </a-form-item>
                <a-form-item field="roleKey" label="角色标识" required>
                    <a-input v-model="addForm.roleKey" placeholder="请输入角色标识" />
                </a-form-item>
                <a-form-item field="status" label="状态" required>
                    <a-select v-model="addForm.status" placeholder="请选择状态">
                        <a-option value="0">正常</a-option>
                        <a-option value="1">禁用</a-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 分配权限弹窗 -->
        <a-modal v-model:visible="permModalVisible" :title="`分配权限 - ${currentRole?.roleName || ''}`"
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

// ================= 新增角色 =================
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

// ================= 分配权限 =================
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
        // 转为字符串，保证 key 一致
        checkedKeys.value = (res.data || []).map(String)

        const resTree = await listMenu2Tree()
        menuTree.value = convertBackendMenuToArco(resTree?.data || [])
        console.log('checkedKeys', checkedKeys.value)
        console.log('menuTree', menuTree.value)
    } finally {
        permLoading.value = false
    }
}


const convertBackendMenuToArco = (nodes: any[] = []): TreeNode[] =>
    nodes.map((n) => ({
        key: String(n.menuId),
        title: n.menuName,
        children: convertBackendMenuToArco(n.children || []),
        ...(n.perms ? { perms: n.perms } : {}),
    }))

const handlePermOk = async () => {
    console.log('保存角色权限', currentRole.value, checkedKeys.value)

    const res = await grantPermission({
        id: currentRole.value?.roleId,
        permissions: checkedKeys.value
    })
    console.log('保存角色权限结果', res)
    if (res.code == 0) {
        Message.success('保存角色权限成功!')
    } else {
        Message.error('保存角色权限失败!')
    }
    permModalVisible.value = false
}
const handlePermCancel = () => {
    permModalVisible.value = false
}

// ================= 其他操作 =================
const handleEdit = (record: API.SysRole) => {
    console.log('编辑角色', record)
}
const handleDelete = (record: API.SysRole) => {
    roleList.value = roleList.value.filter((r) => r.roleId !== record.roleId)
}

// ================= 初始化数据 =================
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
