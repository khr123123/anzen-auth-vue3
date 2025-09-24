<template>
    <div class="log-page">
        <!-- 日志表格 -->
        <a-table :data="logList" :columns="columns" :pagination="false" row-key="operaId" :loading="loading" bordered>
            <!-- 自定义状态列 -->
            <template #status="{ record }">
                <a-tag :color="record.status === 0 ? 'green' : 'red'" size="small">
                    {{ record.status === 0 ? '成功' : '失败' }}
                </a-tag>
            </template>
        </a-table>
        <!-- 分页 -->
        <div class="pagination">
            <a-pagination :total="totalRow" :current="pageNumber" :page-size="pageSize" show-total show-page-size
                @change="handlePageChange" @page-size-change="handlePageSizeChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { logPage } from '@/api/sysOperaLogController';

// 列定义
const columns = [
    { title: 'ID', dataIndex: 'operaId', width: 80 },
    { title: '标题', dataIndex: 'title', ellipsis: true, tooltip: true, width: 120 },
    { title: '方法', dataIndex: 'method', ellipsis: true, tooltip: true },
    { title: '请求方式', dataIndex: 'requestMethod', width: 100 },
    { title: '操作人', dataIndex: 'operaName', width: 100 },
    { title: 'URL', dataIndex: 'operaUrl', ellipsis: true, tooltip: true },
    { title: 'IP', dataIndex: 'operaIp', width: 80, ellipsis: true, tooltip: true },
    { title: '位置', dataIndex: 'operaLocation', width: 90 },
    { title: '状态', dataIndex: 'status', slotName: 'status', width: 100 },
    { title: '耗时(ms)', dataIndex: 'costTime', width: 100 },
];

// 状态
const logList = ref<API.SysOperaLog[]>([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const totalRow = ref(0);
const loading = ref(false);

// 请求数据
const fetchLogs = async () => {
    loading.value = true;
    try {
        const res = await logPage({
            pageNumber: pageNumber.value,
            pageSize: pageSize.value,
        });
        logList.value = res.data?.records || [];
        pageNumber.value = res.data?.pageNumber || 1;
        pageSize.value = res.data?.pageSize || 10;
        totalRow.value = res.data?.totalRow || 0;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchLogs();
});

// 分页切换
const handlePageChange = (page: number) => {
    pageNumber.value = page;
    fetchLogs();
};

const handlePageSizeChange = (size: number) => {
    pageSize.value = size;
    pageNumber.value = 1;
    fetchLogs();
};
</script>

<style scoped>
.log-page {
    border-radius: 8px;
}

.pagination {
    padding-top: 6px;
}
</style>
