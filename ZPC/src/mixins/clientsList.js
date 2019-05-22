import { getClients } from '@/service/PurchaseAndSale/common.js'

export default {
  data() {
    return {
      clientsList: []
    }
  },
  mounted() {
    this.getClientsFun()
  },
  methods: {
    getClientsFun() {
      const params = {
        storeId: this.storeId,
        disabled: 0
      }
      getClients(params).then(res => {
        this.clientsList = res.data.data
      })
    }
  }
}
