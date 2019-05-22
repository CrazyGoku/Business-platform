<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.goodsId" placeholder="商品货号" size="mini">
        <template slot="prepend">
          商品货号
        </template>
      </el-input>
      <el-input v-model="filterData.goodsName" placeholder="商品名" size="mini">
        <template slot="prepend">
          商品名
        </template>
      </el-input>
      <el-input v-model="filterData.goodsBarCode" placeholder="条码" size="mini">
        <template slot="prepend">
          条码
        </template>
      </el-input>
      <el-select
        v-model="filterData.goodsTypeId"
        size="mini"
        clearable
        filterable
        placeholder="请选择商品分类"
        @clear="searchBtn"
      >
        <el-option
          v-for="item in commodityTypeList"
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
        :data="sellList"
        :pagination-data="paginationData"
        @paginationChange="getSellList"
      />
    </div>
  </div>
</template>

<script>
import common from '@/mixins/common'
import { getReportSellByGoods } from '@/service/PurchaseAndSale/Report/SalesReport.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import commodityTypeList from '@/mixins/commodityTypeList.js'
import { parseTime } from '@/utils'
export default {
  name: 'ByGoods',
  components: { SelectTable },
  mixins: [common, commodityTypeList],
  data() {
    return {
      filterData: {},
      pickTime: [],
      sellList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSellList()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getSellList()
    },
    getSellList() {
      if (this.pickTime === null || this.pickTime.length === 0) {
        this.pickTime = [new Date(), new Date()]
      }
      this.filterData.startTime = this.pickTime.length !== 0 ? parseTime(this.pickTime[0]) : parseTime(new Date())
      this.filterData.endTime = this.pickTime.length !== 0 ? parseTime(this.pickTime[1]) : parseTime(new Date())
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getReportSellByGoods(params).then(res => {
        this.sellList = res.data.data
        this.paginationData = res.data.data.pageVo
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
