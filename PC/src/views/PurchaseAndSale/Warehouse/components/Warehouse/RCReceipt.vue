<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.id" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-cascader
        v-model="selectedOptions"
        :options="targetOption"
        style="margin:0 10px 10px 0"
        size="mini"
        placeholder="请选择来往单位"
        filterable
        clearable
      />
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
        v-model="selectArr"
        :is-select="true"
        :data="orderStorageList"
        :pagination-data="paginationData"
        @paginationChange="getOrderStorageData"
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
              @click.native.prevent="getHandle(scope.$index,scope.row)"
            >
              收货
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="redRow(scope.$index,scope.row)"
            >
              红冲
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
  </div>
</template>

<script>
import common from '@/mixins/common'
import {
  getOrderStorage,
  postRedDashed,
  getSellResultDetails,
  postStorage,
  getSellApplyDetails,
  getProcurementApplyDetails
} from '@/service/PurchaseAndSale/Warehouse/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import {
  getSuppliers, getClients
} from '@/service/PurchaseAndSale/common'
import { statusMap } from '../../../config'
import { parseTime } from '@/utils'

export default {
  name: 'RCReceipt',
  components: { SelectTable },
  mixins: [common],
  data() {
    return {
      filterData: {
      },
      pickTime: '',
      targetOption: [
        {
          value: 'kehu',
          label: '客户',
          children: []
        },
        {
          value: 'gongyingshang',
          label: '供应商',
          children: []
        }
      ],
      selectedOptions: [],
      suppliersList: [],
      orderStorageList: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      selectArr: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSuppliersFun()
    this.getOrderStorageData()
    this.getClientsFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getOrderStorageData()
    },
    getSuppliersFun() {
      const params = {
        storeId: this.storeId
      }
      getSuppliers(params).then(res => {
        this.suppliersList = res.data.data
        const _suppliersList = []
        this.suppliersList.forEach(v => {
          const _data = {
            value: v.name,
            label: v.name
          }
          _suppliersList.push(_data)
        })
        this.targetOption[1].children = _suppliersList
      })
    },
    getClientsFun() {
      const params = {
        disabled: 0
      }
      getClients(params).then(res => {
        const data = res.data.data
        const _clientsList = []
        data.forEach(v => {
          const _data = {
            value: v.name,
            label: v.name + '--' + v.username
          }
          _clientsList.push(_data)
        })
        this.targetOption[0].children = _clientsList
      })
    },
    getOrderStorageData() {
      if (!this.filterData.id) {
        delete this.filterData.id
      }
      if (this.selectedOptions.length > 0) {
        this.filterData.targetName = this.selectedOptions[1]
      } else {
        delete this.filterData.targetName
      }
      this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
      this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      const path = '2'
      getOrderStorage(params, path).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          item.orderStatus = statusMap[item.orderStatus]
        })
        this.orderStorageList = data
        this.paginationData = data.pageVo
      })
    },
    deleteRow(index, row, more) {
    },
    getHandle(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      let orderDetail = {}
      let func = ''
      let _type = ''
      let _detailType = ''
      if (row.typeName === '销售退货申请单' || row.typeName === '销售换货申请单') {
        func = getSellApplyDetails
        _type = '2'
        _detailType = '1'
      } else {
        func = getProcurementApplyDetails
        _type = '4'
        _detailType = '0'
      }
      func(params, path).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '获取来源订单失败',
            type: 'error'
          })
          return
        }
        orderDetail = res.data.data
      })
      this.$prompt('此操作将确认收货, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '可以输入备注'
      }).then((value) => {
        const params = {
          sellApplyOrderVo: {}
        }
        params.remark = value.value ? value.value : ''
        params.applyOrderId = orderDetail.id
        params.quantity = orderDetail.inNotReceivedQuantity
        params.storeId = this.storeId
        params.userId = this.userId
        params.type = _type
        const _details = []
        orderDetail.details.forEach(v => {
          const _detail = {}
          _detail.changeQuantity = v.quantity
          _detail.goodsSkuId = v.goodsSkuId
          _detail.id = v.id
          _detail.type = _detailType
          _details.push(_detail)
        })
        params.sellApplyOrderVo.details = _details
        postStorage(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '收货失败',
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '收货成功',
            type: 'success'
          })
          this.getOrderStorageData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    redRow(index, row) {
      const params = {
        storeId: this.storeId,
        id: row.id,
        userId: this.userId
      }
      this.$prompt('此操作将红冲此订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '可以输入备注'
      }).then((value) => {
        if (value.value) {
          params.remark = value.value
        }
        postRedDashed(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '红冲失败',
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '红冲成功',
            type: 'success'
          })
          this.getOrderStorageData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
