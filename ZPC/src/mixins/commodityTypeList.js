import { getCommodityTypeData } from '@/service/PurchaseAndSale/common.js'

export default {
  data() {
    return {
      commodityTypeList: []
    }
  },
  mounted() {
    this.getCommodityTypeDataFun()
  },
  methods: {
    getCommodityTypeDataFun() {
      const params = {
        storeId: this.storeId
      }
      getCommodityTypeData(params).then(res => {
        this.commodityTypeList = res.data.data
      })
    }
  }
}
