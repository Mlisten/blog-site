import { createApp } from 'vue'
import router from "./commons/router";
import store from "./commons/store";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/display.css'
import request from './commons/utils/request'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
let app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.request = request;
app.use(ElementPlus,{locale: zhCn})
    .use(router).use(store)
    .mount('#app')