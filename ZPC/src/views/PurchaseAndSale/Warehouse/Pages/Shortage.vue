<template>
  <div>
    <div class="search-bar">
      <el-select
        v-model="filterData.warehouseId"
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

      <el-select
        v-model="filterData.typeId"
        clearable
        size="mini"
        filterable
        placeholder="请选择商品分类"
      >
        <el-option
          v-for="item in commodityTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-input v-model="filterData.id" placeholder="商品货号" size="mini">
        <template slot="prepend">
          商品货号
        </template>
      </el-input>
      <el-input v-model="filterData.name" placeholder="商品名" size="mini">
        <template slot="prepend">
          商品名
        </template>
      </el-input>
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
    />
  </div>
</template>

<script>
import { getWarehouses, getStockByWarehouse } from '@/service/PurchaseAndSale/Setting/common.js'
import { putInventoryOpening } from '@/service/PurchaseAndSale/Setting/InitialInventoryPeriod.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件

import common from '@/mixins/common'
import commodityTypeList from '@/mixins/commodityTypeList.js'
export default {
  name: 'InitialInventoryPeriod',
  components: {
    SelectTable
  },
  mixins: [common, commodityTypeList],
  data() {
    return {
      warehousesList: [],
      filterData: {
        warehouseId: ''
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
  watch: {
    opening: {
      deep: true,
      handler(val) {
        val.totalMoney = (val.money * val.quantity).toFixed(2)
      }
    }
  },
  mounted() {
    this.getWarehousesFun()
    this.getStockByWarehouseFun()
  },
  methods: {
    getWarehousesFun() {
      const params = {
        storeId: this.storeId
      }
      getWarehouses(params).then(res => {
        this.warehousesList = res.data.data
      })
    },
    getStockByWarehouseFun() {
      const params = {
        storeId: this.storeId,
        flag: 3,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
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

        this.paginationData = data.pageVo
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
      const params = {
        storeId: this.storeId,
        warehouseId: this.filterData.warehouseId,
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
            message: res.data.message,
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
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
