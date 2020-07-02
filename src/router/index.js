import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
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
    component: Home
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
