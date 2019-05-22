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
        :data="fundList"
        :pagination-data="paginationData"
        @paginationChange="getFundList"
      />
    </div>
  </div>
</template>

<script>
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import common from '@/mixins/common'
import { getFundCheck } from '@/service/PurchaseAndSale/Report/CheckingFunds.js'
import { parseTime } from '@/utils'
export default {

  name: 'Flow',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      filterData: {},
      pickTime: [],
      fundList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getFundList()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getFundList()
    },
    getFundList() {
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
      getFundCheck(params).then(res => {
        this.fundList = res.data.data
        this.paginationData = res.data.data.pageVo
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
