import { mapGetters } from 'vuex'
import { downloadFile } from '@/utils'
import NumberInput from '@/components/NumberInput'
import PrintBtn from '@/components/PrintBtn'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      loadingText: 'Loading',
      isUpload: false,
      priceTypeMap: {
        1: 'retailPrice',
        2: 'vipPrice',
        3: 'bossPrice'
      },
      putawayMap: [
        {
          id: 0,
          name: '未上架'
        }, {
          id: 1,
          name: '已上架'
        }
      ],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              const date = new Date()
              start.setTime(date.getTime() - 3600 * 1000 * 24)
              end.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      }
    }
  },
  components: {
    NumberInput,
    PrintBtn
  },
  watch: {
    loadingAction: {
      handler: function(newValue) {
        const loading = this.$loading({
          lock: true,
          text: this.loadingText,
          spinner: 'el-icon-loading',
          background: 'rgba(225, 225,225, 0.7)'
        })
        if (!newValue) {
          loading.close()
          if (!this.isUpload) {
            this.loadingText = 'Loading'
          }
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    downloadFile,
    getToken
  },
  computed: {
    ...mapGetters(['storeId', 'userId'])
  }
}
