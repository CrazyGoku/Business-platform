import { mapGetters } from 'vuex'
import {
  getSuppliers,
  getWarehouseData,
  canUse
} from '@/service/PurchaseAndSale/Sale/common.js'

export default {
  data() {
    return {
      suppliersList: [],
      warehouseList: [],
      useGood: []
    }
  },
  mounted() {
    this.getSuppliersData()
    this.getWarehouseDataFun()
  },
  methods: {
    getSuppliersData() {
      const params = {
        storeId: this.storeId
      }
      getSuppliers(params).then(res => {
        this.suppliersList = res.data.data
      })
    },
    getWarehouseDataFun() {
      const params = {
        storeId: this.storeId
      }
      getWarehouseData(params).then(res => {
        this.warehouseList = res.data.data
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
    }
  },
  computed: {
    ...mapGetters(['storeId', 'userId'])
  }
}
