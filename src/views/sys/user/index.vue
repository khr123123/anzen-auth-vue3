<template>
    <a-table :data="userList" row-key="userId" :scroll="{ y: 400 }">
        <template #columns>
            <a-table-column title="用户名" data-index="username"></a-table-column>
            <a-table-column title="昵称" data-index="nickname"></a-table-column>
            <a-table-column title="头像">
                <template #cell="{ record }">
                    <img :src="record.avatar" alt="avatar" style="width:32px;height:32px;border-radius:50%" />
                </template>
            </a-table-column>
            <a-table-column title="邮箱" data-index="email"></a-table-column>
            <a-table-column title="状态">
                <template #cell="{ record }">
                    <span>{{ record.status === '0' ? '正常' : '禁用' }}</span>
                </template>
            </a-table-column>
            <a-table-column title="创建时间">
                <template #cell="{ record }">
                    {{ new Date(record.createTime).toLocaleString() }}
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
import { listUser } from '@/api/sysUserController';

const userList = ref<API.SysUser[]>([]);

const handleEdit = (record: API.SysUser) => {
    console.log('编辑用户', record);
};

onMounted(async () => {
    const res = await listUser();
    userList.value = res.data || [];
});
</script>

<style scoped>
.my-tr:hover {
    background-color: #f5f5f5;
}
</style>
