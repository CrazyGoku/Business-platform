import { getBankAccount } from '@/service/PurchaseAndSale/common.js'

export default {
  data() {
    return {
      bankAccountList: []
    }
  },
  mounted() {
    this.getBankAccountFun()
  },
  methods: {
    getBankAccountFun() {
      const params = {
        storeId: this.storeId
      }
      getBankAccount(params).then(res => {
        this.bankAccountList = res.data.data
      })
    }
  }
}
