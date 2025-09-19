<template>
    <a-table :data="roleList" row-key="roleId" :scroll="{ y: 400 }">
        <template #columns>
            <a-table-column title="角色名称" data-index="roleName"></a-table-column>
            <a-table-column title="角色标识" data-index="roleKey"></a-table-column>
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
            <a-table-column title="操作">
                <template #cell="{ record }">
                    <a-button type="text" @click="handleEdit(record)">编辑</a-button>
                </template>
            </a-table-column>
        </template>
    </a-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listRole } from '@/api/sysRoleController';
import type { SysRole } from '@/api/sysRoleController';

const roleList = ref<SysRole[]>([]);

const handleEdit = (record: SysRole) => {
    console.log('编辑角色', record);
};

onMounted(async () => {
    const res = await listRole();
    roleList.value = res.data || [];
});
</script>

<style scoped>
.my-tr:hover {
    background-color: #f5f5f5;
}
</style>
