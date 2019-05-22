<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="按账户" name="first">
        <ByBankAccount />
      </el-tab-pane>
      <el-tab-pane label="按职员" name="second">
        <ByUser />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from '@/mixins/common'
import ByBankAccount from '@/views/PurchaseAndSale/Report/components/MoneyCollected/ByBankAccount.vue'
import ByUser from '@/views/PurchaseAndSale/Report/components/MoneyCollected/ByUser.vue'
export default {
  name: 'MoneyCollected',
  components: { ByBankAccount, ByUser },
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
