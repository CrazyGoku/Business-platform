<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="报损报溢分析" name="first">
        <LossOverflow />
      </el-tab-pane>
      <el-tab-pane label="其他出入库分析" name="second">
        <BorrowingAndLending />
      </el-tab-pane>
      <el-tab-pane label="按商品-仓库" name="three">
        <CommodityWarehouse />
      </el-tab-pane>
      <el-tab-pane label="按商品" name="four">
        <ByCommodity />
      </el-tab-pane>
      <el-tab-pane label="出入库明细" name="five">
        <OutgoingAndWarehousing />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import LossOverflow from '@/views/PurchaseAndSale/Report/components/InventoryAnalysis/LossOverflow.vue'
  import BorrowingAndLending from '@/views/PurchaseAndSale/Report/components/InventoryAnalysis/BorrowingAndLending.vue'
  import CommodityWarehouse from '@/views/PurchaseAndSale/Report/components/InventoryAnalysis/CommodityWarehouse.vue'
  import ByCommodity from '@/views/PurchaseAndSale/Report/components/InventoryAnalysis/ByCommodity.vue'
  import OutgoingAndWarehousing from '@/views/PurchaseAndSale/Report/components/InventoryAnalysis/OutgoingAndWarehousing.vue'
  export default {
    name: "InventoryAnalysis",
    mixins: [common],
    components: { LossOverflow,BorrowingAndLending,CommodityWarehouse,ByCommodity,OutgoingAndWarehousing },
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
