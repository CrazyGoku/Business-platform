<template>
    <page class="UserInfo" :title="title" @clickLeft="clickLeft" pageName="UserInfo">
        <div id="UserInfo">
          <van-cell-group>
            <van-field
              v-model="postData.username"
              required
              clearable
              label="登录名"
              placeholder="请输入登录名"
            />
            <van-field
              v-model="postData.password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              required
            />
            <van-field
              v-model="postData.phone"
              label="手机号"
              type="number"
              max-length="11"
              placeholder="请输入手机号"
              required
            />
            <van-field
              v-model="postData.address"
              label="地址"
              placeholder="请输入地址"
            />
            <van-field
              v-model="postData.postcode"
              label="邮编"
              placeholder="请输入邮编"
            />
          </van-cell-group>
          <button class="submit-btn" @click="putClientFun">
            提交
          </button>
        </div>
    </page>
</template>

<script>
    import Page from '@/components/page/page'
    import header from '@/mixins/header'
    import {putClient,getClient} from "../../api/api";

    export default {
        name: "UserInfo",
        mixins: [header],
        data() {
            return {
                title: '编辑资料',
              postData:{
                username:'',
                password:'',
                phone:'',
                address:'',
                postcode:''
              }
            }
        },
        methods: {
          putClientFun(){
            if(!this.postData.username||!this.postData.password||!this.postData.phone){
              this.$toast('请输入必填项！')
              return
            }
            let regexp = /^\d{11}$/
            if (!regexp.test(this.postData.phone)) {
              this.$toast('请输入正确的手机号码')
            }
            let data = {
              id:this.$store.getters.id,
              ...this.postData
            }
            putClient(data).then(res=>{
              console.log(res)
              if(res.code===1001){
                this.$toast('修改成功')
              }
            })
          },
          getClientFun(){
            let params = {
              id:this.$store.getters.id,
              page:1,
              pageSize:10,
            }
            getClient(params).then(res=>{
              this.postData = res.data.items[0]
            })
          },
        },
        computed: {},
        watch: {},
        mounted() {
          this.getClientFun()
        },
        components: {
            Page
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin';
  .submit-btn{
    border: 0;
    color:white;
    padding: 20px;
    border-radius: 10px;
    width:80%;
    margin: 0 auto;
    margin-top: 30px;
    background: #ffa569;
  }
</style>
