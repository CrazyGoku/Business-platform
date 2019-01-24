import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import store from '@/store'
/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/StoreManager',
    component: Layout,
    redirect: 'Store',
    children: [
      {
        path: 'Store',
        component: () => import('@/views/Common/StoreManager'),
        name: 'Store',
        meta: { title: '店铺管理', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/MembershipNumber',
    component: Layout,
    redirect: 'MembershipNumber',
    children: [
      {
        path: 'MembershipNumber',
        component: () => import('@/views/Common/MembershipNumber/MembershipNumber.vue'),
        name: 'MembershipNumber',
        meta: { title: '会员卡管理', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/ClientsLevels',
    component: Layout,
    redirect: 'ClientsLevels',
    children: [
      {
        path: 'ClientsLevels',
        component: () => import('@/views/Common/ClientsLevels/ClientsLevels.vue'),
        name: 'ClientsLevels',
        meta: { title: '客户级别', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/VIPCustomer',
    component: Layout,
    redirect: 'VIPCustomer',
    children: [
      {
        path: 'VIPCustomer',
        component: () => import('@/views/Common/VIPCustomer/VIPCustomer.vue'),
        name: 'VIPCustomer',
        meta: { title: '会员管理', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/Message',
    component: Layout,
    redirect: 'Message',
    children: [
      {
        path: 'Message',
        component: () => import('@/views/Common/Message/Message.vue'),
        name: 'Message',
        meta: { title: '短信管理', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/PrintPage',
    component: () => import('@/views/Common/PrintPage/index'),
    name: 'PrintPage'
  }

]

const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
router.beforeEach((to, from, next) => {
  let id = window.localStorage.getItem('id')
  console.log(to.path)
  if(id&&to.path!=='/login'){
    store.commit('SET_USER_ID',id)
    next()
  }else if (to.path=='/login'){
    next()
  }else if(!id){
    next({path: '/login', replace: true})
  }

})
export const asyncRouterMap = [

  { path: '*', redirect: '/404', hidden: true }
]
export default router
