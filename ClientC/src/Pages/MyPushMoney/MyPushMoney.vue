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
            @confirm="confirmHandle"
            :before-close="beforeClose"
          >
            <p class="title">提现</p>
            <van-field
              v-model="money"
              type="number"
              placeholder="请输入提现金额"
            />
            <van-radio-group v-model="withdrawalWay">
              <van-cell-group>
                <van-cell title="提现到手机号码对应的支付宝账户" clickable @click="withdrawalWay = '1'">
                  <van-radio name="1" />
                </van-cell>
                <van-cell title="其他方式需填写备注" clickable @click="withdrawalWay = '2'">
                  <van-radio name="2" />
                </van-cell>
              </van-cell-group>
            </van-radio-group>
            <van-field
              v-if="withdrawalWay==2"
              v-model="remark"
              label="备注"
              type="textarea"
              placeholder="请输入备注"
              rows="2"
              autosize
            />
          </van-dialog>

        </div>
    </page>
</template>

<script>
    import Page from '@/components/page/page'
    import header from '@/mixins/header'
    import {getClientsStores,postPushMoney} from '@/api/api'
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
              chioceRow:{},
              withdrawalWay:"1"
            }
        },
        methods: {
          confirmHandle(){

          },
          beforeClose(action, done) {

            if (action === 'confirm') {

              if(this.money<=0||!this.money){
                this.$toast('请输入正确的金额')
                done(false)
                return
              }
              if(this.withdrawalWay=='2'&&!this.remark){
                this.$toast('请输入备注')
                done(false)
                return
              }
              let data = {
                storeId:this.chioceRow.storeId,
                clientId:this.$store.getters.id,
                type:4,
                changePushMoney:this.money,
                withdrawalWay:this.withdrawalWay,
                remark:this.remark
              }
              postPushMoney(data).then(res=>{
                if(res.code=='1001'){
                  this.$toast('提现申请已提交')
                  done()
                }else{
                  this.$toast(res.message)
                  done(false)
                }
              })
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
  #MyPushMoney{
    /deep/ .van-cell__title{
      flex: 3;
    }
  }
</style>
