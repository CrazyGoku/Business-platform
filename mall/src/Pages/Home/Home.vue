<template>
  <div id="Home">
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item><img src="https://avatar.csdn.net/4/C/5/3_xiejunna.jpg" alt=""></van-swipe-item>
      <van-swipe-item><img src="https://avatar.csdn.net/4/C/5/3_xiejunna.jpg" alt=""></van-swipe-item>
      <van-swipe-item><img src="https://avatar.csdn.net/4/C/5/3_xiejunna.jpg" alt=""></van-swipe-item>
      <van-swipe-item><img src="https://avatar.csdn.net/4/C/5/3_xiejunna.jpg" alt=""></van-swipe-item>
    </van-swipe>
    <div class="goods-content">
      <div class="cate-item">
        <div class="h">
          <div class="name">测试名称</div>
          <div class="desc">测试描述</div>
        </div>
        <div class="b">
          <div class="item" :class="(index + 1) % 2 == 0 ? 'item-b' : ''" v-for="(item,index) in goodList" :key="item.id" >
            <img class="img" :src="item.picUrl" background-size="cover"></img>
            <span class="name">{{item.name}}</span>
            <span class="price">￥{{item.retailPrice}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Page from '@/components/page/page'

    export default {
        name: "Home",
        mixins: [],
        data() {
            return {
                title: '',
              goodList:[
                {
                  id:1,
                  picUrl:'https://avatar.csdn.net/4/C/5/3_xiejunna.jpg',
                  name:'测试',
                  retailPrice:'100'
                },
                {
                  id:1,
                  picUrl:'https://avatar.csdn.net/4/C/5/3_xiejunna.jpg',
                  name:'测试',
                  retailPrice:'100'
                }
              ]
            }
        },
        methods: {},
        computed: {},
        watch: {},
        mounted() {
        },
        components: {
            Page
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin';
    .cate-item {
      margin-top: 94px;
      height: auto;
      overflow: hidden;
    }

    .cate-item .h {
      height: 145px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .cate-item .h .name {
      display: block;
      height: 35px;
      margin-bottom: 18px;
      font-size: 30px;
      color: #333;
    }

    .cate-item .h .desc {
      display: block;
      height: 24px;
      font-size: 24px;
      color: #999;
    }

    .cate-item .b {
      padding: 0 6.25px;
      height: auto;
      overflow: hidden;
      display: flex;
      justify-content: space-around;
    }

    .cate-item .b .item {
      float: left;
      background: #fff;
      margin-bottom: 6.25px;
      padding-bottom: 33.333px;
      height: auto;
      width: 45%;
      overflow: hidden;
      div-align: center;
    }

    .cate-item .b .item-b {
      margin-left: 6.25px;
    }

    .cate-item .item .img {
      width: 100%;
    }

    .cate-item .item .name {
      display: block;
      height: 35px;
      margin: 11.5px 0 22px 0;
      div-align: center;
      overflow: hidden;
      padding: 0 20px;
      font-size: 30px;
      color: #333;
      text-align: center;
    }

    .cate-item .item .price {
      display: block;
      height: 30px;
      div-align: center;
      font-size: 30px;
      color: #ab956d;
      text-align: center;
    }

</style>
