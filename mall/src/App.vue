<template>
  <div id="app">
    <page-view/>
  </div>
</template>

<script>
  import PageView from './components/page-view/page-view.vue'

  export default {
    name: 'app',
    components: {
      PageView
    },
    mounted: function () {
      this.appShow()
    },
    methods: {
      appShow() {
        const {PAGE_START_TIME} = window
        const END_TIME = new Date().getTime() // 结束时间
        const diffTime = END_TIME - PAGE_START_TIME
        console.log(diffTime + '---')
      }
    }
  }
</script>

<style lang='less'>
  .lost-data{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
</style>
