import { getWarehouses } from '@/service/PurchaseAndSale/common.js'
export default {
  data() {
    return {
      warehouseList: []
    }
  },
  mounted() {
    this.getWarehousesFun()
  },
  methods: {
    getWarehousesFun() {
      const params = {
        storeId: this.storeId
      }
      getWarehouses(params).then(res => {
        this.warehouseList = res.data.data
      })
    }
  }
}
