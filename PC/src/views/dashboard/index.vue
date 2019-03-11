<template>
  <div class="warrap">
    <p>库存预警</p>
    <el-table
      :data="warningList"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="商品名称"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sku"
        label="商品规格"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="realInventory"
        label="实际库存"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="inventoryUpperLimit"
        align="center"
        width="100"
        label="库存上限">
      </el-table-column>
      <el-table-column
        prop="inventoryLowLimit"
        align="center"
        width="100"
        label="库存下限">
      </el-table-column>
      <el-table-column
        prop="remark"
        align="center"
        width="180"
        label="说明">
      </el-table-column>
    </el-table>

    <el-dialog
      title="库存预警"
      :visible.sync="dialogVisible"
      width="80%">
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { StockEarlyWarning } from '@/service/PurchaseAndSale/common.js'
import warehouseList from '@/mixins/warehouseList.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      currentRole: 'adminDashboard',

      warningList: [],
      dialogVisible:false
    }
  },
  mounted(){
    this.StockEarlyWarningFun()
  },
  methods:{
    StockEarlyWarningFun(warehouseId) {
      this.warningList = []
      const params = {
        storeId: this.$store.getters.storeId,
        flag: 2,
        page: 1,
        pageSize: 10,
        warehouseId
      }
      StockEarlyWarning(params).then(res => {
        this.warningList = res.data.data.items
        if(this.warningList.length>0){
          this.warningList.forEach(v => {
            v.sku = eval(v.sku)
            let sku = ''
            v.sku.forEach((item, index) => {
              let _sku = ''
              if (v.sku.length === index + 1) {
                _sku = item.key + ':' + item.value
              } else {
                _sku = item.key + ':' + item.value + ','
              }
              sku += _sku
            })
            v.sku = sku
          })
        }
      })
    }

  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
