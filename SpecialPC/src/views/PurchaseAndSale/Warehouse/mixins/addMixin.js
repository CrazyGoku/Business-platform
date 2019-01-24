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
        outWarehouseId: ''
      },
      goodsVos: [],
      goodsSkuVos: [],
      choiceGoodsSku: [],
      isEdit: false,
      addRemark: ''
    }
  },
  mounted() {

  },
  methods: {
    addBtn() {
      this.chioceSelect = {
        inWarehouseId: '',
        goodType: '',
        good: '',
        goodsSku: '',
        supplierId: '',
        outWarehouseId: ''
      }
      this.addRemark = ''
      this.selectedOptions = []
      this.choiceGoodsSku = []
      this.addVisible = true
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
      this.choiceGoodsSku.forEach(v => {
        this.$set(v, 'type', 1)
        this.$set(v, 'goodsSkuId', v.id)
        this.$set(v, 'quantity', 0)
        this.$set(v, 'money', 0)
        this.$set(v, 'totalMoney', 0)
        this.$set(v, 'discountMoney', 0)
        this.$set(v, 'remark', '')
        this.$set(v, 'checkMoneyC', v.checkMoney)
        this.$set(v, 'changeCheckTotalMoney', v.checkMoney*v.checkQuantity)
      })
    },
    deleteChoiceRow(index, row) {
      console.log(this.choiceGoodsSku, row)
      this.choiceGoodsSku = this.choiceGoodsSku.filter(v => {
        return v.id !== row.id
      })
      this.chioceSelect.goodsSku = ''
    },
    quantityChange(row,target) {
      if (!row.discountMoney) {
        row.totalMoney = row.quantity * row.money
      } else {
        row.totalMoney = row.quantity * (row.money - row.discountMoney)
      }
      row.changeCheckTotalMoney = row.checkQuantity * (row.checkMoneyC - row.checkMoney)
    },
    discountChange(row) {
      row.money = row.quantity * (row.purchasePrice - row.discountMoney)
    },
    moneyChange(row,target) {
      row.money = row.quantity * (row.purchasePrice - row.discountMoney)
      row.changeCheckTotalMoney = row.checkQuantity * (row.checkMoneyC - row.checkMoney)
    }
  },
  computed: {}
}

