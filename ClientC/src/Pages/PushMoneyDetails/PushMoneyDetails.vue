<template>
  <page class="PushMoneyDetails" :title="title" @clickLeft="clickLeft" pageName="PushMoneyDetails">
    <div id="PushMoneyDetails">
      <div>
        <van-cell
          v-for="(item,index) in subordinateList"
          :key="index"
          :title="item.storeName"
          :value="item.totalPushMoney"
        />
        <div v-if="lostData" class="lost-data">
          <img src="@/assets/icons/data-lost.png" alt="">
        </div>
      </div>
    </div>
  </page>
</template>

<script>
  import Page from '@/components/page/page'
  import header from '@/mixins/header'
  import {getClientsSubordinateDetail} from '@/api/api'

  export default {
    name: "PushMoneyDetails",
    mixins: [header],
    data() {
      return {
        title: '好友提成明细',
        active: 0,
        subordinateList: [],
        clientId: this.$route.query.clientId,
        lostData: false
      }
    },
    methods: {
      getClientsSubordinateDetailFun() {
        let path = this.clientId
        getClientsSubordinateDetail(path).then(res => {
          this.subordinateList = res.data
          this.lostData = this.subordinateList.length === 0
        })
      },
    },
    computed: {},
    watch: {},
    mounted() {
      this.getClientsSubordinateDetailFun()
    },
    components: {
      Page
    }
  }
</script>

<style lang='less' scoped>
  @import '../../common/less/mixin';
</style>
