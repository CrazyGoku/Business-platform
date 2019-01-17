import { getDiscountCouponCanUse, getClients, getBankAccounts, getSellResultDetails } from '@/service/PurchaseAndSale/Sale/common.js'
import { dataFormat } from '@/utils/index.js'
export default {
  data() {
    return {
      addVisible: false,
      chioceSelect: {
        inWarehouseId: '',
        goodType: '',
        good: '',
        goodsSku: '',
        supplierId: '',
        outWarehouseId: '',
        clientId: '',
        discountCouponId: '',
        discountMoney: '',
        remark: '',
        totalDiscountMoney: '',
        bankAccountId: '',
        resultOrderId: ''
      },
      goodsVos: [],
      goodsSkuVos: [],
      choiceGoodsSku: [],
      isEdit: false,
      discountCouponCanUse: [],
      clientsList: [],
      isGetClient: false,
      discountCouponList: [],
      isGetBankAccount: false,
      bankAccountList: [],
      returnDetails: [],
      choiceClient: {}
    }
  },
  mounted() {
    this.getClientsFun()
  },
  watch: {},
  methods: {
    getBankAccountsFun() {
      if (this.isGetBankAccount) {
        return
      }
      const params = {
        storeId: this.storeId
      }
      getBankAccounts(params).then(res => {
        this.bankAccountList = res.data.data
        this.isGetBankAccount = true
      })
    },
    changeDiscountMoney() {
      this.$nextTick(() => {
        let discountCouponMoney = 0
        if (this.chioceSelect.discountCouponId) {
          discountCouponMoney = this.discountCouponList.filter(v => {
            return v.id === this.chioceSelect.discountCouponId
          })[0].money
        }
        const num = this.choiceGoodsSku.length
        this.chioceSelect.totalDiscountMoney = discountCouponMoney + Number(this.chioceSelect.discountMoney)
        const mod = this.chioceSelect.totalDiscountMoney % num
        const mon = parseInt(this.chioceSelect.totalDiscountMoney / num)
        this.choiceGoodsSku.forEach((v, index) => {
          if (index === num - 1) {
            v.discountMoney = mon + mod
          } else {
            v.discountMoney = mon
          }
        })
      })
    },
    changeClientId(value) {
      this.choiceClient = this.clientsList.filter(v => {
        console.log(v)
        return v.id === value
      })[0]
      this.getDiscountCouponCanUseFun(value)
    },
    getClientsFun() {
      if (this.isGetClient) {
        return
      }
      const params = {
        disabled: 0
      }
      getClients(params).then(res => {
        const data = res.data.data
        data.forEach(v => {
          v.name = v.name + '   ----   ' + v.clientLevel.name
        })
        this.clientsList = data
        this.isGetClient = true
      })
    },
    getDiscountCouponCanUseFun(clientId) {
      const params = {
        storeId: this.storeId,
        clientId
      }
      getDiscountCouponCanUse(params).then(res => {
        this.discountCouponList = res.data.data
      })
    },
    addBtnFun(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getSellResultDetails(params, path).then(res => {
        const data = res.data.data
        let totalOperatedQuantity = 0
        data.details.forEach(v=>{
          totalOperatedQuantity+=Number(v.operatedQuantity)
          v.quantity = v.quantity - v.operatedQuantity
        })
        if((data.totalQuantity-totalOperatedQuantity)===0){
          this.$message('订单全在操作中');
          return
        }
        this.chioceSelect.resultOrderId = row.id
        this.chioceSelect.outWarehouseId = data.procurementApplyOrderVo ? data.procurementApplyOrderVo.inWarehouseId : ''
        this.chioceSelect.inWarehouseId = data.sellApplyOrderVo ? data.sellApplyOrderVo.outWarehouseId : ''
        this.chioceSelect.supplierId = data.procurementApplyOrderVo ? data.procurementApplyOrderVo.supplierId : ''
        this.chioceSelect.remark = ''
        this.chioceSelect.client = data.sellApplyOrderVo ? data.sellApplyOrderVo.client.id : ''
        this.chioceSelect.totalDiscountMoney = data.totalDiscountMoney
        this.chioceSelect.discountMoney = data.discountMoney
        this.chioceSelect.totalMoney = data.totalMoney
        this.chioceSelect.orderMoney = data.orderMoney
        this.choiceGoodsSku = data.details
        this.addVisible = true
        this.choiceGoodsSku.forEach(v => {
          v.sku = eval(v.goodsSkuSku)
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
        })
        this.isEdit = false
      })
    },
    addBtn(index, row) {
      this.getBankAccountsFun()
      this.addVisible = true
      this.isEdit = false
      this.chioceSelect = {
        inWarehouseId: '',
        goodType: '',
        good: '',
        goodsSku: '',
        supplierId: '',
        outWarehouseId: '',
        clientId: '',
        discountCouponId: '',
        discountMoney: '',
        remark: '',
        totalDiscountMoney: '',
        bankAccountId: '',
        resultOrderId: ''
      }
      this.choiceGoodsSku = []
    },
    choiceOutWarehouse(value) {
      this.canUseFun(value)
      this.chioceSelect.outWarehouseId = value
      this.chioceSelect.inWarehouseId = value
      this.chioceSelect.goodType = ''
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
        console.log(eval(this.goodsSkuVos.sku))
        this.goodsSkuVos.forEach(v => {
          v.goodName = this.goodsVos.filter(v => {
            return v.id === value
          })[0].name
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
        })
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
      console.log(this.choiceGoodsSku)
      this.choiceGoodsSku.forEach(v => {
        this.$set(v, 'type', 1)
        this.$set(v, 'goodsSkuId', v.id)
        this.$set(v, 'quantity', 0)
        this.$set(v, 'goodName', v.goodName)
        this.$set(v, 'money', this.choiceClient.clientLevel.priceType == 1 ? v.retailPrice * this.choiceClient.clientLevel.price : v.vipPrice * this.choiceClient.clientLevel.price)
        this.$set(v, 'discountMoney', 0)
        this.$set(v, 'remark', '')
        this.$set(v, 'totalMoney', 0)
      })
    },
    deleteChoiceRow(index, row) {
      console.log(this.choiceGoodsSku, row)
      this.choiceGoodsSku = this.choiceGoodsSku.filter(v => {
        return v.id !== row.id
      })
    },
    quantityChange(row) {
      row.totalMoney = row.quantity * row.money
    },
    moneyChange(row) {
      row.totalMoney = row.quantity * row.money
    },
    discountChange(row) {
      let discountCouponMoney = 0
      if (this.chioceSelect.discountCouponId) {
        discountCouponMoney = this.discountCouponList.filter(v => {
          return v.id === this.chioceSelect.discountCouponId
        })[0].money
      }
      let totalDiscountMoney = 0
      this.choiceGoodsSku.forEach(v => {
        totalDiscountMoney += Number(v.discountMoney)
      })
      this.chioceSelect.discountMoney = totalDiscountMoney
      this.chioceSelect.totalDiscountMoney = Number(totalDiscountMoney) + Number(discountCouponMoney)
    }
  },
  computed: {}
}
