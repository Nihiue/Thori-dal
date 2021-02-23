import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import './styles/base.scss'
import filters from './utils/filter.js';
import store from './store/index.js';

const app = createApp(App)

app.use(store)
app.config.globalProperties.$filters = filters;
app.use(ElementPlus)

app.mount('#app')
