<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="资金余额" name="first">
        <Balance />
      </el-tab-pane>
      <el-tab-pane label="资金流水" name="second">
        <Flow />
      </el-tab-pane>
      <el-tab-pane label="资金对账" name="three">
        <Reconciliation />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import common from '@/mixins/common'
  import Balance from '@/views/PurchaseAndSale/Report/components/CheckingFunds/Balance.vue'
  import Reconciliation from '@/views/PurchaseAndSale/Report/components/CheckingFunds/Reconciliation.vue'
  import Flow from '@/views/PurchaseAndSale/Report/components/CheckingFunds/Flow.vue'
  export default {
    name: "CheckingFunds",
    mixins: [common],
    components: { Balance,Flow,Reconciliation },
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
