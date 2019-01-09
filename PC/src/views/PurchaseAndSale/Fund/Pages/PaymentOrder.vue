<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addBtn"
      >
        添加
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.orderId" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-select
        v-model="filterData.supplier"
        clearable
        size="mini"
        placeholder="请选择供应商名"
      >
        <el-option
          v-for="item in suppliersList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-date-picker
        v-model="filterData.pickTime"
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
        <el-button type="primary" size="mini">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        v-model="selectArr"
        :is-select="true"
        :data="orderFundList"
        :pagination-data="paginationData"
        @paginationChange="getOrderFundData"
      >
        <el-table-column
          slot="handle"
          :fixed="true"
          label="操作"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
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
import { getSuppliers, getOrderFund, postRedDashed } from '@/service/PurchaseAndSale/Fund/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件

export default {
  name: 'PaymentOrder',
  components: { SelectTable },
  mixins: [common],
  data() {
    return {
      filterData: {
        orderId: '',
        pickTime: '',
        supplier: ''
      },
      suppliersList: [],
      orderFundList: [],
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
    this.getSuppliersData()
    this.getOrderFundData()
  },
  methods: {
    getSuppliersData() {
      const params = {
        storeId: this.storeId
      }
      getSuppliers(params).then(res => {
        this.suppliersList = res.data.data
      })
    },
    getOrderFundData() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      const path = '2'
      getOrderFund(params, path).then(res => {
        const data = res.data.data
        this.orderFundList = data
        this.paginationData = data.pageVo
      })
    },
    deleteRow(index, row, more) {
    },
    editRow(index, row) {
    },
    redRow(index, row) {
      const params = {
        storeId: this.storeId,
        id: row.id,
        userId: this.userId
      }
      this.$prompt('此操作将红冲此单, 是否继续?', '提示', {
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
          this.getOrderFundData()
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
