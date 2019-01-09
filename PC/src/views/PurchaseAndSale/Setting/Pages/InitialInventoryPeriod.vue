<template>
  <div>
    <div class="search-bar">
      <el-select
        v-model="filterData.warehousesId"
        clearable
        size="mini"
        placeholder="请选择仓库名"
      >
        <el-option
          v-for="item in warehousesList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="getStockByWarehouseFun">
          查询
        </el-button>
      </div>
    </div>
    <select-table
      :data="earlyStageList"
      :pagination-data="paginationData"
      @paginationChange="getStockByWarehouseFun"
    >
      <el-table-column
        slot="handle"
        :fixed="true"
        label="操作"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.openingMoney>0"
            type="text"
            size="small"
            @click.native.prevent="editRow(scope.$index,scope.row)"
          >
            设置初期
          </el-button>
        </template>
      </el-table-column>
    </select-table>
    <el-dialog
      :visible.sync="dialogVisible"
      title="修改初期"
      width="60%"
    >
      <div class="dialog-content-input">
        <el-input v-model="opening.quantity" placeholder="请输入期初数量" size="mini" @input="opening.totalMoney = opening.quantity*opening.money.toFixed(2)">
          <template slot="prepend">
            期初数量
          </template>
        </el-input>
        <el-input v-model="opening.money" placeholder="请输入期初成本价格" size="mini" @input="opening.totalMoney = opening.quantity*opening.money.toFixed(2)">
          <template slot="prepend">
            期初成本价格
          </template>
        </el-input>
        <el-input v-model="opening.totalMoney" :disabled="true" placeholder="请输入期初金额" size="mini">
          <template slot="prepend">
            期初金额
          </template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHandle">
          取 消
        </el-button>
        <el-button type="primary" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWarehouses, getStockByWarehouse } from '@/service/PurchaseAndSale/Setting/common.js'
import { putInventoryOpening } from '@/service/PurchaseAndSale/Setting/InitialInventoryPeriod.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件

import common from '@/mixins/common'

export default {
  name: 'InitialInventoryPeriod',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      warehousesList: [],
      filterData: {
        warehousesId: ''
      },
      earlyStageList: [],
      dialogVisible: false,
      opening: {
        quantity: '',
        money: '',
        totalMoney: '',
        goodsSkuId: ''
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getWarehousesFun()
  },
  methods: {
    getWarehousesFun() {
      const params = {
        storeId: this.storeId
      }
      getWarehouses(params).then(res => {
        this.warehousesList = res.data.data
        this.filterData.warehousesId = this.warehousesList[0].id
        this.getStockByWarehouseFun()
      })
    },
    getStockByWarehouseFun() {
      const params = {
        storeId: this.storeId,
        flag: 4,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        warehouseId: this.filterData.warehousesId
      }
      getStockByWarehouse(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
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
        this.earlyStageList = data
        this.paginationData = res.data.pageVo
      })
    },
    editRow(index, row) {
      this.opening.quantity = row.openingQuantity
      this.opening.money = row.openingMoney
      this.opening.totalMoney = row.openingTotalMoney
      this.opening.goodsSkuId = row.goodsSkuId
      this.dialogVisible = true
    },
    cancelHandle() {
      this.opening = {
        quantity: '',
        money: '',
        totalMoney: ''
      }
      this.dialogVisible = false
    },
    confirmHandle() {
      if (this.opening.money < 0) {
        this.$message({
          message: '初期成本金额不能小于0',
          type: 'warning'
        })
        return
      }
      if (this.opening.quantity < 0) {
        this.$message({
          message: '初期数量不能小于0',
          type: 'warning'
        })
        return
      }
      const params = {
        storeId: this.storeId,
        warehouseId: this.filterData.warehousesId,
        goodsSkuId: this.opening.goodsSkuId,
        openingQuantity: this.opening.quantity,
        openingMoney: this.opening.money,
        openingTotalMoney: this.opening.totalMoney,
        userId: this.userId
      }
      putInventoryOpening(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '修改失败，请稍后重试',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        this.getStockByWarehouseFun()
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
