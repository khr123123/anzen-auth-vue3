<template>
    <div class="log-page">
        <!-- Log Table -->
        <a-table :data="logList" :columns="columns" :pagination="false" row-key="operaId" :loading="loading" bordered>
            <!-- Custom Status Column -->
            <template #status="{ record }">
                <a-tag :color="record.status === 0 ? 'green' : 'red'" size="small">
                    {{ record.status === 0 ? 'Success' : 'Failed' }}
                </a-tag>
            </template>
        </a-table>
        <!-- Pagination -->
        <div class="pagination">
            <a-pagination :total="totalRow" :current="pageNumber" :page-size="pageSize" show-total show-page-size
                @change="handlePageChange" @page-size-change="handlePageSizeChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { logPage } from '@/api/sysOperaLogController';

// Table Columns
const columns = [
    { title: 'ID', dataIndex: 'operaId', width: 80 },
    { title: 'Title', dataIndex: 'title', ellipsis: true, tooltip: true, width: 120 },
    { title: 'Method', dataIndex: 'method', ellipsis: true, tooltip: true },
    { title: 'Request Method', dataIndex: 'requestMethod', width: 100 },
    { title: 'Operator', dataIndex: 'operaName', width: 100 },
    { title: 'URL', dataIndex: 'operaUrl', ellipsis: true, tooltip: true },
    { title: 'IP', dataIndex: 'operaIp', width: 80, ellipsis: true, tooltip: true },
    { title: 'Location', dataIndex: 'operaLocation', width: 90 },
    { title: 'Status', dataIndex: 'status', slotName: 'status', width: 100 },
    { title: 'Duration (ms)', dataIndex: 'costTime', width: 100 },
];

// State
const logList = ref<API.SysOperaLog[]>([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const totalRow = ref(0);
const loading = ref(false);

// Fetch Data
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

// Pagination Events
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
