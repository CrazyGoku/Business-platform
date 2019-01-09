<template>
  <div>
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
              @click.native.prevent="deleteRow(scope.$index,scope.row,false)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="postHandle(scope.$index,scope.row)"
            >
              发货
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
    <el-dialog :visible.sync="addDialog" title="发货">
      <p>未结算金额:{{ payParams.notClearedMoney }}</p>
      <p>预付款金额:{{ fundAdvance }}</p>
      <div class="dialog-content-input">
        <el-select
          v-model="payParams.bankAccountId"
          size="mini"
          placeholder="请选付款账户"
        >
          <el-option
            v-for="item in bankAccountList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="payParams.inputMoney"
          type="number"
          size="mini"
          @input="inputMoneyTip"
        >
          <template slot="prepend">
            付款金额
          </template>
        </el-input>
        <el-input
          v-model="payParams.advanceMoney"
          type="number"
          size="mini"
          @input="advanceTip"
        >
          <template slot="prepend">
            使用预付款金额
          </template>
        </el-input>
        <el-input
          v-model="payParams.remark"
          size="mini"
        >
          <template slot="prepend">
            备注
          </template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleHandle">
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
import { getOrderStorage, postRedDashed } from '@/service/PurchaseAndSale/Warehouse/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import {
  getSuppliers
} from '@/service/PurchaseAndSale/common'

export default {
  name: 'SOShipped',
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
      orderStorageList: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      selectArr: [],
      addDialog: false,
      payParams: {}
    }
  },

  computed: {},
  watch: {},
  mounted() {
    this.getSuppliersData()
    this.getOrderStorageData()
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
    getOrderStorageData() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      const path = '3'
      getOrderStorage(params, path).then(res => {
        const data = res.data.data
        this.orderStorageList = data
        this.paginationData = data.pageVo
      })
    },
    deleteRow(index, row, more) {
    },
    postHandle(index, row) {

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
