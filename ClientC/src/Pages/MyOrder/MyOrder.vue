<template>
    <page class="MyOrder" :title="title" @clickLeft="clickLeft" pageName="MyOrder">
        <div id="MyOrder">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="getOrderListFun"
          >
            <van-cell
              icon="shop-o"
              v-for="(item,index) in pushMoneyList"
              :key="index"
              @click="showRemark(item)"
            >
              <template slot="title">
                <span class="custom-text">{{item.storeName}}</span>
                <van-tag plain>提现金额：{{Math.abs(item.changePushMoney)}}</van-tag>
              </template>

              <van-tag v-if="item.status==2" slot="right-icon" round type="danger">审核未通过</van-tag>
              <van-tag v-if="item.status==0" slot="right-icon" round type="primary">待审核</van-tag>
              <van-tag v-if="item.status==1" slot="right-icon" round type="success">审核通过</van-tag>
            </van-cell>
          </van-list>
        </div>
    </page>
</template>

<script>
    import Page from '@/components/page/page'
    import header from '@/mixins/header'
    import {getOrderList} from '@/api/api'
    export default {
        name: "MyOrder",
        mixins: [header],
        data() {
            return {
                title: '我的申请',

              dataPage:{
                page:1,
                pageSize:10
              },
              loading: false,
              finished: false,
              pushMoneyList:[],
            }
        },
        methods: {
          showRemark(item){
            this.$dialog.alert({
              title: item.statusName,
              message: item.remark
            }).then(() => {
              // on close
            });

          },
          getOrderListFun(){
            let params = {
              clientId: this.$store.getters.id,
              type:4,
              ...this.dataPage
            }
            getOrderList(params).then(res=>{
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
</style>
