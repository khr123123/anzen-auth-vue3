<template>
    <div class="app">
        <!-- 顶部欢迎区 -->
        <a-card class="welcome-card">
            <a-row justify="space-between">
                <a-col>
                    <h2 class="welcome-title">欢迎回来，管理员 👋</h2>
                    <p class="welcome-subtitle">今天也要元气满满地工作哦！</p>
                </a-col>
                <a-col>
                    <a-avatar :size="64" shape="circle" style="background:#165dff">KK</a-avatar>
                </a-col>
            </a-row>
        </a-card>

        <!-- 统计卡片 -->
        <a-row :gutter="16" style="margin-top: 16px">
            <a-col :span="6">
                <a-card hoverable>
                    <template #title>
                        <icon-user /> 用户总数
                    </template>
                    <a-statistic title="" :value="1280" show-group-separator />
                </a-card>
            </a-col>

            <a-col :span="6">
                <a-card hoverable>
                    <template #title>
                        <icon-bar-chart /> 今日访问
                    </template>
                    <a-statistic title="" :value="856" show-group-separator>
                        <template #suffix>
                            <icon-arrow-rise style="color:#0fbf60" />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :span="6">
                <a-card hoverable>
                    <template #title>
                        <icon-check /> 订单数
                    </template>
                    <a-statistic title="" :value="320" show-group-separator>
                        <template #suffix>
                            <icon-arrow-rise style="color:#165dff" />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :span="6">
                <a-card hoverable>
                    <template #title>
                        <icon-check-circle /> 系统任务
                    </template>
                    <a-statistic title="" :value="95" :precision="0" :value-style="{ color: '#0fbf60' }">
                        <template #suffix>%</template>
                    </a-statistic>
                </a-card>
            </a-col>
        </a-row>

        <!-- 图表 + 快捷入口 -->
        <a-row :gutter="16" style="margin-top: 16px">
            <!-- 图表区 -->
            <a-col :span="16">
                <a-card title="访问趋势">
                    <div ref="chartRef" style="height:300px; width:100%;" />
                </a-card>
            </a-col>

            <!-- 快捷入口 -->
            <a-col :span="8">
                <a-card title="快捷入口">
                    <a-space direction="vertical" style="width: 100%">
                        <a-button type="primary" long>新增用户</a-button>
                        <a-button type="outline" long>系统设置</a-button>
                        <a-button type="dashed" long>查看日志</a-button>
                    </a-space>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'


const chartRef = ref<HTMLDivElement>()

onMounted(() => {
    if (chartRef.value) {
        const chart = echarts.init(chartRef.value)
        chart.setOption({
            tooltip: {},
            grid: {
                top: 30,
                bottom: 30,
                left: '8%',
                right: '8%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: { type: 'value' },
            series: [
                {
                    name: '访问量',
                    type: 'line',
                    smooth: true,
                    data: [120, 200, 150, 80, 70, 110, 130]
                }
            ]
        })
    }
})
</script>

<style scoped>
.home-page {
    padding: 16px;
    background: #f5f6fa;
    min-height: 100vh;
}

.welcome-card {
    background: linear-gradient(90deg, #306dfa 0%, #0a385f 100%);
    color: white;
}

.welcome-title {
    font-size: 20px;
    margin: 0;
}

.welcome-subtitle {
    margin: 0;
    opacity: 0.85;
}
</style>
