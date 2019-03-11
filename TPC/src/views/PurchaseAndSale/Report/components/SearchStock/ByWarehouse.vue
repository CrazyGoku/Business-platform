<template>
  <div>
    <div class="search-bar">
      <el-input @clear="getStorageInventoryWarehouseFun" clearable v-model="filterData.goodsId" placeholder='商品货号'
                size="mini">
        <template slot="prepend">商品货号</template>
      </el-input>
      <el-input @clear="getStorageInventoryWarehouseFun" clearable v-model="filterData.name" placeholder='商品名称'
                size="mini">
        <template slot="prepend">商品名称</template>
      </el-input>
      <el-select
        v-model="filterData.warehouseId"
        clearable
        @clear="getStorageInventoryWarehouseFun"
        size="mini"
        placeholder="仓库"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filterData.typeId"
        clearable
        @clear="getStorageInventoryWarehouseFun"
        size="mini"
        placeholder="商品类型"
      >
        <el-option
          v-for="item in commodityTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchFun">查询</el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table :data="inventoryList" :pagination-data="paginationData"
                    @paginationChange="getStorageInventoryWarehouseFun"
      >
        <el-table-column
          slot="handle"
          :fixed="true"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="reconciliation(scope.$index,scope.row)"
            >
              对账
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false" title="规格仓库对账"
               :visible.sync="dialogVisible"
               width="80%">

      <div class="search-bar">
        <el-date-picker
          v-model="pickTime"
          :picker-options="pickerOptions"
          type="daterange"
          align="right"
          unlink-panels
          size="mini"
          range-separator="至"
          start-placeholder="单据日期（起）"
          end-placeholder="单据日期（止）"
        />
        <div style="width: 20px;">
          <el-button type="primary" size="mini" @click="getStorageInventoryWarehouseCheckFun">
            查询
          </el-button>
        </div>
      </div>
      <select-table :data="checkList" :pagination-data="paginationData2"
                    @paginationChange="getStorageInventoryWarehouseCheckFun"
      >
      </select-table>
      
      <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import common from '@/mixins/common'
  import {
    getStorageInventoryWarehouse,
    getStorageInventoryWarehouseCheck
  } from '@/service/PurchaseAndSale/Report/SearchStock.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import commodityTypeList from '@/mixins/commodityTypeList.js'
  import warehouseList from '@/mixins/warehouseList.js'

  export default {
    name: "ByWarehouse",
    components: {SelectTable},
    mixins: [common, commodityTypeList, warehouseList],
    data() {
      return {
        filterData: {
          goodsId: '',
          pickTime: '',
          supplier: '',
          warehouseId: ''
        },
        inventoryList: [],
        paginationData2: {
          page: 1,
          pageSize: 10
        },
        filterData2: {},
        pickTime: '',
        choiceRow: {},
        checkList:[],
        dialogVisible:false
      }
    },
    mounted() {
      this.getStorageInventoryWarehouseFun()
    },
    methods: {
      getStorageInventoryWarehouseFun() {
        let params = {
          flag: 0,
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        getStorageInventoryWarehouse(params).then(res => {
          let data = res.data.data
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
          this.inventoryList = data
          this.paginationData = data.pageVo
        })
      },
      searchFun() {
        this.paginationData.page = 1
        this.getStorageInventoryWarehouseFun()
      },
      getStorageInventoryWarehouseCheckFun() {

        this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
        this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
        let params = {
          storeId: this.storeId,
          goodsSkuId: this.choiceRow.goodsSkuId,
          warehouseId: this.choiceRow.warehouseId,
          page: this.paginationData2.page,
          pageSize: this.paginationData2.pageSize,
          ...this.filterData2
        }
        getStorageInventoryWarehouseCheck(params).then(res => {
          let data = res.data.data
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
          this.checkList = data
          this.paginationData2 = data.pageVo
        })
      },
      reconciliation(index, row) {

        this.choiceRow = row
        this.paginationData2.page = 1
        this.dialogVisible = true
        this.getStorageInventoryWarehouseCheckFun()
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang='scss' scoped>

</style>
