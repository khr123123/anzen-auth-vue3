<template>
    <div class="server-monitor">
        <a-row :gutter="16">
            <!-- CPU 信息 -->
            <a-col :span="12">
                <a-card title="CPU 信息" class="info-card">
                    <a-spin class="info-card-spin" :loading="!data">
                        <p><strong>核心数：</strong>{{ data?.cpu.cpuNum }}</p>
                        <p><strong>总计：</strong>{{ data?.cpu.total }}</p>
                        <p><strong>系统：</strong>{{ data?.cpu.sys }}</p>
                        <p><strong>用户：</strong>{{ data?.cpu.used }}</p>
                        <p><strong>等待：</strong>{{ data?.cpu.wait }}</p>
                        <p><strong>空闲：</strong>{{ data?.cpu.free }}</p>
                    </a-spin>
                </a-card>
            </a-col>
            <!-- 内存信息 -->
            <a-col :span="12">
                <a-card title="内存信息" class="info-card">
                    <a-spin class="info-card-spin" :loading="!data">
                        <p><strong>总内存：</strong>{{ formatSize(data?.mem.total) }}</p>
                        <p><strong>已用：</strong>{{ formatSize(data?.mem.used) }}</p>
                        <p><strong>空闲：</strong>{{ formatSize(data?.mem.free) }}</p>
                        <a-progress :percent="Number(((data?.mem.used / data?.mem.total)).toFixed(4))" :show-text="true"
                            status="success" />
                    </a-spin>
                </a-card>
            </a-col>
        </a-row>

        <a-row :gutter="16" class="mt-4">
            <!-- JVM 信息 -->
            <a-col :span="12">
                <a-card title="JVM 信息" class="info-card">
                    <a-spin class="info-card-spin" :loading="!data">
                        <p><strong>已分配：</strong>{{ formatSize(data?.jvm.total) }}</p>
                        <p><strong>最大：</strong>{{ formatSize(data?.jvm.max) }}</p>
                        <p><strong>空闲：</strong>{{ formatSize(data?.jvm.free) }}</p>
                        <p><strong>版本：</strong>{{ data?.jvm.version }}</p>
                        <p><strong>安装目录：</strong>{{ data?.jvm.home }}</p>
                    </a-spin>
                </a-card>
            </a-col>

            <!-- 系统信息 -->
            <a-col :span="12">
                <a-card title="系统信息" class="info-card">
                    <a-spin class="info-card-spin" :loading="!data">
                        <p><strong>主机名：</strong>{{ data?.sys.computerName }}</p>
                        <p><strong>IP 地址：</strong>{{ data?.sys.computerIp }}</p>
                        <p><strong>操作系统：</strong>{{ data?.sys.osName }}</p>
                        <p><strong>架构：</strong>{{ data?.sys.osArch }}</p>
                        <p><strong>项目路径：</strong>{{ data?.sys.userDir }}</p>
                    </a-spin>

                </a-card>
            </a-col>
        </a-row>

        <!-- 磁盘信息 -->
        <a-row :gutter="16" class="mt-4">
            <a-col v-for="(file, index) in data?.sysFiles" :key="index" :span="12">
                <a-card :title="file.dirName" class="info-card">
                    <a-spin class="info-card-spin" :loading="!data">
                        <p><strong>文件系统：</strong>{{ file.sysTypeName }}</p>
                        <p><strong>类型：</strong>{{ file.typeName }}</p>
                        <p><strong>总大小：</strong>{{ file.total }}</p>
                        <p><strong>已用：</strong>{{ file.used }}</p>
                        <p><strong>可用：</strong>{{ file.free }}</p>
                        <p>
                            <strong>使用率：</strong>
                            <a-progress :percent="file.usage / 100" :show-text="true" status="warning" />
                        </p>
                    </a-spin>
                </a-card>
            </a-col>
        </a-row>

    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getInfo } from "@/api/serverController";

const data = ref<any>();
getInfo().then(res => {
    data.value = res.data;
});

function formatSize(size: any) {
    const kb = 1024, mb = kb * 1024, gb = mb * 1024;
    if (size >= gb) return (size / gb).toFixed(2) + " GB";
    if (size >= mb) return (size / mb).toFixed(2) + " MB";
    if (size >= kb) return (size / kb).toFixed(2) + " KB";
    return size + " B";
}
</script>

<style scoped>
.info-card {
    margin-bottom: 16px;
    min-height: 270px;
}

.mt-4 {
    margin-top: 16px;
}

.info-card-spin {
    width: 100%;
}
</style>
