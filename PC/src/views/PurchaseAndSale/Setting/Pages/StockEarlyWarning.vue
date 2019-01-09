<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addBtn"
      >
        添加
      </el-button>
    </div>
    <div class="search-bar">
      <el-select
        v-model="filterData.warehouseId"
        clearable
        size="mini"
        placeholder="请选择仓库"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchHandle">
          查询
        </el-button>
      </div>
    </div>

    <div class="flex-center">
      <select-table
        :data="inventoryWarningList"
        :pagination-data="paginationData"
        @paginationChange="getInventoryWarningFun"
      >
        <el-table-column
          slot="handle"
          :fixed="true"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <!--<el-button-->
            <!--type="text"-->
            <!--size="small"-->
            <!--@click.native.prevent="deleteRow(scope.$index,scope.row,false)"-->
            <!--&gt;-->
            <!--删除-->
            <!--</el-button>-->
            <el-button
              type="text"
              size="small"
              @click.native.prevent="redRow(scope.$index,scope.row)"
            >
              红冲
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="readRow(scope.$index,scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
  </div>
</template>

<script>
import common from '@/mixins/common'
import { getInventoryWarning } from '@/service/PurchaseAndSale/Setting/StockEarlyWarning.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import warehouseList from '@/mixins/warehouseList.js'

export default {
  name: 'StockEarlyWarning',
  components: { SelectTable },
  mixins: [common, warehouseList],
  data() {
    return {
      inventoryWarningList: [],
      filterData: {
        warehouseId: ''
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getInventoryWarningFun()
  },
  methods: {
    searchHandle() {
      this.paginationData.page = 1
      this.getInventoryWarningFun()
    },
    addBtn() {

    },
    getInventoryWarningFun() {
      const params = {
        storeId: this.storeId,
        flag: 2,
        warehouseId: this.filterData.warehouseId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      getInventoryWarning(params).then(res => {
        const data = res.data.data
        this.inventoryWarningList = data
        this.paginationData = data.pageVo
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
