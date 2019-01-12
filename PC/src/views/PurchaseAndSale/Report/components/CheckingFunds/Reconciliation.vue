<template>
  <div>
    <div class="search-bar">
      <el-date-picker
        v-model="pickTime"
        :picker-options="pickerOptions"
        type="daterange"
        align="right"
        unlink-panels
        size="mini"
        range-separator="至"
        start-placeholder="单据日期（起）"
        end-placeholder="单据日期（止）"
      />
      <el-select
        v-model="filterData.bankAccountId"
        size="mini"
        placeholder="选择银行账户"
      >
        <el-option
          v-for="item in bankAccountList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchBtn">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        :data="fundList"
        :pagination-data="paginationData"
        @paginationChange="getFundList"
      >
      </select-table>
    </div>
  </div>
</template>

<script>
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import common from '@/mixins/common'
  import {getFundCheck} from '@/service/PurchaseAndSale/Report/CheckingFunds.js'
  import { parseTime } from '@/utils'
  import { getBankAccount } from '@/service/PurchaseAndSale/common.js'
  import bankAccountList from '@/mixins/bankAccountList.js'
  export default {

    name: 'Flow',
    components: {
      SelectTable
    },
    mixins: [common,bankAccountList],
    data() {
      return {
        filterData:{
          bankAccountId:''
        },
        pickTime:[],
        fundList:[],
        bankAccountList: []
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getBankAccountFun()
    },
    methods: {
      searchBtn(){
        this.paginationData.page = 1
        this.getFundList()
      },
      getBankAccountFun() {
        const params = {
          storeId: this.storeId
        }
        getBankAccount(params).then(res => {
          this.bankAccountList = res.data.data
          this.filterData.bankAccountId = this.bankAccountList[0].id
          this.getFundList()
        })
      },
      getFundList() {
        if(this.pickTime===null || this.pickTime.length===0 ){
          this.pickTime = [new Date(),new Date()]
        }
        this.filterData.startTime = this.pickTime.length!==0 ? parseTime(this.pickTime[0]) : parseTime(new Date())
        this.filterData.endTime = this.pickTime.length!==0 ? parseTime(this.pickTime[1]) : parseTime(new Date())
        const params = {
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        getFundCheck(params).then(res => {
          this.fundList = res.data.data
        })
      },
    }
  }
</script>

<style lang='scss' scoped>

</style>
