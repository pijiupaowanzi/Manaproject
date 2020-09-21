import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI) //注册elementui
//引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.1.13:8888/api/private/v1'

//引入图表
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)//注册使用富文本编辑器

import Treetable from 'vue-table-with-tree-grid'
Vue.component('tree-table',Treetable);

Vue.prototype.$axios = axios
Vue.config.productionTip = false

const instance = new Vue({
  router,
  store,
  mounted() {
    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
      // 在发送请求之前做些什么
      config.headers['Authorization']=sessionStorage.getItem('token');
      return config;
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });

    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      if (response.data.meta.status == 200) {
        return response.data;
      } else if (response.data.meta.status == 400) {
        instance.$message.error(response.data.meta.msg);
        return; //输出错误以后return一下，不再执行其他的代码
      }
      return response.data;
    }, function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    });
  },
  render: h => h(App)
}).$mount('#app')