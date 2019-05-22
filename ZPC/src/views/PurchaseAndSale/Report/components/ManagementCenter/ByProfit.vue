<template>
  <div>
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
        <el-button type="primary" size="mini" @click="searchBtn">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        :data="manageList"
        :pagination-data="paginationData"
        @paginationChange="getManageList"
      />
    </div>
  </div>
</template>

<script>
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import common from '@/mixins/common'
import { getReportManageByProfit } from '@/service/PurchaseAndSale/Report/ManagementCenter.js'
import { parseTime } from '@/utils'
export default {

  name: 'ByProfit',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      filterData: {},
      pickTime: [],
      manageList: [],
      paginationData: {
        page: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getManageList()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getManageList()
    },
    getManageList() {
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
      getReportManageByProfit(params).then(res => {
        this.manageList = res.data.data
        this.paginationData = res.data.data.pageVo
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
