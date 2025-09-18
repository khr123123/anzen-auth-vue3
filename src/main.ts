import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import router from './router'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { createPinia } from 'pinia'
import roleDirective from "@/directive/hasRole"
import permissionDirective from "@/directive/hasPermi"
//路由守卫
import "./premission"


const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(createPinia());
app.use(router);

//注册自定义事件
app.directive('hasRole', roleDirective)
app.directive('hasPermi', permissionDirective)
app.mount('#app');