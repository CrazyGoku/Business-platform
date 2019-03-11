import Vue from 'vue'
import Router from 'vue-router'
import _import from '@/router/_import'
import store from '../store/index'
import {getToken, getId} from '@/utils/auth'

Vue.use(Router)
import Login from '@/Pages/Login/Login.vue'
import BussinessHome from '@/Pages/BusinessHome/BusinessHome.vue'
import PushMoneyDetails from '@/Pages/PushMoneyDetails/PushMoneyDetails.vue'
import UserInfo from '@/Pages/UserInfo/UserInfo.vue'
import MyPushMoneyDetail from '@/Pages/MyPushMoneyDetail/MyPushMoneyDetail.vue'
import MyPushMoney from '@/Pages/MyPushMoney/MyPushMoney.vue'
import MyOrder from '@/Pages/MyOrder/MyOrder.vue'

const router = new Router({
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/Login',
      component: Login
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/BusinessHome',
      name: 'BussinessHome',
      component: BussinessHome
    },
    {
      path: '/PushMoneyDetails',
      name: 'PushMoneyDetails',
      component: PushMoneyDetails
    },
    {
      path: '/UserInfo',
      name: 'UserInfo',
      component: UserInfo
    },
    {
      path: '/MyPushMoneyDetail',
      name: 'MyPushMoneyDetail',
      component: MyPushMoneyDetail
    },
    {
      path: '/MyPushMoney',
      name: 'MyPushMoney',
      component: MyPushMoney
    },
    {
      path: '/MyOrder',
      name: 'MyOrder',
      component: MyOrder
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (!_path && window.localStorage.getItem('path')) {
    let path = window.localStorage.getItem('path')
    store.commit("SET_PATH", path.split(','))
  }
  let _path = store.getters.path.slice(0)
  let index = _path.indexOf(to.name);
  if (index < 0) {
    _path.push(to.name)
  } else {
    _path.splice(index + 1, _path.length)
  }
  window.localStorage.setItem('path', _path)
  store.commit('SET_PATH', _path)
  console.log(getId())
  if (getId() && (to.path === '/' || to.path === '/Login')) {
    store.commit('SET_ID', getId())
    let toPath = '/BusinessHome'
    next({path: toPath, replace: true})
  } else if (to.path === '/') {
    // let toPath = '/error';
    let toPath = '/Login'
    next({path: toPath, replace: true})
  } else if (to.name !== 'Login' && !getId()) {
    let toPath = '/Login'
    next({path: toPath, replace: true})
  } else {
    store.commit('SET_ID', getId())
    store.commit('SET_LOADING', [])
    // Toast.clear()
    next()
  }
})
export default router
