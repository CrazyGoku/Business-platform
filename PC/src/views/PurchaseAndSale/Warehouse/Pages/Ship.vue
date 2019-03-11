<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="销售订单待发货" name="first">
        <SOShipped />
      </el-tab-pane>
      <el-tab-pane label="退换货申请发货" name="second">
        <RCShipped />
      </el-tab-pane>
      <el-tab-pane label="调拨申请发货" name="three">
        <AOShipped />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from '@/mixins/common'
import SOShipped from '@/views/PurchaseAndSale/Warehouse/components/Warehouse/SOShipped.vue'
import RCShipped from '@/views/PurchaseAndSale/Warehouse/components/Warehouse/RCShipped.vue'
import AOShipped from '@/views/PurchaseAndSale/Warehouse/components/Warehouse/AOShipped.vue'
export default {
  name: 'Ship',
  components: { SOShipped, RCShipped,AOShipped },
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
