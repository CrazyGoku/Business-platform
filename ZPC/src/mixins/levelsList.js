import { getLevelData } from '../service/PurchaseAndSale/DataEditing/VIPCustomer'

export default {
  data() {
    return {
      levelsList: []
    }
  },
  mounted() {
    this.getLevelDataC()
  },
  methods: {
    getLevelDataC() {
      getLevelData().then(res => {
        this.levelsList = res.data.data
      })
    }
  }
}
