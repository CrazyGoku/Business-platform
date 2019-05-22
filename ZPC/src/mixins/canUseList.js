import { canUse } from '@/service/PurchaseAndSale/common.js'
export default {
  data() {
    return {
      useGood: []
    }
  },
  mounted() {

  },
  methods: {
    canUseFun(warehouseId) {
      const params = {
        storeId: this.storeId,
        warehouseId
      }
      canUse(params).then(res => {
        this.useGood = res.data.data
        this.useGood.forEach(v => {
          v.checkMoneyC = v.checkMoney
        })
        if (res.data.data.length <= 0) {
          this.$message({
            message: '该仓库没有可用商品',
            type: 'warning'
          })
        }
      })
    }
  }
}
