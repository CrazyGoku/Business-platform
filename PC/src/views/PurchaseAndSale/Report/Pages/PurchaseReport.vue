<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="商品采购分析" name="first">
        <ByGoods />
      </el-tab-pane>
      <el-tab-pane label="供应商采购分析" name="second">
        <BySupplier />
      </el-tab-pane>
      <el-tab-pane label="采购订单分析-按明细" name="three">
        <OrderByGoods />
      </el-tab-pane>
      <el-tab-pane label="采购订单分析-按商品" name="four">
        <OrderByDetail />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import ByGoods from '@/views/PurchaseAndSale/Report/components/PurchaseReport/ByGoods.vue'
  import BySupplier from '@/views/PurchaseAndSale/Report/components/PurchaseReport/BySupplier.vue'
  import OrderByDetail from '@/views/PurchaseAndSale/Report/components/PurchaseReport/OrderByDetail.vue'
  import OrderByGoods from '@/views/PurchaseAndSale/Report/components/PurchaseReport/OrderByGoods.vue'
  export default {
    name: 'PurchaseReport',
    components: { ByGoods, BySupplier, OrderByDetail, OrderByGoods },
    mixins: [common],
    data() {
      return {
        activeName: 'first'
      }
    },
    computed: {},
    watch: {},
    mounted() {
    },
    methods: {}
  }
</script>

<style lang='scss' scoped>

</style>
