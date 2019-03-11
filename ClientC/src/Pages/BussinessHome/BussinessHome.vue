<template>
  <page class="BussinessHome" :title="title" @clickLeft="clickLeft" :showBack="false" pageName="BussinessHome">
    <div id="BussinessHome">
      <div class="page-box">
        <MyInfo v-if="active===1"></MyInfo>
        <Relationship v-if="active===0"></Relationship>
      </div>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="friends-o">关系</van-tabbar-item>
        <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </page>
</template>

<script>
    import Page from '@/components/page/page'
    import header from '@/mixins/header'
    import MyInfo from '@/Pages/MyInfo/MyInfo'
    import Relationship from '@/Pages/Relationship/Relationship'
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
                this.title = '关系'
              }else{
                this.title = '我的'
              }
            }
          }
        },
        mounted() {
        },
        components: {
            Page,
          Relationship,
          MyInfo
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
      flex: none;
      padding-bottom: 50Px;
    }
  }
</style>
