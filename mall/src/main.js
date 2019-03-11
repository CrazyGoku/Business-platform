// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick-fixed'
import router from './router'
import store from './store'
import axios from 'axios'
import './common/less/index.less'
import {Collapse, CollapseItem,Tag ,Rate,Swipe,Badge, BadgeGroup,Picker,Dialog,Uploader, SwipeItem,RadioGroup,List, Radio,Panel, NavBar, Row, Col, Button, Field, CellGroup,Cell, Switch, Icon, Tab, Tabs, Popup, Loading, Tabbar, TabbarItem, DatetimePicker,Card,SubmitBar } from 'vant'
Vue.use(Tabbar).use(TabbarItem)
Vue.use(Row).use(Col)
Vue.use(Button)
Vue.use(Tag)
Vue.use(Dialog);
Vue.use(CellGroup).use(Field)
Vue.use(Cell).use(CellGroup);
Vue.use(Switch)
Vue.use(Collapse).use(CollapseItem);
Vue.use(Icon)
Vue.use(Badge);
Vue.use(BadgeGroup);
Vue.use(Uploader)
Vue.use(Picker);
Vue.use(Tab).use(Tabs)
Vue.use(Popup)
Vue.use(List);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Loading)
Vue.use(NavBar)
Vue.use(DatetimePicker)
Vue.use(Card);
Vue.use(Rate);
Vue.use(Panel);
Vue.use(SubmitBar);
Vue.use(Swipe).use(SwipeItem);
Vue.config.productionTip = false
Vue.prototype.$axios = axios
//  解决移动端300ms延迟
if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    function () {
      fastclick.attach(document.body)
    },
    false
  )
  fastclick.prototype.focus = function (targetElement) {
    targetElement.focus()
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
