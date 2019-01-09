import { mapGetters } from 'vuex'
import NumberInput from '@/components/NumberInput'
export default {
  data() {
    return {
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
    NumberInput
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['storeId', 'userId'])
  }
}
