<template>
  <van-nav-bar @click-left="clickLeft" >
    <i class="icon-back" slot="left" v-show="showBack"/>
    <div name="title" class="title" slot="title">
      <span>{{title}}</span>
    </div>
  </van-nav-bar>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  methods: {
    clickLeft: function () {
      this.$parent.$emit('clickLeft')
    }
  }
}
</script>

<style rel="stylesheet/less" lang='less' scoped>
</style>
