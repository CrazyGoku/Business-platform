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
        :data="needFundList"
        :pagination-data="paginationData"
        @paginationChange="getNeedFundList"
      />
    </div>
  </div>
</template>

<script>
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import common from '@/mixins/common'
import { getFundNeedInByUser } from '@/service/PurchaseAndSale/Fund/CheckCope.js'
import { parseTime } from '@/utils'
export default {

  name: 'ByUser',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      filterData: {},
      pickTime: [],
      needFundList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getNeedFundList()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getNeedFundList()
    },
    getNeedFundList() {
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
      getFundNeedInByUser(params).then(res => {
        this.needFundList = res.data.data
        this.paginationData = res.data.data.pageVo
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
