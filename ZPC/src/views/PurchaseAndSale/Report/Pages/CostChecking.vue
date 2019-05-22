<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="按明细" name="first">
        <ByDetails />
      </el-tab-pane>
      <el-tab-pane label="按来往单位" name="second">
        <ByTarget />
      </el-tab-pane>
      <el-tab-pane label="按分类" name="three">
        <ByType />
      </el-tab-pane>
      <el-tab-pane label="按职员" name="four">
        <ByUser />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from '@/mixins/common'
import ByDetails from '@/views/PurchaseAndSale/Report/components/CostChecking/ByDetails.vue'
import ByTarget from '@/views/PurchaseAndSale/Report/components/CostChecking/ByTarget.vue'
import ByType from '@/views/PurchaseAndSale/Report/components/CostChecking/ByType.vue'
import ByUser from '@/views/PurchaseAndSale/Report/components/CostChecking/ByUser.vue'
export default {
  name: 'CostChecking',
  components: { ByType, ByDetails, ByTarget, ByUser },
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
