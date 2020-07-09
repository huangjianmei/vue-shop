import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8081/api/private/v1'
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.token
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册为全局可用组件
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
