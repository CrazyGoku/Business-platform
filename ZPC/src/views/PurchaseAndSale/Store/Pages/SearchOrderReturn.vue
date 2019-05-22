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
        v-model="filterData.type"
        clearable
        size="mini"
        filterable
        placeholder="请选择订单类型"
      >
        <el-option
          label="退款"
          value="1"
        />
        <el-option
          label="退货退款"
          value="2"
        />
        <el-option
          label="换货"
          value="3"
        />
      </el-select>
      <el-select
        v-model="filterData.orderStatus"
        clearable
        size="mini"
        filterable
        placeholder="请选择订单状态"
      >
        <el-option
          label="客户申请"
          value="1"
        />
        <el-option
          label="审核通过"
          value="2"
        />
        <el-option
          label="审核不通过"
          value="3"
        />
        <el-option
          label="审核通过"
          value="4"
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
              @click.native.prevent="putRow(scope.$index,scope.row)"
            >
              审核订单
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="finishRow(scope.$index,scope.row)"
            >
              退款成功
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="审核订单"
      width="60%"
    >
      <div class="dialog-content-input">
        <el-select
          v-model="putDetail.orderStatus"
          size="mini"
          filterable
          placeholder="请选择状态"
        >
          <el-option
            label="通过"
            value="2"
          />
          <el-option
            label="不通过"
            value="3"
          />
        </el-select>

        <el-input v-model="putDetail.auditRemark" placeholder="请输入备注" size="mini">
          <template slot="prepend">
            备注
          </template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import common from '@/mixins/common'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { parseTime } from '@/utils'
import { getMallOrderReturn, putOrderReturnAudit, putOrderReturnFinish } from '@/service/PurchaseAndSale/Store/common'
export default {
  name: 'SearchOrderReturn',
  components: { SelectTable },
  mixins: [common],
  data() {
    return {
      filterData: {},
      pickTime: '',
      orderList: [],
      dialogVisible: false,
      putDetail: {},
      choiceDetail: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getOrderData()
  },
  methods: {
    finishRow(index, row) {
      this.$confirm('确定退款成功完成售后, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          storeId: this.storeId,
          id: row.id
        }
        putOrderReturnFinish(data).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: res.data.detail,
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '完成操作',
            type: 'success'
          })
          this.getOrderData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    confirmHandle() {
      const data = {
        storeId: this.storeId,
        id: this.choiceDetail.id,
        ...this.putDetail
      }
      if (data.orderStatus == 3 && (!data.auditRemark || data.auditRemark == '')) {
        this.$message('订单不通过必填不通过原因')
        return
      }
      putOrderReturnAudit(data).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: res.data.detail,
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '审核完成',
          type: 'success'
        })
        this.dialogVisible = false
        this.getOrderData()
      })
    },
    putRow(index, row) {
      this.putDetail = {}
      this.choiceDetail = row
      this.dialogVisible = true
    },
    searchBtn() {
      this.paginationData.page = 1
      this.getOrderData()
    },
    getOrderData() {
      const typeMap = {
        1: '退款',
        2: '退货退款',
        3: '换货'
      }
      const orderMap = {
        1: '客户申请',
        2: '审核通过',
        3: '审核不通过',
        4: '退款成功'
      }
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
      getMallOrderReturn(params).then(res => {
        const data = res.data.data
        data.items.map(v => {
          v.type = typeMap[v.type]
          v.orderStatus = orderMap[v.orderStatus]
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
