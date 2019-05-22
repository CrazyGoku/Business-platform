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
      <el-input v-model="filterData.drawResult" placeholder="请输入抽奖结果" size="mini">
        <template slot="prepend">
          抽奖结果
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
        v-model="filterData.status"
        clearable
        size="mini"
        filterable
        placeholder="请选择发奖状态"
      >
        <el-option
          label="未发奖"
          value="0"
        />
        <el-option
          label="已发奖"
          value="1"
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
        start-placeholder="开始时间"
        end-placeholder="结束时间"
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
              @click.native.prevent="putRow(scope.row,scope.$index)"
            >
              确定发奖
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
  </div>
</template>
s
<script>
import common from '@/mixins/common'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { parseTime } from '@/utils'
import { getMallIntegralDraw, putMallIntegralDraw } from '@/service/PurchaseAndSale/Store/common'
export default {
  name: 'DrawHistory',
  components: { SelectTable },
  mixins: [common],
  data() {
    return {
      filterData: {},
      pickTime: '',
      orderList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getOrderData()
  },
  methods: {
    putRow(row, index) {
      this.$prompt('请输入备注', '确认发奖', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const data = {
          id: row.id,
          userId: this.userId,
          remark: value
        }
        putMallIntegralDraw(data).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '发奖失败',
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '发奖成功',
            type: 'success'
          })
          this.getOrderData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消发奖'
        })
      })
    },
    searchBtn() {
      this.paginationData.page = 1
      this.getOrderData()
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
      getMallIntegralDraw(params).then(res => {
        const data = res.data.data
        this.orderList = data
        this.paginationData = data.pageVo
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
