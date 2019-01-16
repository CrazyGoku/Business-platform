<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="资金经营分析" name="first">
        <ByFund />
      </el-tab-pane>
      <el-tab-pane label="库存经营分析" name="second">
        <ByManage />
      </el-tab-pane>
      <el-tab-pane label="利润经营分析" name="three">
        <ByProfit />
      </el-tab-pane>
      <el-tab-pane label="销售经营分析" name="four">
        <BySell />
      </el-tab-pane>
      <el-tab-pane label="往来经营分析" name="five">
        <ByTarget />
      </el-tab-pane>
      <!--<el-tab-pane label="按职员" name="second">-->
        <!--<ByFund />-->
      <!--</el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  // import ByBoss from '@/views/PurchaseAndSale/Report/components/ManagementCenter/ByBoss.vue'
  import ByFund from '@/views/PurchaseAndSale/Report/components/ManagementCenter/ByFund.vue'
  import ByManage from '@/views/PurchaseAndSale/Report/components/ManagementCenter/ByManage.vue'
  import ByProfit from '@/views/PurchaseAndSale/Report/components/ManagementCenter/ByProfit.vue'
  import BySell from '@/views/PurchaseAndSale/Report/components/ManagementCenter/BySell.vue'
  import ByTarget from '@/views/PurchaseAndSale/Report/components/ManagementCenter/ByTarget.vue'
  export default {
    name: "ManagementCenter",
    mixins: [common],
    components: { ByFund,ByManage,ByProfit,BySell,ByTarget },
    data() {
      return {
        activeName: 'first'
      }
    },
    mounted() {
    },
    methods: {},
    computed: {},
    watch: {}
  }
</script>

<style lang='scss' scoped>

</style>
