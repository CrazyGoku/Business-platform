<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.id" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-select
        v-model="filterData.supplierName"
        clearable
        size="mini"
        filterable placeholder="请选择供应商名"
      >
        <el-option
          v-for="item in supplierList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-select
        v-model="filterData.type"
        clearable
        size="mini"
        placeholder="请选择订单类型"
      >
        <el-option
          label="采购订单"
          value="1"
        />
        <el-option
          label="采购退货申请"
          value="2"
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
        :data="applyList"
        :pagination-data="paginationData"
        @paginationChange="getFundOutFun"
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
              @click.native.prevent="oneHandle(scope.$index,scope.row)"
            >
              付款
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="addVisible" title="付款">
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
        <NumberInput
          v-model="payParams.inputMoney"
          @input="inputMoneyTip"
          :max="payParams.notClearedMoney"
        >
          <template slot="prepend">
            付款金额
          </template>
        </NumberInput>
        <NumberInput
          :max="fundAdvance"
          v-model="payParams.advanceMoney"
          @input="advanceTip"

        >
          <template slot="prepend">
            使用预付款金额
          </template>
        </NumberInput>
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
import { postFundOrder, getBankFund, getFundAdvance } from '@/service/PurchaseAndSale/Fund/common.js'
import { getFundOut } from '@/service/PurchaseAndSale/Fund/PayByOrder.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import supplierList from '@/mixins/supplierList.js'
import { parseTime } from '@/utils'
export default {
  name: 'PayByOrder',
  components: { SelectTable },
  mixins: [common,supplierList],
  data() {
    return {
      filterData: {},
      pickTime:'',
      applyList: [],
      addVisible: false,
      payParams: {
        'advanceMoney': '',
        'bankAccountId': '',
        'discountMoney': '',
        'money': '',
        'orderId': '',
        'remark': '',
        'storeId': '',
        'targetId': '',
        'type': '2',
        'userId': '',
        'notClearedMoney': '',
        'inputMoney': ''
      },
      bankAccountList: [],
      fundAdvance: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getFundOutFun()
    this.getBankFundFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getFundOutFun()
    },
    getFundOutFun() {
      if(!this.filterData.id){
        delete this.filterData.id
      }
      this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
      this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
      const params = {
        storeId: this.storeId,
        type: 1,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getFundOut(params).then(res => {
        const data = res.data.data
        this.applyList = data
        this.paginationData = data.pageVo
      })
    },
    getBankFundFun() {
      const params = {
        storeId: this.storeId
      }
      getBankFund(params).then(res => {
        this.bankAccountList = res.data.data
      })
    },
    oneHandle(index, row) {
      console.log(row)
      const params = {
        storeId: this.storeId,
        type: 2,
        targetId: row.supplierId
      }
      getFundAdvance(params).then(res => {
        this.fundAdvance = res.data.data
        this.addVisible = true
        this.payParams = {
          'advanceMoney': '',
          'bankAccountId': '',
          'discountMoney': '0',
          'money': '',
          'orderId': row.id,
          'remark': '',
          'storeId': this.storeId,
          'targetId': row.supplierId,
          'type': '2',
          'userId': this.userId,
          'notClearedMoney': row.notClearedMoney
        }
      })
    },
    cancleHandle() {
      this.addVisible = false
      this.payParams = {
        'advanceMoney': '',
        'bankAccountId': '',
        'discountMoney': '',
        'money': '',
        'orderId': '',
        'remark': '',
        'storeId': '',
        'targetId': '',
        'type': '2',
        'userId': '',
        'notClearedMoney': ''
      }
    },
    confirmHandle() {
      this.payParams.inputMoney = this.payParams.inputMoney?this.payParams.inputMoney:0
      this.payParams.advanceMoney = this.payParams.advanceMoney?this.payParams.advanceMoney:0
      this.payParams.discountMoney = this.payParams.discountMoney?this.payParams.discountMoney:0
      const totalMoney = Number(this.payParams.inputMoney) + Number(this.payParams.advanceMoney) + Number(this.payParams.discountMoney)
      if (!this.payParams.bankAccountId) {
        this.$message({
          message: '请选择付款账户',
          type: 'warning'
        })
        return
      }
      if (totalMoney > this.payParams.notClearedMoney) {
        this.$message({
          message: '付款金额不能大于未结算金额',
          type: 'warning'
        })
        return
      }
      if (totalMoney < 0) {
        this.$message({
          message: '付款金额不能小于等于0',
          type: 'warning'
        })
        return
      }
      this.payParams.money = totalMoney
      postFundOrder(this.payParams).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '付款失败，请稍后重试',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '付款成功，请在付款单查看',
          type: 'success'
        })
        this.addVisible = false
        this.getFundOutFun()
      })
    },
    advanceTip(value) {
      console.log(value)
      if (value > this.fundAdvance) {
        this.$message({
          message: '使用预付金额不能大于预付总额',
          type: 'warning'
        })
        return
      } else if (value < 0) {
        this.$message({
          message: '使用预付金额不能小于0',
          type: 'warning'
        })
        return
      }
    },
    inputMoneyTip(value) {
      if (value < 0) {
        this.$message({
          message: '付款金额不能小于0',
          type: 'warning'
        })
        return
      }
      if ((Number(value) + Number(this.payParams.advanceMoney)) > this.payParams.notClearedMoney) {
        this.$message({
          message: '付款金额不能大于未结算金额',
          type: 'warning'
        })
        return
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
