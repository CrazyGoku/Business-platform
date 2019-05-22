<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.clientId" placeholder="请输入客户编号" size="mini">
        <template slot="prepend">
          客户编号
        </template>
      </el-input>
      <el-input v-model="filterData.clientName" placeholder="请输入客户名称" size="mini">
        <template slot="prepend">
          客户名称
        </template>
      </el-input>
      <el-input v-model="filterData.goodsId" placeholder="请输入商品货号" size="mini">
        <template slot="prepend">
          商品货号
        </template>
      </el-input>
      <el-input v-model="filterData.goodsName" placeholder="请输入商品名称" size="mini">
        <template slot="prepend">
          商品名称
        </template>
      </el-input>
      <el-select
        v-model="filterData.orderStatus"
        clearable
        size="mini"
        filterable
        placeholder="请选择订单状态"
      >
        <el-option
          label="待付款"
          value="1"
        />
        <el-option
          label="待发货"
          value="2"
        />
        <el-option
          label="待收货"
          value="3"
        />
        <el-option
          label="待评价"
          value="4"
        />
        <el-option
          label="已完成"
          value="5"
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
        :data="orderList"
        :pagination-data="paginationData"
        @paginationChange="getOrderData"
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
              查看详情
            </el-button>
            <el-button
              v-if="scope.row.levelId === defaultLevel && scope.row.totalSpecialMoney>388 "
              type="text"
              size="small"
              @click.native.prevent="changeClientLevel(scope.$index,scope.row)"
            >
              修改等级
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      title="等级修改"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div class="dialog-content-input">
        <el-select
          v-model="choiceRow.levelId"
          clearable
          size="mini"
          filterable
          placeholder="修改用户等级"
        >
          <el-option
            v-for="item in levelsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="confirm">
          修改
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/mixins/common'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { parseTime } from '@/utils'
import { getMallOrder } from '@/service/PurchaseAndSale/Store/common'
import { getSystem } from '../../../../service/common'
import levelsList from '@/mixins/levelsList.js'
import { putClient } from '../../../../service/PurchaseAndSale/Store/common'

export default {
  name: 'SearchOrder',
  components: { SelectTable },
  mixins: [common, levelsList],
  data() {
    return {
      filterData: {},
      dialogVisible: false,
      pickTime: '',
      orderList: [],
      defaultLevel: '',
      choiceRow: '',
      orderType: {
        1: '待付款',
        2: '待发货',
        3: '待收获',
        4: '待评价',
        5: '已完成'
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getOrderData()
    getSystem().then(res => {
      this.defaultLevel = res.data.data.defaultLevelId
    })
  },
  methods: {
    readRow() {},
    changeClientLevel(index, row) {
      this.choiceRow = row
      this.dialogVisible = true
    },
    searchBtn() {
      this.paginationData.page = 1
      this.getOrderData()
    },
    confirm() {
      const data = {
        storeId: this.storeId,
        id: this.choiceRow.clientId,
        levelId: this.choiceRow.levelId
      }

      putClient(data).then(res => {
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
        this.dialogVisible = false
        this.getOrderData()
      })
    },
    getOrderData() {
      if (!this.filterData.clientId) {
        delete this.filterData.clientId
      }
      this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
      this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getMallOrder(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.orderStatus = this.orderType[v.orderStatus]
        })
        this.orderList = data
        this.paginationData = data.pageVo
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
