import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 引入
import ElementUI from "element-ui";
// 引入css样式
import "element-ui/lib/theme-chalk/index.css";
// 使用
Vue.use(ElementUI);

// 引入全局样式
import "./assets/css/base.css";
// 引入阿里巴巴矢量图标库
import './assets/font_1190954_0c2q93fi6tf/iconfont.css'

// 引入axios
import axios from "axios";
// 挂载
Vue.prototype.$http = axios;

// 导入树形表格组件
import TreeTable from 'vue-table-with-tree-grid'
// 全局注册
Vue.component('tree-table', TreeTable)

// 引入图片路径json
import ImgURL from './ImgURL.json'
// 图片根路径绑定
axios.defaults.baseURL = ImgURL.baseURL;
// 给图片使用拦截器发起 axios 请求
axios.interceptors.request.use(confirm => {
  // 根据后端提供的 Authorization 来获取请求头 
  // 获取 token
  confirm.headers.Authorization = window.sessionStorage.getItem('token');
  // 没有请求到直接返回 
  return confirm
})

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编译器相关样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 安装注册富文本编译器
Vue.use(VueQuillEditor)

// 过滤器(方法一)
// Vue.filter('time', function (times) {
//   const date = new Date(times)
//   const Y = date.getFullYear()
//   const m = (date.getMonth() + 1 + '').padStart(2, '0')
//   const d = (date.getDate() + '').padStart(2, '0')
//   const h = (date.getHours() + '').padStart(2, '0')
//   const M = (date.getMinutes() + '').padStart(2, '0')
//   const s = (date.getSeconds() + '').padStart(2, '0')

//   return `${Y}-${m}-${d} ${h}:${M}:${s}`
// })


// 过滤器(方法二)
Vue.filter('time', function (times) {
  const ctime = new Date(times)
  return ctime.toLocaleString()
})


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
