import Vue from 'vue'
import Router from 'vue-router'
import _import from './_import'
import store from '../store'
import {Dialog} from 'vant'
Vue.use(Router)
/**
 * meta标签含有homepage两个页面没有过渡
 */
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: _import('/BusinessHome/BusinessHome')
    },
    {
      path: '/BusinessHome',
      name: 'BusinessHome',
      component: _import('/BusinessHome/BusinessHome')
    },
    {
      path: '/Order',
      name: 'Order',
      component: _import('/Order/Order')
    }
  ]
})
// 验证页面权限；实现前进刷新，后退不刷新
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    // let toPath = '/error';
    let toPath = '/BusinessHome'
    next({path: toPath, replace: true})
  } else {
    store.commit('SET_LOADING', [])
    Dialog.close()
    // Toast.clear()
    next()
  }
  ;
})

export default router
