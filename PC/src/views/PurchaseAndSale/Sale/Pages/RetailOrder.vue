<template>
  <div>
    <div class="handle-bar">
      <el-button type="primary" size="mini" icon="el-icon-setting" circle @click="settingHandle"></el-button>
    </div>
    <div class="search-bar">
      <el-select
        v-model="addDetails.clientId"
        clearable
        size="mini"
        @change="getDiscountCouponCanUseFun"
        filterable placeholder="请选择客户"
      >
        <el-option
          v-for="item in clientsList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="addDetails.clientIdC"
        filterable
        remote
        size="mini"
        clearabled
        reserve-keyword
        placeholder="请输入会员卡号"
        @change="getDiscountCouponCanUseFunC"
        :remote-method="searchMembershipNumber">
        <el-option
          v-for="item in filterClient"
          :key="item.id"
          :label="item.membershipNumber"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select
        v-model="addDetails.warehouseId"
        clearable
        size="mini"
        filterable placeholder="请选择出库仓库"
        @change="choiceOutWarehouse"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="addDetails.goodType"
        :disabled="!addDetails.warehouseId"
        size="mini"
        filterable placeholder="请选择商品分类"
        @change="choiceGoodsTypeFun"
      >
        <el-option
          v-for="item in useGood"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="addDetails.good"
        :disabled="!addDetails.goodType"
        size="mini"
        filterable
        placeholder="请选择商品"
        @change="choiceGoodsFun"
      >
        <el-option
          v-for="item in goodsVos"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        :disabled="!addDetails.good"
        size="mini"
        placeholder="请选择商品规格"
        @change="choiceGoodsSkuFun"
      >
        <el-option
          v-for="item in goodsSkuVos"
          :key="item.id"
          :disabled="choiceGoodsSku.findIndex(v=> v.id===item.id)>-1"
          :label="item.sku"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="flex-center">
      <el-table
        :data="choiceGoodsSku"
        style="width: 100%"
        height="500px"
      >
        <el-table-column
          label="操作"
          align="center"
          width="100"
        >
          <template scope="scope">
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button size="mini" type="danger" @click="deleteChoiceRow(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="赠品" width="180" align="center">
          <template scope="scope">
            <el-checkbox v-model="scope.row.isGift"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align="center"
          label="商品名称"
        />
        <el-table-column
          prop="sku"
          align="center"
          width="200px"
          show-overflow-tooltip
          label="规格"
        />
        <el-table-column
          prop="retailPrice"
          align="center"
          label="零售价"
        />
        <el-table-column
          prop="vipPrice"
          align="center"
          label="VIP价格"
        />
        <el-table-column
          prop="bossPrice"
          align="center"
          label="老板价"
        />
        <el-table-column label="数量" width="180" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.quantity"
              :no-slot="false"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="售价" width="180" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.money"
              :no-slot="false"
            />
          </template>
        </el-table-column>
        <el-table-column label="折扣" width="180" align="center">
          <template scope="scope">
            <NumberInput
              max="1"
              step="0.1"
              v-model="scope.row.discountRate"
              :no-slot="false"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="优惠后金额"
        >
          <template scope="scope">
            <p>{{(scope.row.money*scope.row.discountRate*scope.row.quantity).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="180" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.remark"
              size="small"
            />
          </template>
        </el-table-column>
      </el-table>


    </div>
    <el-row :gutter="20" style="margin-top: 10px;">
      <el-col :span="10">
        <el-card class="box-card">
          <el-select
            v-model="addDetails.discountCouponId"
            :disabled="!choiceGoodsSku.length||!addDetails.clientId"
            clearable
            size="mini"
            @change="discountCouponIdChange"
            placeholder="可选择使用优惠券"
          >
            <el-option
              v-for="item in discountCouponList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <NumberInput
            v-model="discountMoney"
          >
            <template slot="prepend">
              直接优惠金额
            </template>
          </NumberInput>
          <el-input v-model="addDetails.remark" placeholder="备注" size="mini">
            <template slot="prepend">
              备注
            </template>
          </el-input>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="box-card">
          <p style="margin: 0">收款</p>
          <el-row :gutter="20">
            <el-col :span="12" class="icon-box">
              <el-checkbox-group :min="1" @change="changeCheck" v-model="checkList">
                <el-checkbox label="1">
                  <div class="icon-item">
                    <img src="@/assets/icon/wx.png" alt="">
                    <i>微信</i>
                  </div>
                </el-checkbox>
                <el-checkbox label="2">
                  <div class="icon-item">
                    <img src="@/assets/icon/zfb.png" alt="">
                    <i>支付宝</i>
                  </div>
                </el-checkbox>
                <el-checkbox label="3">
                  <div class="icon-item">
                    <img src="@/assets/icon/getMoney.png" alt="">
                    <i>预收款</i>
                  </div>
                </el-checkbox>
                <el-checkbox label="4">
                  <div class="icon-item">
                    <img src="@/assets/icon/cash.png" alt="">
                    <i>现金</i>
                  </div>
                </el-checkbox>
                <el-checkbox label="5">
                  <div class="icon-item">
                    <img src="@/assets/icon/bank.png" alt="">
                    <i>银行卡</i>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
              <el-checkbox v-model="groupCheck" @change="groupChange">组合收款</el-checkbox>
            </el-col>
            <el-col :span="12" class="input-con">
              <div style="display: flex;flex-wrap: wrap">
                <p>商品总价:{{totalInfo.goodsTotal}}</p>
                <p>会员优惠:{{totalInfo.vipPrice}}</p>
                <p>优惠券:{{couponAmount}}</p>
                <p>直接优惠:{{discountMoney}}</p>
                <p>总优惠金额:{{totalInfo.totalDis}}</p>
              </div>
              <p>应收金额: <span style="color: orangered;">{{receivable}}</span></p>
              <p>预收余额: <span style="color: orangered;">{{fundAdvance}}</span></p>
              <NumberInput
                v-if="checkList.indexOf('1')>-1"
                v-model="wechatMoney"
              >
                <template slot="prepend">
                  微信
                </template>
              </NumberInput>
              <NumberInput
                v-if="checkList.indexOf('2')>-1"
                v-model="alipayMoney"
              >
                <template slot="prepend">
                  支付宝
                </template>
              </NumberInput>
              <NumberInput
                v-if="checkList.indexOf('3')>-1"
                v-model="advanceMoney"
              >
                <template slot="prepend">
                  预收款
                </template>
              </NumberInput>
              <NumberInput
                v-if="checkList.indexOf('4')>-1"
                v-model="bankCardMoney"
              >
                <template slot="prepend">
                  银行
                </template>
              </NumberInput>
              <NumberInput
                v-if="checkList.indexOf('5')>-1"
                v-model="cashMoney"
              >
                <template slot="prepend">
                  现金
                </template>
              </NumberInput>
              <!--<p>找零:1111</p>-->
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;padding-bottom: 10px;" v-if="choiceGoodsSku.length>0">
      <el-button style="float: right;margin-right: 10px;" icon="el-icon-printer" type="primary" @click="printFun">打印</el-button>
      <el-button style="float: right;margin-right: 10px;" type="primary" @click="addFun">收银</el-button>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="settingVisible" title="零售设置">
      <div class="search-bar">
        <el-select
          v-model="settingDetail.retailWarehouseId"
          clearable
          size="mini"
          filterable placeholder="请选择默认仓库"
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="settingDetail.retailBankAccountId"
          clearable
          size="mini"
          filterable placeholder="请选择默认银行收款账号"
        >
          <el-option
            v-for="item in bankAccountList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="comfirmSetting">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getDefaultRetail, putDefaultRetail} from '@/service/PurchaseAndSale/Setting/common.js'
  import {getFundAdvance} from '@/service/PurchaseAndSale/Fund/common.js'
  import {getClients} from '@/service/PurchaseAndSale/common.js'

  import common from '@/mixins/common'
  import warehouseList from '@/mixins/warehouseList.js'
  import bankAccountList from '@/mixins/bankAccountList.js'
  import clientsList from '@/mixins/clientsList.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import {dataFormat} from '@/utils/index.js'
  import {parseTime} from '@/utils'
  import {
    canUse,
    getDiscountCouponCanUse,
    postSellApply,
    getSellApply
  } from '@/service/PurchaseAndSale/Sale/common.js'

  export default {
    name: 'RetailOrder',
    components: {SelectTable},
    mixins: [common, warehouseList, bankAccountList, clientsList],
    data() {
      return {
        totalInfo: {
          goodsTotal: 0,
          vipPrice: 0,
          totalDis: 0
        },
        settingVisible: false,
        settingDetail: {},
        localStting: {},
        addDetails: {},
        useGood: [],
        filterClient: [],
        goodsVos: [],
        goodsSkuVos: [],
        choiceGoodsSku: [],
        discountCouponList: [],
        discountMoney: 0,
        alipayMoney: 0,
        wechatMoney: 0,
        cashMoney: 0,
        bankCardMoney: 0,
        advanceMoney: 0,
        choicePaymentType: '',
        checkList: ['1'],
        groupCheck: false,
        payTypeMap: {
          1: 'wechatMoney',
          2: 'alipayMoney',
          3: 'advanceMoney',
          4: 'cashMoney',
          5: 'bankCardMoney'
        },
        receivable: 0,
        choiceClient: {},
        money: '',
        couponAmount: 0,
        discountCoupon: {},
        fundAdvance: 0,
        printDetail:{}
      }
    },
    computed: {},
    watch: {
      choiceGoodsSku: {
        deep: true,
        handler(value) {
          this.watchChange()
        }
      },
      discountMoney() {
        this.watchChange()
      },
      discountCoupon: {
        deep: true,
        handler(value) {
          this.watchChange()
        }
      },
      addDetails: {
        deep: true,
        handler(value) {
          this.watchChange()
        }
      }
    },
    mounted() {
      this.getDefaultRetailFun()
    },
    methods: {

      printFun() {
        const data = {}
        if(this.addDetails.clientId){
          this.printDetail = this.clientsList.filter(v=>{
            return v.id = this.addDetails.clientId
          })[0]
        }else{
          this.printDetail = {
            address:'',
            phone:'',
            name: ''
          }
        }
        let payTypeMap = {
          1: '微信',
          2: '支付宝',
          3: '预收款',
          4: '现金',
          5: '银行转账'
        }
        let settlementType = ''
        if(this.groupCheck){
          this.checkList.forEach(v=>{
            settlementType += ( payTypeMap[v] + ' '+this[this.payTypeMap[v]]+'元  ')
          })
        }else{
          settlementType = payTypeMap[this.checkList[0]]
        }
        data.items = JSON.parse(JSON.stringify(this.choiceGoodsSku))
        let reg = new RegExp(/单位/ig)
        let company = ''
        data.items.forEach(v=>{
          v.goodsSkuPurchasePrice = (v.money*v.discountRate).toFixed(2)
          v.money = (v.money*v.discountRate*v.quantity).toFixed(2)
          v.sku.split(',').forEach(v2=>{
            if(reg.test(v2)) company = v2
          })
          let _company = company.split(':')
          company = _company[_company.length-1]
          v.company = company
        })
        data.title = [
          {key: 'goodsId', name: '商品编号'},
          {key: 'goodsName', name: '商品名称'},
          {key: 'company', name: '单位'},
          {key: 'goodsSkuPurchasePrice', name: '单价'},
          {key: 'quantity', name: '数量'},
          {key: 'money', name: '金额'},
          {key: 'remark', name: '备注'}
        ]
        window.localStorage.setItem('printData', JSON.stringify(data))
        let routeData = this.$router.resolve({
          name: 'PrintPage',
          query: {
            orderName: '零售订单',
            orderTime: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}  '),
            clientName: this.printDetail.name,
            clientPhone: this.printDetail.phone,
            clientAddr: this.printDetail.address,
            settlementType
          }
        })
        window.open(routeData.href, '_blank')
      },
      deleteChoiceRow(index, row) {
        this.choiceGoodsSku = this.choiceGoodsSku.filter(v => {
          return v.id !== row.id
        })
      },
      watchChange() {
        this.totalInfo = {
          goodsTotal: 0,
          vipPrice: 0,
          totalDis: 0
        }
        let totalMoney = 0
        this.choiceGoodsSku.forEach(v => {
          if(!v.isGift){
            this.totalInfo.goodsTotal += Number(v.retailPrice * v.quantity)
            this.totalInfo.vipPrice += (Number(v.retailPrice -v.money) + Number((v.money * (1 - v.discountRate) * v.quantity).toFixed(2)))
            totalMoney += Number(Number(v.money * v.discountRate * v.quantity).toFixed(2))
          }
        })
        if (this.addDetails.discountCouponId) {
          if (this.discountCoupon.type == 1) {
            this.couponAmount = this.discountCoupon.money
          } else if (this.discountCoupon.type === 2) {
            this.couponAmount = (totalMoney * (1 - this.discountCoupon.money)).toFixed(2)
          } else {
            this.couponAmount = this.discountCoupon.discountMoney
          }
          this.receivable = totalMoney - this.discountMoney - this.couponAmount
        } else {
          this.couponAmount = 0
          this.receivable = totalMoney - this.discountMoney
        }
        this.totalInfo.totalDis = (this.totalInfo.goodsTotal - this.receivable).toFixed(2)
      },
      groupChange(value) {
        if (!value) {
          this.checkList = [this.checkList[0]]
        }
      },
      searchMembershipNumber(query) {
        let params = {
          membershipNumber: query,
          disabled: 0
        }
        getClients(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: res.data.detail,
              type: 'error'
            })
            return
          }
          this.filterClient = res.data.data
        })
      },
      settingHandle() {
        this.settingVisible = true
        this.getDefaultRetailFun()
      },
      getDefaultRetailFun() {
        getDefaultRetail(this.storeId).then(res => {
          this.settingDetail = res.data.data
          this.addDetails.warehouseId = this.settingDetail.retailWarehouseId
          this.choiceOutWarehouse(this.addDetails.warehouseId)
        })
      },
      comfirmSetting() {
        let data = {
          storeId: this.storeId,
          ...this.settingDetail
        }
        putDefaultRetail(data).then(res => {
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
            message: '设置成功',
            type: 'success'
          })
        })
      },
      canUseFun(warehouseId) {
        const params = {
          storeId: this.storeId,
          warehouseId
        }
        canUse(params).then(res => {
          this.useGood = res.data.data
          if (res.data.data.length <= 0) {
            this.$message({
              message: '该仓库没有可用商品',
              type: 'warning'
            })
          }
        })
      },
      choiceOutWarehouse(value) {
        this.canUseFun(value)
      },
      choiceGoodsTypeFun(value) {
        this.goodsVos = this.useGood.filter(v => {
          return v.id === value
        })[0].goodsVos
        if (this.goodsVos.length <= 0) {
          this.$message({
            message: '该商品分类没有可用商品',
            type: 'warning'
          })
        }
      },
      choiceGoodsFun(value) {
        this.goodsSkuVos = this.goodsVos.filter(v => {
          return v.id === value
        })[0].goodsSkuVos
        if (this.goodsSkuVos.length <= 0) {
          this.$message({
            message: '该商品分类没有可用规格',
            type: 'warning'
          })
        } else {
          this.goodsSkuVos.forEach(v => {
            v.goodsName = this.goodsVos.filter(v => {
              return v.id === value
            })[0].name
            console.log(v.sku)
            if(v.sku[0]=='['){
              v.sku = eval(v.sku)
              let sku = ''
              v.sku.forEach((item, index) => {
                let _sku = ''
                if (v.sku.length === index + 1) {
                  _sku = item.key + ':' + item.value
                } else {
                  _sku = item.key + ':' + item.value + ','
                }
                sku += _sku
              })
              v.sku = sku
            }
          })

          this.choiceGoodsSkuFun(this.goodsSkuVos[0].id)
        }
      },
      choiceGoodsSkuFun(value) {
        if (this.choiceGoodsSku.findIndex(v => {
          return v.goodsSkuId === value || v.id === value
        }) > -1) {
          this.$message({
            showClose: true,
            message: '重复添加商品规格',
            type: 'info'
          })
          return
        }
        const _data = this.goodsSkuVos.filter(v => {
          return v.id == value
        })[0]
        this.choiceGoodsSku.push(_data)
        this.choiceGoodsSku.forEach(v => {
          let money = 0
          let discountRate = 0
          if (JSON.stringify(this.choiceClient) !== '{}') {
            money = v[this.priceTypeMap[this.choiceClient.clientLevel.priceType]]
            discountRate = this.choiceClient.clientLevel.price
          } else {
            money = v.retailPrice
            discountRate = 1
          }
          let quantity = 1
          if(v.quantity>1) quantity = v.quantity
          this.$set(v, 'type', 1)
          this.$set(v, 'goodsSkuId', v.id)
          this.$set(v, 'money', money)
          this.$set(v, 'quantity', quantity)
          this.$set(v, 'discountMoney', 0)
          this.$set(v, 'isGift', false)
          this.$set(v, 'discountRate', discountRate)
          this.$set(v, 'remark', '')
        })
      },
      getDiscountCouponCanUseFun(clientId) {
        if (clientId) {
          const params = {
            storeId: this.storeId,
            clientId
          }
          this.choiceClient = this.clientsList.filter(v => {
            return v.id === clientId
          })[0]
          getDiscountCouponCanUse(params).then(res => {
            this.discountCouponList = res.data.data
          })
          const _params = {
            storeId: this.storeId,
            type: 2,
            targetId: clientId
          }
          getFundAdvance(_params).then(res => {
            this.fundAdvance = res.data.data
          })
          this.choiceGoodsSku.forEach(v => {
            v.discountRate = this.choiceClient.clientLevel.price
            v.money = v[this.priceTypeMap[this.choiceClient.clientLevel.priceType]]
          })
        } else {
          this.choiceGoodsSku.forEach(v => {
            v.discountRate = 1
          })
          this.addDetails.discountCouponId = ''
        }

      },
      getDiscountCouponCanUseFunC(clientId) {
        if (clientId) {
          const params = {
            storeId: this.storeId,
            clientId
          }
          this.choiceClient = this.clientsList.filter(v => {
            return v.id === clientId
          })[0]
          getDiscountCouponCanUse(params).then(res => {
            this.discountCouponList = res.data.data
          })
          const _params = {
            storeId: this.storeId,
            type: 2,
            targetId: clientId
          }
          getFundAdvance(_params).then(res => {
            this.fundAdvance = res.data.data
          })
          this.choiceGoodsSku.forEach(v => {
            v.discountRate = this.choiceClient.clientLevel.price
            v.money = (v[this.priceTypeMap[this.choiceClient.clientLevel.priceType]]* this.choiceClient.clientLevel.price).toFixed(2)
          })
          this.addDetails.clientId = clientId
        } else {
          this.choiceGoodsSku.forEach(v => {
            v.discountRate = 1
          })
          this.addDetails.discountCouponId = ''
        }

      },
      discountCouponIdChange(value) {
        this.discountCoupon = this.discountCouponList.filter(v => {
          return v.id === value
        })[0]
      },
      changeCheck(value) {
        if (!this.groupCheck) {
          if (this.checkList.length > 1) {
            this.checkList = [value[1]]
          }
        }
        this.cashMoney = 0
        this.alipayMoney = 0
        this.wechatMoney = 0
        this.bankCardMoney = 0
        this.advanceMoney = 0
      },
      quantityChange(row) {

      },
      addFun() {
        let data = {
          prodcingWay: 1,
          type: 1,
          remark: this.addDetails.remark,
          storeId: this.storeId,
          userId: this.userId,
          clientId: this.addDetails.clientId,
          discountCouponId: this.addDetails.discountCouponId,
          discountMoney: this.discountMoney,
          details: []
        }
        data.outTotalQuantity = 0
        data.totalMoney = 0
        data.totalDiscountMoney = 0
        data.orderMoney = 0
        data.cashMoney = this.cashMoney
        data.alipayMoney = this.alipayMoney
        data.wechatMoney = this.wechatMoney
        data.bankCardMoney = this.bankCardMoney
        data.advanceMoney = this.advanceMoney
        data.totalDiscountMoney = this.discountMoney + Number(this.couponAmount)
        const num = this.choiceGoodsSku.length
        const mod = data.totalDiscountMoney % num
        const mon = parseInt(data.totalDiscountMoney / num)
        this.choiceGoodsSku.forEach((v, index) => {
          let _detail = {}
          if(v.isGift){
            data.outTotalQuantity += Number(v.quantity)
            _detail.type = 0
            _detail.goodsSkuId = v.goodsSkuId
            _detail.quantity = v.quantity
            _detail.discountMoney = 0
            _detail.money = 0
            _detail.remark = '赠品'
          }else{
            if (index === num - 1) {
              v.discountMoney = mon + mod
            } else {
              v.discountMoney = mon
            }
            data.outTotalQuantity += Number(v.quantity)
            data.totalMoney += Number((v.money * v.discountRate*v.quantity).toFixed(2))
            _detail.type = 0
            _detail.goodsSkuId = v.goodsSkuId
            _detail.quantity = v.quantity
            _detail.discountMoney = v.discountMoney
            _detail.money = Number((v.money * v.discountRate*v.quantity ).toFixed(2))
            _detail.remark = v.remark
          }
          data.details.push(_detail)
        })
        data.orderMoney = data.totalMoney - data.totalDiscountMoney
        postSellApply(data).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: res.data.message+res.data.detail,
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          Object.assign(this.$data, this.$options.data())
          this.getDefaultRetailFun()
          this.getClientsFun()
          this.getWarehousesFun()
          this.getBankAccountFun()
        })
      },

    }
  }
</script>

<style lang='scss' scoped>

  .el-checkbox-group {
    /deep/ .el-checkbox__input {
      display: none;
    }
  }

  .input-con {
    div {
      margin-bottom: 10px;
      p{
        margin-right: 10px;
      }
    }
  }

  .el-card__body {
    div {
      margin-bottom: 10px;
    }
  }

  .icon-box {
    > div {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      > label {
        /deep/ .el-checkbox__label {
          padding-left: 0;
        }
        display: inline-block;
        margin-left: 0;
        margin-right: 10px;
        width: 50px;
        .icon-item {
          display: flex;
          flex-direction: column;
        }
      }
      i {
        font-style: normal;
        text-align: center;
        margin-top: 5px;
        font-size: 14px;
      }
      img {
        cursor: pointer;
        width: 100%;
      }
    }
  }
</style>
