import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      // 路径
      path: "/",
      // 重定向
      redirect: "/home"
    },
    {
      path: "/login",
      // 登录懒加载
      component: () =>
        import("./views/Login.vue")
    },
    // home中的懒加载
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: () => import("@/components/welcome.vue")
        },
        // 用户列表懒加载
        {
          path: "/users",
          component: () => import("@/components/UsersList.vue")
        }, 
        // 角色列表懒加载
        {
          path: "/roles",
          component: () => import("@/components/rolesList.vue")
        },
        // 权限列表懒加载
        {
          path: "/rights",
          component: () => import("@/components/rightsList.vue")
        },
        // 商品列表懒加载
        {
          path: "/goods",
          redirect: "/goods/list"
        },
        // 商品列表中的添加商品
        {
          path: "/goods/list",
          component: () => import("@/components/goodsList.vue")
        },
        // 添加商品
        {
          path: "/goods/add",
          component: () => import("@/components/addShop.vue")
        },
        // 分类参数
        {
          path: '/params',
          component: () => import('@/components/paramsClass.vue')
        },
        // 商品分类
        {
          path: '/categories',
          component: () => import('@/components/categoriesShop.vue')
        },
        // 订单列表
        {
          path: '/orders',
          component: () => import('@/components/ordersList.vue')
        },
        // 数据报表 
        {
          path: '/reports',
          component: () => import('@/components/reportsPng.vue')
        }
      ]
    },
  ]
});

// 路由导航
router.beforeEach((to, from, next) => {
  // 判断是不是从登录进入
  if (to.path === '/login') return next()
  // 给token 没有进入登录页面
  const token = sessionStorage.getItem('token');
  if (!token) return next('/login')
  // 放行
  next()
})

// 暴露router
export default router;
