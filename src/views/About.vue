<template>
    <div class="about-page">
        <!-- 标题 -->
        <a-card class="about-card" title="关于我">
            <p>
                👋 你好，我是 <strong>KK</strong>，一名全栈开发者，目前主要专注于
                <strong>Java 后端</strong> 和 <strong>前端工程化</strong> 的开发。
            </p>
        </a-card>

        <!-- 技术栈 -->
        <a-card class="about-card" title="我的技术栈" style="margin-top: 16px">
            <a-row :gutter="16">
                <a-col :span="12">
                    <h3>💻 后端</h3>
                    <ul>
                        <li>Java / Spring Boot / Spring Cloud</li>
                        <li>MyBatis-Plus / MyBatis X</li>
                        <li>Redis、RabbitMQ、Sentinel</li>
                        <li>MySQL / SQLite</li>
                        <li>分布式事务、连接池、自定义框架</li>
                    </ul>
                </a-col>
                <a-col :span="12">
                    <h3>🎨 前端</h3>
                    <ul>
                        <li>Vue3 / React 18</li>
                        <li>Ant Design Pro、Arco Design、Element Plus</li>
                        <li>Echarts 数据可视化</li>
                        <li>TypeScript / Pinia / Axios</li>
                    </ul>
                </a-col>
            </a-row>
        </a-card>

        <!-- 其他 -->
        <a-card class="about-card" title="兴趣与方向" style="margin-top: 16px">
            <p>我热衷于研究高性能架构、AI 技术与日本 IT 市场的发展。</p>
            <p>未来的方针是不断优化个人项目，打造灵活可扩展的系统。</p>
        </a-card>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about-page {
    padding: 16px;
    min-height: 70vh;
}

.about-card {
    border-radius: 12px;
}
</style>
