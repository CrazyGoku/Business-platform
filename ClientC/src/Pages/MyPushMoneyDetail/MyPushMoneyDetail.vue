<template>
  <page class="MyPushMoney" :title="title" @clickLeft="clickLeft" pageName="MyPushMoney">
    <div id="MyPushMoney">

      <van-tabs v-model="active">
        <van-tab title="提成增加">
          <van-list
            v-if="active===0"
            v-model="loading1"
            :finished="finished1"
            @load="getClientsStoreDetailType3Fun"
          >
            <van-cell
              v-for="(item,index) in subordinateType3List"
              :key="index"
              :title="item.storeName"
              :value="item.changePushMoney"
              />
          </van-list>
        </van-tab>
        <van-tab title="提成减少">
          <van-list
            v-if="active===1"
            v-model="loading2"
            :finished="finished2"
            @load="getClientsStoreDetailType4Fun"
          >
            <van-cell
              v-for="(item,index) in subordinateType4List"
              :key="index"
              :title="item.storeName"
              :value="item.changePushMoney"
            />
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </page>
</template>

<script>
  import Page from '@/components/page/page'
  import header from '@/mixins/header'
  import {getClientsStoreDetail} from '@/api/api'
  export default {
    name: "MyPushMoneyDetail",
    mixins: [header],
    data() {
      return {
        title: '提成明细',
        active: 0,
        subordinateType3List: [],
        subordinateType4List: [],
        dataPage1:{
          page:1,
          pageSize:10
        },
        dataPage2:{
          page:1,
          pageSize:10
        },
        loading1: false,
        finished1: false,
        loading2: false,
        finished2: false
      }
    },
    methods: {
      getClientsStoreDetailType3Fun() {
        let params = {
          clientId: this.$store.getters.id,
          type: 3,
          status:1,
          ...this.dataPage1
        }
        getClientsStoreDetail(params).then(res => {
          this.loading1 = false;
          let data = res.data
          this.subordinateType3List.push.apply(this.subordinateType3List, data.items);
          this.dataPage1 = data.pageVo
          if (this.dataPage1.page >= this.dataPage1.totalPage) {
            this.finished1 = true
            return
          }
          this.dataPage1.page++
        })
      },
      getClientsStoreDetailType4Fun() {
        let params = {
          clientId: this.$store.getters.id,
          type: 4,
          ...this.dataPage2
        }
        getClientsStoreDetail(params).then(res => {
          this.loading2 = false;
          let data = res.data
          this.subordinateType4List.push.apply(this.subordinateType4List, data.items);
          this.dataPage2 = data.pageVo
          if (this.dataPage2.page >= this.dataPage2.totalPage) {
            this.finished2 = true
            return
          }
          this.dataPage2.page++
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
