<template>
    <div class="druid-container">
        <iframe class="druid-iframe" :src="druidUrl" frameborder="0"></iframe>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const druidUrl = ref('http://localhost:8080/api/druid/login.html')
</script>

<style scoped>
.druid-container {
    width: 100%;
    height: 85vh;
    display: flex;
    flex-direction: column;
}

.druid-iframe {
    flex: 1;
    width: 100%;
    border: none;
}
</style>
