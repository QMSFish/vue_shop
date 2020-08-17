import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('views/login/Login')
const Home = () =>
    import ('views/home/Home')



Vue.use(VueRouter)

const routes = [
    { path: '', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
]

const router = new VueRouter({
    routes
})

// 挂载路由导航守卫 防止未登录 通过url直接访问特殊页面
router.beforeEach((to, from, next) => {
    //to and from are Route Object,next() must be called to resolve the hook
    // next 放行函数  next():直接放行  next('/login'):强制跳转到某个页面
    if (to.path === '/login') {
        return next();
    };
    const tokenData = sessionStorage.getItem('token');
    if (!tokenData) {
        return next('/login');
    };
    next();
})

export default router