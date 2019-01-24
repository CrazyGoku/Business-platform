<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/StoreManager/Store">
            <el-dropdown-item>
              店铺管理
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
              <span style="display:block;"  @click="pushMoneyRate" >
                            提成短信设置
            </span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">
              {{ $t('navbar.logOut') }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :close-on-click-modal="false"
      class="dialog"
      title="提成短信设置"
      :visible.sync="dialogVisible"
      width="30%">
      <span>提成比列：{{moneyRate}}</span>

      <el-input v-model="signature" placeholder="请输入短信签名" size="mini">
        <template slot="prepend">
          短信签名
        </template>
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" size="mini" @click="changeMoneyRate">修改</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import SizeSelect from '@/components/SizeSelect'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import { getSystem,putSystem} from '@/service/common'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      LangSelect,
      ThemePicker
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'device'
      ])
    },
    data() {
      return {
        moneyRate:0,
        signature:'',
        dialogVisible:false
      }
    },
    mounted() {
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        window.localStorage.setItem('id','')
        this.$router.push({path:'/login'})
      },
      pushMoneyRate(){
        getSystem().then(res=>{
          this.moneyRate = res.data.data.pushMoneyRate
          this.signature = res.data.data.signature
          this.dialogVisible = true
        })
      },
      changeMoneyRate(){
        this.$prompt('请输入提成比列', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(0|1|0.?[0-9]*)$/,
          inputErrorMessage: '请输入0-1之间'
        }).then(({ value }) => {
          console.log(value)
          let data ={
            pushMoneyRate : value,
            signature: this.signature
          }
          putSystem(data).then(res=>{
            if (res.data.code !== 1001) {
              this.$message({
                type: 'error',
                message: res.data.message
              });
              return
            }
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.pushMoneyRate()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dialog{
    /deep/ .el-dialog__body{
      padding: 10px;

    }
    /deep/ .el-dialog__footer{
      padding: 10px;
    }
  }
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          line-height: initial;
          cursor: pointer;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
