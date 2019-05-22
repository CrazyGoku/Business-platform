import myCenter from './ReLoginDialog.vue'

const dialog = {
  vm: null,
  queue: [],
  initInstance(Vue, installOptions, opt) {
    if (this.vm) {
      this.queue.push({ opt })
      return
    }
    opt = { ...installOptions, ...opt }
    const vm = new (Vue.extend(myCenter))({
      el: document.createElement('div')
    })
    document.body.appendChild(vm.$el) // 添加到dom
    this.vm = vm
    this.vm.$on('close', () => {
      // 移除根元素，并销毁实例
      document.body.removeChild(this.vm.$el)
      this.vm.$destroy()
      this.vm = null
      if (this.queue.length > 0) {
        const cur = this.queue.shift()
        Vue.prototype.$reLoginDialog(cur.opt)
      }
    })
    Object.assign(vm, opt)
  },
  install: function(Vue, options) {
    // 在Vue添加实例，以全局调用
    Vue.prototype.$reLoginDialog = (opt) => {
      this.initInstance(Vue, options, opt)
    }
  }
}

export default dialog
