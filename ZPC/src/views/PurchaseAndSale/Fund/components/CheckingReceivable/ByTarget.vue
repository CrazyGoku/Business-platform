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
      <el-input v-model="filterData.targetPhone" placeholder="电话" size="mini">
        <template slot="prepend">
          电话
        </template>
      </el-input>
      <el-input v-model="filterData.targetId" placeholder="单位编号" size="mini">
        <template slot="prepend">
          电话
        </template>
      </el-input>
      <el-select
        v-model="filterData.targetName"
        clearable
        size="mini"
        filterable
        placeholder="请选择供应商名"
      >
        <el-option
          v-for="item in supplierList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
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
              @click.native.prevent="readRow(scope.$index,scope.row)"
            >
              对账到单据
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false" title="对账到单据">
      <div class="search-bar">
        <el-date-picker
          v-model="pickTime2"
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
          <el-button type="primary" size="mini" @click="searchBtn2">
            查询
          </el-button>
        </div>
      </div>
      <div class="flex-center">
        <select-table
          :data="needFundList2"
          :pagination-data="paginationData2"
          @paginationChange="readRow"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import common from '@/mixins/common'
import supplierList from '@/mixins/supplierList.js'
import { getFundNeedOutByTarget, getFundNeedOutByTargetOrder } from '@/service/PurchaseAndSale/Fund/CheckingReceivable.js'
import { parseTime } from '@/utils'
export default {

  name: 'ByTarget',
  components: {
    SelectTable
  },
  mixins: [common,
    supplierList],
  data() {
    return {
      filterData: {},
      filterData2: {},
      pickTime: [],
      pickTime2: [],
      needFundList: [],
      needFundList2: [],
      dialogVisible: false,
      choiceDetail: {},
      paginationData2: {
        page: 1,
        pageSize: 10
      }
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
    searchBtn2() {
      this.paginationData2.page = 1
      this.readRow()
    },
    readRow(index, row) {
      if (row) {
        this.choiceDetail = row
      }
      if (this.pickTime2 === null || this.pickTime2.length === 0) {
        this.pickTime2 = [new Date(), new Date()]
      }
      this.filterData2.startTime = this.pickTime2.length !== 0 ? parseTime(this.pickTime2[0]) : parseTime(new Date())
      this.filterData2.endTime = this.pickTime2.length !== 0 ? parseTime(this.pickTime2[1]) : parseTime(new Date())
      const params = {
        storeId: this.storeId,
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize,
        targetId: this.choiceDetail.targetId,
        ...this.filterData2
      }
      getFundNeedOutByTargetOrder(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message.error(res.data.message)
        }

        this.needFundList2 = res.data.data
        this.paginationData2 = res.data.data.pageVo
        this.dialogVisible = true
      })
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
      getFundNeedOutByTarget(params).then(res => {
        this.needFundList = res.data.data
        this.paginationData = res.data.data.pageVo
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
