<template>
  <div>
    <div class="search-bar">
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
      <el-input v-model="filterData.barCode" placeholder="条码" size="mini">
        <template slot="prepend">
          条码
        </template>
      </el-input>
      <el-select
        v-model="filterData.warehouseId	"
        size="mini"
        clearable
        placeholder="请选择仓库"
        @clear="searchBtn"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
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
        <el-button type="primary" size="mini" @click="searchBtn">
          查询
        </el-button>
      </div>
    </div>

    <div class="flex-center">
      <select-table
        :data="inventoryList"
        :pagination-data="paginationData"
        @paginationChange="getInventoryList"
      >
      </select-table>
    </div>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import {getReportInventoryAnalysisByGoodsWarehouse} from '@/service/PurchaseAndSale/Report/InventoryAnalysis.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import warehouseList from '@/mixins/warehouseList.js'
  import { parseTime } from '@/utils'
  export default {
    name: 'CommodityWarehouse',
    components: { SelectTable },
    mixins: [common,warehouseList],
    data() {
      return {
        filterData: {},
        pickTime: [],
        inventoryList: []
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getInventoryList()
    },
    methods: {
      searchBtn() {
        this.paginationData.page = 1
        this.getInventoryList()
      },
      getInventoryList(){
        if(this.pickTime===null || this.pickTime.length===0 ){
          this.pickTime = [new Date(),new Date()]
        }
        this.filterData.startTime = this.pickTime.length!==0 ? parseTime(this.pickTime[0]) : parseTime(new Date())
        this.filterData.endTime = this.pickTime.length!==0 ? parseTime(this.pickTime[1]) : parseTime(new Date())
        let params = {
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        getReportInventoryAnalysisByGoodsWarehouse(params).then(res=>{
          this.inventoryList = res.data.data
          this.paginationData = res.data.data.pageVo
        })
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
