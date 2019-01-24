<template>
    <page class="MyPushMoney" :title="title" @clickLeft="clickLeft" pageName="MyPushMoney">
        <div id="MyPushMoney">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="getClientsStoresFun"
          >
            <van-cell
              icon="shop-o"
              v-for="(item,index) in pushMoneyList"
              :key="index"
              @click="pushMoney(item)"
            >
              <template slot="title">
                <span class="custom-text">{{item.storeName}}</span>
                <van-tag plain>提成金额：{{item.pushMoney}}</van-tag>
              </template>
              <van-icon slot="right-icon" name="gold-coin" class="right-icon" />
            </van-cell>
          </van-list>
          <van-dialog
            v-model="show"
            show-cancel-button
            :before-close="beforeClose"
          >
            <p class="title">提现</p>
            <van-field
              v-model="money"
              placeholder="请输入提现金额"
            />
          </van-dialog>

        </div>
    </page>
</template>

<script>
    import Page from '@/components/page/page'
    import header from '@/mixins/header'
    import {getClientsStores} from '@/api/api'
    import {postPushMoney} from '@/api/api'
    export default {
        name: "MyPushMoney",
        mixins: [header],
        data() {
            return {
                title: '各店铺提成',
              show:false,
              dataPage:{
                page:1,
                pageSize:10
              },
              loading: false,
              finished: false,
              pushMoneyList:[],
              money:'',
              chioceRow:{}
            }
        },
        methods: {
          beforeClose(action, done) {
            if (action === 'confirm') {
              let data = {
                storeId:this.choiceRow.storeId,
                clientId:this.$store.getters.id,
                type:4,

              }
              setTimeout(done, 1000);
            } else {
              done();
            }
          },
          pushMoney(row){
            this.money = ''
            this.chioceRow = row
            this.show = true
          },
          getClientsStoresFun(){
            let params = {
              clientId: this.$store.getters.id,
              ...this.dataPage
            }
            getClientsStores(params).then(res=>{
              this.loading = false;
              let data = res.data
              this.dataPage = data.pageVo
              this.pushMoneyList.push.apply(this.pushMoneyList, data.items);
              if (this.dataPage.page >= this.dataPage.totalPage) {
                this.finished = true
                return
              }
              this.dataPage.page++
            })
          }
        },
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
  .title{
    padding-top: 40px;
    text-align: center;
  }
</style>
