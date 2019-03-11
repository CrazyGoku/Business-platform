<template>
  <div id="My">
    <div class="container">
      <div class="profile-info" bindtap="goLogin">
        <img class="avatar" src="userInfo.avatarUrl">
        <div class="info">
          <span class="name">十大</span>
        </div>
      </div>

      <div class='separate'></div>

      <div class='user_area'>
        <div class='user_row' bindtap='goOrder'>
          <div class='user_row_left'>我的订单</div>
          <img class='user_row_right' src='@/assets/icons/goright.png'>
        </div>
        <div class='user_column'>
          <div class='user_column_item' bindtap='goOrderIndex' data-index='1'>
            <span class="user_column_item_badge">1</span>
            <img class='user_column_item_img' src='@/assets/icons/pendpay.png'>
            <div class='user_column_item_span'>待付款</div>
          </div>
          <div class='user_column_item' bindtap='goOrderIndex' data-index='2'>
            <span class="user_column_item_badge" >21</span>
            <img class='user_column_item_img' src='@/assets/icons/send.png'>
            <div class='user_column_item_span'>待发货</div>
          </div>
          <div class='user_column_item' bindtap='goOrderIndex' data-index='3'>
            <span class="user_column_item_badge" >1</span>
            <img class='user_column_item_img' src='@/assets/icons/receive.png'>
            <div class='user_column_item_span'>待收货</div>
          </div>
          <div class='user_column_item' bindtap='goOrderIndex' data-index='4' >
            <span class="user_column_item_badge">1</span>
            <img class='user_column_item_img' src='@/assets/icons/comment.png'>
            <div class='user_column_item_span'>待评价</div>
          </div>
        </div>
      </div>

      <div class='separate'></div>

      <div class='user_row'>
        <div class='user_row_left'>核心服务</div>
      </div>
      <div class='user_column'>
        <div class='user_column_item' bindtap='goAddress'>
          <img class='user_column_item_img' src='@/assets/icons/address.png'>
          <div class='user_column_item_span'>地址管理</div>
        </div>
        <div class='user_column_item' bindtap='goCoupon'>
          <img class='user_column_item_img' src='@/assets/icons/coupon.png'>
          <div class='user_column_item_span'>优惠卷</div>
        </div>
        <div class='user_column_item' bindtap='aboutUs'>
          <img class='user_column_item_img' src='@/assets/icons/about_us.png'>
          <div class='user_column_item_span'>关于我们</div>
        </div>
      </div>
      <div class='separate'></div>
      <div class="logout" v-if="hasLogin" bindtap="exitLogin">退出登录</div>
    </div>
  </div>
</template>

<script>
    import Page from '@/components/page/page'

    export default {
        name: "My",
        mixins: [],
        data() {
            return {
                title: '',
              hasLogin:false
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
    .container {
      background: #f4f4f4;
      height: auto;
      overflow: hidden;
      width: 100%;
    }

    .profile-info {
      background-color: #ab956d;
      color: #f4f4f4;
      display: flex;
      align-items: center;
      padding: 30px;
      font-size: 28px;
    }

    .profile-info .avatar {
      height: 148px;
      width: 148px;
      border-radius: 50%;
    }

    .profile-info .info {
      flex: 1;
      height: 85px;
      padding-left: 31.25px;
    }

    .profile-info .name {
      display: block;
      height: 45px;
      line-height: 45px;
      color: #fff;
      font-size: 37.5px;
      margin-bottom: 10px;
    }

    .profile-info .level {
      display: block;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
      color: #7f7f7f;
      font-size: 30px;
    }

    .user_area {
      /* border: 1px solid black; */
      width: 100%;
      height: 226px;
      /* margin: 0 auto; */
      margin-top: -8px;
      background: #fff;
      /* border-top: 1px solid #f4f4f4; */
    }

    .user_row {
      /* border: 1px solid black; */
      height: 86px;
      line-height: 86px;
      border-bottom: 1px solid #fafafa;
    }

    .user_row_left {
      /* border: 1px solid #757575; */
      float: left;
      height: 86px;
      font-weight: 550;
      line-height: 86px;
      margin-left: 35px;
      font-size: 26px;
      letter-spacing: 1px;
    }

    .user_row_right {
      /* border: 1px solid #757575; */
      float: right;
      height: 40px;
      width: 40px;
      font-weight: 550;
      line-height: 86px;
      margin-top: 28px;
      margin-right: 30px;
    }

    .user_column {
      /* border: 1px solid black; */
      height: 140px;
      display: flex;
      justify-content: space-around;
      background: white;
      align-items: center;
    }

    .user_column_item {
      width: 30%;
      height: 140px;
      background: #fff;
      span-align: center;
      position: relative;
      justify-content: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .user_column_item_badge {
      height: 40px;
      width: 40px;
      position: absolute;
      background: #b4282d;
      color: #fff;
      border-radius: 50%;
      top: 30px;
      right: 30px;
      text-align: center;
      line-height: 40px;
    }

    .user_column_item_img {
      width: 50px;
      height: 50px;
      margin-top: 30px;
    }

    .user_column_item_span {
      /* border: 1px solid black; */
      margin-top: 5px;
      font-size: 24px;
      color: #555;
    }

    .separate {
      background: #e0e3da;
      width: 100%;
      height: 6px;
    }

    .user_column_item_phone {
      width: 30%;
      span-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      float: left;
      background: #fff;
      border-bottom: 1px solid #fafafa;
    }

    .user_column_item_phone::after {
      border: none;
    }

    .logout {
      margin-top: 30px;
      height: 100px;
      width: 100%;
      line-height: 100px;
      span-align: center;
      background: #fff;
      color: red;
      font-size: 30px;
    }

</style>
