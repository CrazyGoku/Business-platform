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
              <span style="display:block;" @click="pushMoneyRate">
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
               width="50%">
      <div class="dialog-content-input">
        <NumberInput max="1" step="0.1" v-model="systemDetial.pushMoneyRate">
          <template slot="prepend">
            分店统一提成比例
          </template>
        </NumberInput>
        <NumberInput v-model="systemDetial.membershipMembershipMoney">
          <template slot="prepend">
            会员推荐会员直接提成
          </template>
        </NumberInput>
        <NumberInput max="1" step="0.1" v-model="systemDetial.membershipMembershipRate">
          <template slot="prepend">
            会员推荐会员提成比例
          </template>
        </NumberInput>
        <NumberInput v-model="systemDetial.bossMembershipMoney">
          <template slot="prepend">
            店长推荐会员直接提成
          </template>
        </NumberInput>
        <NumberInput max="1" step="0.1" v-model="systemDetial.membershipBossRate">
          <template slot="prepend">
            会员推荐店长提成比例
          </template>
        </NumberInput>
        <NumberInput max="1" step="0.1" v-model="systemDetial.bossBossRate">
          <template slot="prepend">
            店长推荐店长提成比例
          </template>
        </NumberInput>
        <el-select
          v-model="systemDetial.defaultLevelId"
          clearable
          size="mini"
          filterable placeholder="设置默认商城会员等级"
        >
          <el-option
            v-for="item in clientLevelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="systemDetial.signature" placeholder="请输入短信签名" size="mini">
          <template slot="prepend">
            短信签名
          </template>
        </el-input>
      </div>
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
  import {getSystem, putSystem} from '@/service/common'
  import NumberInput from '@/components/NumberInput'
  import {
    getClientsLevels
  } from '@/service/PurchaseAndSale/DataEditing/ClientsLevels.js'
  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      LangSelect,
      ThemePicker, NumberInput
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
        moneyRate: 0,
        signature: '',
        dialogVisible: false,
        systemDetial: {},
        clientLevelList:[]
      }
    },
    mounted() {
    },
    methods: {
      getClientsLevelsData(){
        getClientsLevels().then(res=>{
          this.clientLevelList = res.data.data
        })
      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        window.localStorage.setItem('id', '')
        this.$router.push({path: '/login'})
      },
      async pushMoneyRate() {
        await this.getClientsLevelsData()
        getSystem().then(res => {
          this.systemDetial = res.data.data
          this.dialogVisible = true
        })
      },
      changeMoneyRate() {
        for (let i in this.systemDetial){
          if(this.systemDetial[i] == null){
            delete this.systemDetial[i]
          }
        }
        let data = {
          ...this.systemDetial
        }
        putSystem(data).then(res => {
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
          this.dialogVisible = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dialog {
    /deep/ .el-dialog__body {
      padding: 10px;

    }
    /deep/ .el-dialog__footer {
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
