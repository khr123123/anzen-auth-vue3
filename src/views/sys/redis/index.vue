<template>
    <div class="redis-dashboard">
        <a-card title="Redis 基础信息" bordered>
            <a-row :gutter="16">
                <a-col :span="8" v-for="(value, key) in infoDisplay" :key="key">
                    <div class="info-item">
                        <div class="label">{{ key }}</div>
                        <div class="value">{{ value }}</div>
                    </div>
                </a-col>
            </a-row>
        </a-card>

        <a-card title="Redis 命令统计" bordered class="command-card">
            <a-table :columns="commandColumns" :data="commandStats" :pagination="false" row-key="name" />
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
interface CommandStat {
    name: string;
    value: string;
}

interface RedisInfo {
    tcp_port: string;
    uptime_in_seconds: string;
    connected_clients: string;
    used_memory_human: string;
    redis_version: string;
    total_commands_processed: string;
}

const redisData = ref({
    commandStats: [] as CommandStat[],
    info: {} as RedisInfo,
});

// 用于展示的基础信息字段
const infoDisplay = ref<Record<string, string>>({});

const commandStats = ref<CommandStat[]>([]);

const commandColumns = [
    { title: '命令', dataIndex: 'name', key: 'name' },
    { title: '次数', dataIndex: 'value', key: 'value' },
];

// 模拟异步请求，实际可以替换为 API 调用
onMounted(() => {
    const data = {
        commandStats: [
            { name: 'set', value: '6' },
            { name: 'get', value: '58' },
            { name: 'ping', value: '15' },
            { name: 'scan', value: '1' },
            { name: 'info', value: '12' },
            { name: 'dbsize', value: '2' },
            { name: 'client', value: '30' },
        ],
        info: {
            tcp_port: '6379',
            uptime_in_seconds: '5592',
            connected_clients: '1',
            used_memory_human: '696.46K',
            redis_version: '3.0.504',
            total_commands_processed: '123',
        },
    };

    redisData.value = data;
    commandStats.value = data.commandStats;

    // 只选展示有用的信息
    infoDisplay.value = {
        '端口': data.info.tcp_port,
        '运行时间(秒)': data.info.uptime_in_seconds,
        '连接客户端': data.info.connected_clients,
        '内存使用': data.info.used_memory_human,
        'Redis 版本': data.info.redis_version,
        '总命令数': data.info.total_commands_processed,
    };
});
</script>

<style scoped>
.redis-dashboard {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
}

.info-item {
    background: #f7f8fa;
    border-radius: 6px;
    padding: 12px;
    text-align: center;
    margin-bottom: 12px;
}

.info-item .label {
    font-size: 12px;
    color: #888;
}

.info-item .value {
    font-size: 16px;
    font-weight: bold;
    margin-top: 4px;
}

.command-card {
    margin-top: 24px;
}
</style>
