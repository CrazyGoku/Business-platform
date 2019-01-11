<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.membershipNumber" placeholder="会员卡号" size="mini">
        <template slot="prepend">
          会员卡号
        </template>
      </el-input>
      <el-input v-model="filterData.id" placeholder="单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-input v-model="filterData.clientName" placeholder="客户名" size="mini">
        <template slot="prepend">
          客户名
        </template>
      </el-input>
      <el-input v-model="filterData.phone" placeholder="电话" size="mini">
        <template slot="prepend">
          电话
        </template>
      </el-input>
      <el-select
        v-model="filterData.type"
        size="mini"
        clearable
        @clear="searchBtn"
        placeholder="单据类型"
      >
        <el-option
          label="零售单"
          value="1"
        />
        <el-option
          label="销售出库单"
          value="2"
        />
        <el-option
          label="销售退货单"
          value="3"
        />
        <el-option
          label="销售换货单"
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
        :data="resultList"
        :pagination-data="paginationData"
        @paginationChange="getSaleAllResultFun"
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
              @click.native.prevent="redRow(scope.$index,scope.row)"
            >
              红冲
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="readRow(scope.$index,scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import {getSuppliers, postRedDashed} from '@/service/PurchaseAndSale/Sale/common.js'
  import {getSaleAllResult, getSaleResultDetails} from '@/service/PurchaseAndSale/Sale/SalesAllResults'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import {statusMap,clearMap} from '@/views/PurchaseAndSale/config.js'
  import { parseTime } from '@/utils'

  export default {
    name: 'PurchaseAllResult',
    components: {SelectTable},
    mixins: [common],
    data() {
      return {
        filterData: {},
        pickTime: '',
        resultList: [],
        suppliersList: []
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getSuppliersData()
      this.getSaleAllResultFun()
    },
    methods: {
      searchBtn() {
        this.paginationData.page = 1
        this.getSaleAllResultFun()
      },
      getSuppliersData() {
        const params = {
          storeId: this.storeId
        }
        getSuppliers(params).then(res => {
          this.suppliersList = res.data.data
        })
      },
      getSaleAllResultFun() {
        if (!this.filterData.id) {
          delete this.filterData.id
        }
        this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
        this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
        const params = {
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        getSaleAllResult(params).then(res => {
          const data = res.data.data
          let typeMap = {
            1: '零售单', 2: '销售出库单', 3: '销售退货单', 4: '销售换货单'
          }
          data.items.forEach(item => {
            item.type = typeMap[item.type]
            item.sellApplyOrderVo.clearStatus = clearMap[item.sellApplyOrderVo.clearStatus]
          })
          this.resultList = data
          this.paginationData = data.pageVo
        })
      },
      readRow(index, row) {
        const params = {
          storeId: this.storeId
        }
        const path = row.id
        getSaleResultDetails(params, path).then(res => {
        })
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
            this.getSaleAllResultFun()
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
