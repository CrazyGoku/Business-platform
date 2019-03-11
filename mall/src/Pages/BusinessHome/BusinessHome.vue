<template>
  <page class="BussinessHome" :title="title" @clickLeft="clickLeft" :showBack="false" pageName="BussinessHome">
    <div id="BussinessHome">
      <div class="page-box">
        <Home v-if="active===0"></Home>
        <Class v-if="active===1"></Class>
        <Cart v-if="active===2"></Cart>
        <My v-if="active===3"></My>
      </div>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
        <van-tabbar-item icon="apps-o">分类</van-tabbar-item>
        <van-tabbar-item icon="cart-o">购物车</van-tabbar-item>
        <van-tabbar-item icon="contact">个人</van-tabbar-item>
      </van-tabbar>
    </div>
  </page>
</template>

<script>
    import Page from '@/components/page/page'
    import header from '@/mixins/header'
    import Cart from '@/Pages/Cart/Cart'
    import Class from '@/Pages/Class/Class'
    import Home from '@/Pages/Home/Home'
    import My from '@/Pages/My/My'
    export default {
        name: "BusinessHome",
        mixins: [header],
        data() {
            return {
              active: 0,
              title:'关系'
            }
        },
        methods: {},
        computed: {},
        watch: {
          active: {
            immediate:true,
            handler(newValue){
              if(newValue===0){
                this.title = '首页'
              }else if(newValue===1){
                this.title = '分类'
              }else if(newValue===2){
                this.title = '购物车'
              }else if(newValue===3){
                this.title = '个人'
              }
            }
          }
        },
        mounted() {
        },
        components: {
          Page,
          Cart,
          Class,
          Home,
          My
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin';
  .BussinessHome{
    display: flex;
    flex-direction: column;
    justify-content: center;
    .page-box{
      flex: 1;
      padding-bottom: 50Px;
      background-color: #f4f4f4;
    }
  }
</style>
