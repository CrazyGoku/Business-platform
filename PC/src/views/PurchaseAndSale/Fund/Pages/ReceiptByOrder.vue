<template>
  <div>
    <div class="flex-center">
      <select-table
        :data="applyList"
        :pagination-data="paginationData"
        @paginationChange="getFundInFun"
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
              收款
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :visible.sync="addVisible" title="收款">
      <p>未结算金额:{{ payParams.notClearedMoney }}</p>
      <p>预收款金额:{{ fundAdvance }}</p>
      <div class="dialog-content-input">
        <el-select
          v-model="payParams.bankAccountId"
          size="mini"
          placeholder="请选收款账户"
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
            收款金额
          </template>
        </el-input>
        <el-input
          v-model="payParams.discountMoney"
          type="number"
          size="mini"
          @input="discountMoneyTip"
        >
          <template slot="prepend">
            折扣价
          </template>
        </el-input>
        <el-input
          v-model="payParams.advanceMoney"
          type="number"
          size="mini"
          @input="advanceTip"
        >
          <template slot="prepend">
            使用预收款金额
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
import { postFundOrder, getBankFund, getFundAdvance } from '@/service/PurchaseAndSale/Fund/common.js'
import { getFundIn } from '@/service/PurchaseAndSale/Fund/ReceiptByOrder.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { statusMap } from '../config'
export default {
  name: 'ReceiptByOrder',
  components: { SelectTable },
  mixins: [common],
  data() {
    return {
      applyList: [],
      addVisible: false,
      payParams: {
        'advanceMoney': '0',
        'bankAccountId': '',
        'discountMoney': '0',
        'money': '',
        'orderId': '',
        'remark': '',
        'storeId': '',
        'targetId': '',
        'type': '1',
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
    this.getFundInFun()
    this.getBankFundFun()
  },
  methods: {
    getFundInFun() {
      const params = {
        storeId: this.storeId,
        type: 2,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      getFundIn(params).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          item.orderStatus = statusMap[item.orderStatus]
        })
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
        targetId: '054774c2-f784-11e8-9dc7-54ee75c0f47a'
      }
      getFundAdvance(params).then(res => {
        this.fundAdvance = res.data.data
        this.addVisible = true
        this.payParams = {
          'advanceMoney': '0',
          'bankAccountId': '',
          'discountMoney': '0',
          'money': '',
          'orderId': row.id,
          'remark': '',
          'storeId': this.storeId,
          'targetId': '054774c2-f784-11e8-9dc7-54ee75c0f47a',
          'type': '1',
          'userId': this.userId,
          'notClearedMoney': row.notClearedMoney
        }
      })
    },
    cancleHandle() {
      this.addVisible = false
      this.payParams = {
        'advanceMoney': '0',
        'bankAccountId': '',
        'discountMoney': '0',
        'money': '',
        'orderId': '',
        'remark': '',
        'storeId': '',
        'targetId': '',
        'type': '1',
        'userId': '',
        'notClearedMoney': ''
      }
    },
    confirmHandle() {
      const totalMoney = Number(this.payParams.inputMoney) + Number(this.payParams.advanceMoney) + Number(this.payParams.discountMoney)
      if (!this.payParams.bankAccountId) {
        this.$message({
          message: '请选择收款账户',
          type: 'warning'
        })
        return
      }
      if (totalMoney > this.payParams.notClearedMoney) {
        this.$message({
          message: '收款金额不能大于未结算金额',
          type: 'warning'
        })
        return
      }
      if (totalMoney < 0) {
        this.$message({
          message: '收款金额不能小于等于0',
          type: 'warning'
        })
        return
      }
      this.payParams.money = totalMoney
      postFundOrder(this.payParams).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '收款失败，请稍后重试',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '收款成功，请在收款单查看',
          type: 'success'
        })
        this.addVisible = false
        this.getFundInFun()
      })
    },
    advanceTip(value) {
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
      if ((Number(value) + Number(this.payParams.money) + Number(this.payParams.discountMoney)) > this.payParams.notClearedMoney) {
        this.$message({
          message: '收款金额不能大于未结算金额',
          type: 'warning'
        })
        return
      }
    },
    inputMoneyTip(value) {
      if (value < 0) {
        this.$message({
          message: '收款金额不能小于0',
          type: 'warning'
        })
        return
      }
      if ((Number(value) + Number(this.payParams.advanceMoney) + Number(this.payParams.discountMoney)) > this.payParams.notClearedMoney) {
        this.$message({
          message: '收款金额不能大于未结算金额',
          type: 'warning'
        })
        return
      }
    },
    discountMoneyTip(value) {
      if (value < 0) {
        this.$message({
          message: '折扣金额不能小于0',
          type: 'warning'
        })
        return
      }
      if ((Number(value) + Number(this.payParams.advanceMoney) + Number(this.payParams.money)) > this.payParams.notClearedMoney) {
        this.$message({
          message: '收款金额不能大于未结算金额',
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
