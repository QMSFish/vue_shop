import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
// 引入全局样式表
import 'assets/css/base.css'
// 引入字体图标
import 'assets/font_icon/iconfont.css'
// 引入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')