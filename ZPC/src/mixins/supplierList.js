import { getSuppliers } from '@/service/PurchaseAndSale/common.js'

export default {
  data() {
    return {
      supplierList: []
    }
  },
  mounted() {
    this.getSupplierDataFun()
  },
  methods: {
    getSupplierDataFun() {
      const params = {
        storeId: this.storeId
      }
      getSuppliers(params).then(res => {
        this.supplierList = res.data.data
      })
    }
  }
}
