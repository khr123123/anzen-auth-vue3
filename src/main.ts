import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import router from './router'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { createPinia } from 'pinia'


const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(createPinia());
app.use(router);
app.mount('#app');