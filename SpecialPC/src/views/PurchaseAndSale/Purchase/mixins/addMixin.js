import { getOrderResultDetails } from '@/service/PurchaseAndSale/Purchase/common.js'
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
        id: ''
      },
      goodsVos: [],
      goodsSkuVos: [],
      choiceGoodsSku: [],
      isEdit: false

    }
  },
  mounted() {

  },
  methods: {
    addBtn() {
      this.addVisible = true
      this.isEdit = false
      this.chioceSelect = {
        inWarehouseId: '',
        goodType: '',
        good: '',
        goodsSku: '',
        supplierId: '',
        outWarehouseId: '',
        id: ''
      }
      this.choiceGoodsSku = []
    },
    addBtnFun(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getOrderResultDetails(params, path).then(res => {
        const data = res.data.data
        let totalOperatedQuantity = 0
        data.details = data.details.filter(v=>{
          totalOperatedQuantity+=Number(v.operatedQuantity)
          v.quantityC = v.quantity
          v.quantity = v.quantity - v.operatedQuantity
          return v.quantity !== 0
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
        console.log(data.details)
        this.addVisible = true
        this.isEdit = false
      })
    },
    choiceOutWarehouse(value) {
      this.canUseFun(value)
      this.chioceSelect.outWarehouseId = value
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
        this.goodsSkuVos.forEach(v => {
          v.goodsName = this.goodsVos.filter(v => {
            return v.id === value
          })[0].name
          console.log(v.sku)
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
        this.chioceSelect.goodsSku = this.goodsSkuVos[0].id
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
        this.$set(v, 'type', 1)
        this.$set(v, 'goodsSkuId', v.id)
        this.$set(v, 'quantity', '')
        this.$set(v, 'money', 0)
        this.$set(v, 'discountMoney', '')
        this.$set(v, 'remark', '')
      })
    },
    deleteChoiceRow(index, row) {
      console.log(this.choiceGoodsSku, row)
      this.choiceGoodsSku = this.choiceGoodsSku.filter(v => {
        return v.id !== row.id
      })
    },
    quantityChange(row) {
      if (row.discountMoney === '') {
        row.money = row.quantity * row.purchasePrice
      } else {
        row.money = row.quantity * (row.purchasePrice - row.discountMoney)
      }
    },
    discountChange(row) {
      row.money = row.quantity * (row.purchasePrice - row.discountMoney)
    }
  },
  computed: {}
}
