<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户销售分析" name="first">
        <ByClient />
      </el-tab-pane>
      <el-tab-pane label="商品销售分析" name="second">
        <ByGoods />
      </el-tab-pane>
      <el-tab-pane label="回款统计-按职员" name="eight">
        <InByUser />
      </el-tab-pane>
      <el-tab-pane label="业绩统计-按职员" name="three">
        <ByUser />
      </el-tab-pane>
      <el-tab-pane label="业绩统计-按仓库" name="four">
        <ByWarehouse />
      </el-tab-pane>
      <el-tab-pane label="销售日报" name="five">
        <ByDay />
      </el-tab-pane>
      <el-tab-pane label="销售月报" name="six">
        <ByMonth />
      </el-tab-pane>
      <el-tab-pane label="销售年报" name="seven">
        <ByYear />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from '@/mixins/common'
import ByClient from '@/views/PurchaseAndSale/Report/components/SalesReport/ByClient.vue'
import ByGoods from '@/views/PurchaseAndSale/Report/components/SalesReport/ByGoods.vue'
import ByMonth from '@/views/PurchaseAndSale/Report/components/SalesReport/ByMonth.vue'
import ByDay from '@/views/PurchaseAndSale/Report/components/SalesReport/ByDay.vue'
import ByUser from '@/views/PurchaseAndSale/Report/components/SalesReport/ByUser.vue'
import ByWarehouse from '@/views/PurchaseAndSale/Report/components/SalesReport/ByWarehouse.vue'
import ByYear from '@/views/PurchaseAndSale/Report/components/SalesReport/ByYear.vue'
import InByUser from '@/views/PurchaseAndSale/Report/components/SalesReport/InByUser.vue'
export default {
  name: 'SalesReport',
  components: { ByClient, ByGoods, ByMonth, ByDay, ByYear, ByUser, ByWarehouse, InByUser },
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
