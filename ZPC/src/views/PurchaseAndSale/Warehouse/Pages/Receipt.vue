<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="采购订单待收货" name="first">
        <POReceipt />
      </el-tab-pane>
      <el-tab-pane label="退换货申请待收货" name="second">
        <RCReceipt />
      </el-tab-pane>
      <el-tab-pane label="调拨申请收货" name="three">
        <AOReceipt />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from '@/mixins/common'
import POReceipt from '@/views/PurchaseAndSale/Warehouse/components/Warehouse/POReceipt.vue'
import RCReceipt from '@/views/PurchaseAndSale/Warehouse/components/Warehouse/RCReceipt.vue'
import AOReceipt from '@/views/PurchaseAndSale/Warehouse/components/Warehouse/AOReceipt.vue'
export default {
  name: 'Receipt',
  components: { POReceipt, RCReceipt, AOReceipt },
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
