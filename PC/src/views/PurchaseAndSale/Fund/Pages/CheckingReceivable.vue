<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="按往来单位" name="first">
        <ByTarget />
      </el-tab-pane>
      <el-tab-pane label="职员部门应收款" name="second">
        <ByUser />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import common from '@/mixins/common'
  import ByTarget from '@/views/PurchaseAndSale/Fund/components/CheckingReceivable/ByTarget.vue'
  import ByUser from '@/views/PurchaseAndSale/Fund/components/CheckingReceivable/ByUser.vue'
  export default {
    name: "CheckingReceivable",
    mixins: [common],
    components: { ByTarget,ByUser },
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
