import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入全局样式表
import 'assets/css/base.css'
// 引入字体图标
import 'assets/font_icon/iconfont.css'
// 引入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI);


Vue.use(VueQuillEditor);

Vue.config.productionTip = false

// 全局注册组件
Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')