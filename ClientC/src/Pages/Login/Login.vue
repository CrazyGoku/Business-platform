<template>
    <div style="background-color: white">
      <img style="width: 50%;margin: 0 auto;padding: 20Px;" src="../../common/images/WechatIMG4.png" alt="">
      <van-cell-group>
        <van-field
          v-model="username"
          required
          clearable
          label="用户名"
          placeholder="请输入用户名"
        />

        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
      </van-cell-group>
      <van-button class="button" type="primary" size="large" @click="loginHandle">登录</van-button>
    </div>

</template>

<script>
  import {login,getInfo} from '@/api/login'
  import {setToken,setId} from '@/utils/auth'
  import Page from '@/components/page/page'
  import header from '@/Pages/mixins/header'
  import {imgURI} from '../../api/constants.js'
  import {mapGetters,mapMutations} from 'vuex'
  export default {
    name: "Login",
    data() {
      return {
        username: '',
        password: '',
        vCode: '',
        title: '登录',
        codeImg: '',
        imgURI
      }
    },
    mixins: [header],
    methods: {
      redirectTo() {
        this.$router.push({name: 'Register'})
      },
      loginHandle() {
        let payload = {
          username: this.username,
          password: this.password
        }
        login(payload).then(res=>{
          console.log(res)
          if(res.code===1001){
            console.log()
            this.set_Id(res.data.id)
            setId(res.data.id)
            let path = res.data.id
            getInfo(path).then(response => {
              this.$router.push({name: 'BussinessHome'})
              console.log(1)
            }).catch(error => {
            })
          }
        })
      },
      ...mapMutations({
        set_Id: 'SET_ID',
        set_token: 'SET_TOKEN',
        set_userInfo :'SET_USERINFO'
      })
    },
    mounted() {
    },
    components: {Page}
  }
</script>

<style scoped>
  .button {
    margin: 10Px 5% 0;
    box-sizing: border-box;
    width: 90%;
    height: 45Px;
    line-height: 45Px;
  }
  .van-cell{
    line-height: 30Px;
  }
  .copyRight{
    box-sizing: border-box;
    padding: 10Px;
    color:black;
    font-size:13Px;
    position: fixed;
    bottom:10Px;
    text-align: center;
    width: 100%;
  }
</style>
