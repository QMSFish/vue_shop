import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('views/login/Login')
const Home = () =>
    import ('views/home/Home')
const Welcome = () =>
    import ('views/home/homeChildComps/Welcome')
const UserList = () =>
    import ('views/home/homeChildComps/userManage/UserList')
const RolesList = () =>
    import ('views/home/homeChildComps/powerManage/RolesList')
const PermissionList = () =>
    import ('views/home/homeChildComps/powerManage/PermissionList')
const GoodsList = () =>
    import ('views/home/homeChildComps/goodsManage/GoodsList')
const ClassifyParameter = () =>
    import ('views/home/homeChildComps/goodsManage/ClassifyParameter')
const GoodsClassify = () =>
    import ('views/home/homeChildComps/goodsManage/GoodsClassify')
const AddGoods = () =>
    import ('views/home/homeChildComps/goodsManage/AddGoods')
const OrderList = () =>
    import ('views/home/homeChildComps/orderManage/OrderList')
const DataReport = () =>
    import ('views/home/homeChildComps/statistics/DataReport')





Vue.use(VueRouter)

const routes = [
    { path: '', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: UserList },
            { path: '/roles', component: RolesList },
            { path: '/rights', component: PermissionList },
            { path: '/goods', component: GoodsList },
            { path: '/params', component: ClassifyParameter },
            { path: '/categories', component: GoodsClassify },
            { path: '/add', component: AddGoods },
            { path: '/orders', component: OrderList },
            { path: '/reports', component: DataReport }
        ]
    },
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
    const active = sessionStorage.getItem('activeIndex');
    if (!tokenData) {
        return next('/login');
    };
    // 点击返回首页地址
    if (to.path === '/welcome' && active) {
        sessionStorage.removeItem('activeIndex');
        setTimeout(() => {
            window.location.reload()
        }, 0);
        console.log(11);
        // window.location.reload()
    }
    next();
    // window.location.reload()
})

export default router