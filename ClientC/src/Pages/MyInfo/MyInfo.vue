<template>
    <div class="bg">
      <van-cell title="修改个人资料" is-link to="UserInfo" />
      <van-cell title="各店铺提成" is-link to="MyPushMoney" />
      <van-cell title="提成明细" is-link to="MyPushMoneyDetail" />
      <van-cell title="我的申请" is-link to="MyOrder" />

      <button class="submit-btn" @click="logout">
        注销
      </button>
    </div>
</template>

<script>
  import Cookies from 'js-cookie'
    export default {
        name: "MyInfo",
        data() {
            return {}
        },
      methods:{
        logout(){
          Cookies.remove('userid');
          console.log(Cookies.get('userid'))
          window.localStorage.setItem('path',"")
          this.$router.push({'name':'Login'})
        }
      }
    }
</script>

<style lang="less" scoped>

  .submit-btn{
    font-size: 14Px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border: 0;
    color:white;
    padding: 10Px;
    border-radius: 10Px;
    width:80%;
    margin: 0 auto;
    margin-top: 30Px;
    background: #ffa569;
  }
</style>
