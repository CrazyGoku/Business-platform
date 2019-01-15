<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户订货分析" name="first">
        <ByClient />
      </el-tab-pane>
      <el-tab-pane label="商品订货分析" name="second">
        <ByGoods />
      </el-tab-pane>
      <el-tab-pane label="订单分析" name="three">
        <ByOrder />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import common from '@/mixins/common'
import ByClient from '@/views/PurchaseAndSale/Report/components/OrderStatistics/ByClient.vue'
import ByGoods from '@/views/PurchaseAndSale/Report/components/OrderStatistics/ByGoods.vue'
import ByOrder from '@/views/PurchaseAndSale/Report/components/OrderStatistics/ByOrder.vue'
export default {
  name: 'OrderStatistics',
  components: { ByClient, ByOrder, ByGoods },
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
