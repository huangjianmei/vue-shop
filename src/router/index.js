import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName:'login_home_welcome' */ '../components/Login')
const Home = () => import(/* webpackChunkName:'login_home_welcome' */ '../components/Home')
const Welcome = () => import(/* webpackChunkName:'login_home_welcome' */ '../components/Welcome.vue')
const Users = () => import(/* webpackChunkName:'user_rights_roles' */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName:'user_rights_roles' */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:'user_rights_roles' */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName:'cate_params_list' */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName:'cate_params_list' */ '../components/goods/Params.vue')
const List = () => import(/* webpackChunkName:'cate_params_list' */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName:'add_order_reports' */ '../components/goods/Add.vue')
const Order = () => import(/* webpackChunkName:'add_order_reports' */ '../components/order/Order.vue')
const Reports = () => import(/* webpackChunkName:'add_order_reports' */ '../components/report/Report.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/users',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})

// // 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to 将要访问的路由
//   // from 从哪个路由进入
//   // next 是一个函数，表示放行
//   console.log(to, '===to')
//   if (to.path === '/login') return next()
//   // eslint-disable-next-line no-unused-vars
//   const token = sessionStorage.token
//   console.log(token, 'token')
//   if (!token) return next('/login')
//   next()
// })

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = sessionStorage.token
  if (!token) return next('/login')
  next()
})
export default router
