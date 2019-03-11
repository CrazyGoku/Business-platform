<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.id" placeholder="请输入单据编号" size="mini">
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
      <el-input v-model="filterData.membershipNumber" placeholder="会员卡号" size="mini">
        <template slot="prepend">
          会员卡号
        </template>
      </el-input>
      <el-select
        v-model="filterData.type"
        clearable
        size="mini"
        placeholder="请选择订单类型"
      >
        <el-option
          label="销售订单"
          value="2"
        />
        <el-option
          label="销售退货申请单"
          value="3"
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
    <el-dialog width="80%" :close-on-click-modal="false" :visible.sync="addVisible" title="收款">
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

        <NumberInput
          v-model="payParams.inputMoney"
        >
          <template slot="prepend">
            收款金额{{payParams.notClearedMoney<0?'（负）':''    }}
          </template>
        </NumberInput>
        <NumberInput
          v-model="payParams.discountMoney"
          @input="discountMoneyTip"
        >
          <template slot="prepend">
            折扣价
          </template>
        </NumberInput>

        <NumberInput
          :max="fundAdvance"
          v-model="payParams.advanceMoney"
          @input="advanceTip"

        >
          <template slot="prepend">
            使用预收款金额
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
    <el-dialog :close-on-click-modal="false" :visible.sync="orderVisible" title="订单详情" width="80%">
      <el-table :data="orderDetails">
        <el-table-column
          type="index"
          fixed
          align="center"
          width="20"
        />
        <el-table-column
          v-for="(item,index) in orderDetailMap"
          :key="index"
          :fixed="index<1?true:false"
          :show-overflow-tooltip="true"
          :label="item.name"
          resizable
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            <!--{{ orderDetails[] }}-->
            <div>
              {{ scope.row[item.key] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  import common from '@/mixins/common'
  import {postFundOrder, getBankFund, getFundAdvance} from '@/service/PurchaseAndSale/Fund/common.js'
  import {getFundIn} from '@/service/PurchaseAndSale/Fund/ReceiptByOrder.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import {parseTime} from '@/utils'
  import {getSellApplyDetails} from '@/service/PurchaseAndSale/Sale/common.js'
  import {clearMap, statusMap} from '@/views/PurchaseAndSale/config.js'
  import {dataFormat} from '@/utils/index.js'
  import {orderDetailMap} from '@/views/PurchaseAndSale/Purchase/config.js'
  export default {
    name: 'ReceiptByOrder',
    components: {SelectTable},
    mixins: [common],
    data() {
      return {
        filterData: {},
        pickTime: '',
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
        fundAdvance: '',
        orderDetailMap,
        orderDetails: {},
        orderVisible: false
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getFundInFun()
      this.getBankFundFun()
    },
    methods: {
      searchBtn() {
        this.paginationData.page = 1
        this.getFundInFun()
      },
      readRow(index, row) {
        const params = {
          storeId: this.storeId
        }
        const path = row.id
        getSellApplyDetails(params, path).then(res => {
          const data = res.data.data
          /*getSuppliersDetail({storeId: this.storeId}, data.supplierId).then(res => {
            this.printDetail = res.data.data
          })*/
          console.log(data)
          data.orderStatus = statusMap[data.orderStatus]
          data.clearStatus = clearMap[data.clearStatus]
          data.details.forEach(v => {
            v.goodsSkuSku = eval(v.goodsSkuSku)
            let sku = ''
            v.goodsSkuSku.forEach((item, index) => {
              let _sku = ''
              if (v.goodsSkuSku.length === index + 1) {
                _sku = item.key + ':' + item.value
              } else {
                _sku = item.key + ':' + item.value + ','
              }
              sku += _sku
            })
            v.goodsSkuSku = sku
          })
          const _data = dataFormat(data)
          this.orderDetails = _data
          this.orderVisible = true
        })
      },
      getFundInFun() {
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
          type: 1,
          targetId: row.client.id
        }
        getFundAdvance(params).then(res => {
          this.fundAdvance = res.data.data
          this.addVisible = true
          this.payParams = {
            'advanceMoney': '0',
            'bankAccountId': '',
            'discountMoney': '0',
            'inputMoney': 0,
            'money': '',
            'orderId': row.id,
            'remark': '',
            'storeId': this.storeId,
            'targetId':  row.client.id,
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
        this.payParams.money = this.payParams.inputMoney?this.payParams.inputMoney:0
        this.payParams.advanceMoney = this.payParams.advanceMoney?this.payParams.advanceMoney:0
        this.payParams.discountMoney = this.payParams.discountMoney?this.payParams.discountMoney:0
        if (this.payParams.notClearedMoney < 0) {
          this.payParams.money = this.payParams.money * -1
          this.payParams.discountMoney = this.payParams.discountMoney * -1
          this.payParams.advanceMoney = this.payParams.advanceMoney * -1
        }
        if (!this.payParams.bankAccountId) {
          this.$message({
            message: '请选择收款账户',
            type: 'warning'
          })
          return
        }
        let totalMoney = Number(this.payParams.money)+Number(this.payParams.discountMoney)+Number(this.payParams.advanceMoney)
        console.log(this.payParams.notClearedMoney,totalMoney)
        if (Math.abs(totalMoney) > Math.abs(this.payParams.notClearedMoney)) {
          this.$message({
            message: '付款金额不能大于未结算金额',
            type: 'warning'
          })
          return
        }
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
        if ((Number(value) + Number(this.payParams.money) + Number(this.payParams.discountMoney)) > Math.abs(this.payParams.notClearedMoney)) {
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
        if ((Number(value) + Number(this.payParams.advanceMoney) + Number(this.payParams.money)) > Math.abs(this.payParams.notClearedMoney)) {
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
