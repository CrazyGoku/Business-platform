<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="当前库存" name="first">
        <CurrentInventory />
      </el-tab-pane>
      <el-tab-pane label="按属性" name="second">
        <ByAttributes />
      </el-tab-pane>
      <el-tab-pane label="按仓库" name="three">
        <ByWarehouse />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import common from '@/mixins/common'
    import ByAttributes from '@/views/PurchaseAndSale/Report/components/SearchStock/ByAttributes.vue'
    import ByWarehouse from '@/views/PurchaseAndSale/Report/components/SearchStock/ByWarehouse.vue'
    import CurrentInventory from '@/views/PurchaseAndSale/Report/components/SearchStock/CurrentInventory.vue'
    export default {
        name: "SearchStock",
        mixins: [common],
      components: { CurrentInventory, ByAttributes,ByWarehouse },
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
