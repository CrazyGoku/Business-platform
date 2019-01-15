<template>
  <div>
    <div class="search-bar">
      <el-date-picker
        v-model="pickTime"
        style="width: 200px"
        type="date"
        size="mini"
        placeholder="选择日期"
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
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import common from '@/mixins/common'
import { getReportSellByDay } from '@/service/PurchaseAndSale/Report/SalesReport.js'
import { parseTime } from '@/utils'
export default {

  name: 'ByDay',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      filterData: {},
      pickTime: '',
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
      if (!this.pickTime) {
        this.pickTime = new Date()
      }
      this.filterData.createTime = parseTime(this.pickTime, '{y}-{m}-{d}')
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getReportSellByDay(params).then(res => {
        this.sellList = res.data.data
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
