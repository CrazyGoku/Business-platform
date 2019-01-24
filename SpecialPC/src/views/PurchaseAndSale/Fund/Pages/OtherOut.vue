<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addBtn"
      >
        添加
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.id" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-select
        v-model="filterData.bankAccountId"
        :disabled="isEdit"
        size="mini"
        filterable placeholder="请选择银行账户"
      >
        <el-option
          v-for="item in bankAccountList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="filterData.incomeExpensesId"
        :disabled="isEdit"
        size="mini"
        filterable placeholder="请选择收入类型"
      >
        <el-option
          v-for="item in incomeExpensesList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-cascader
        v-model="selectedOptions"
        :options="targetOption"
        style="margin:0 10px 10px 0"
        size="mini"
        placeholder="请选择来往单位"
        filterable
        clearable
      />
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
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchBtn">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        :data="orderFundList"
        :pagination-data="paginationData"
        @paginationChange="getOrderFun"
      >
        <el-table-column
          slot="handle"
          :fixed="true"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="redDashedFun(scope.$index,scope.row)"
            >
              红冲
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="addVisible" title="添加其他支出单">
      <div class="dialog-content-input">
        <div class="dialog-content-input">
          <el-cascader
            v-model="selectedOptions2"
            :options="targetOption2"
            style="margin:0 10px 10px 0"
            size="mini"
            placeholder="请选择来往单位"
            filterable
          />
        </div>
        <el-select
          v-model="addDetails.bankAccountId"
          :disabled="isEdit"
          size="mini"
          filterable placeholder="请选择账户"
        >
          <el-option
            v-for="item in bankAccountList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="addDetails.incomeExpensesId"
          :disabled="isEdit"
          size="mini"
          filterable placeholder="请选择收入类型"
        >
          <el-option
            v-for="item in incomeExpensesList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <NumberInput v-model="addDetails.money">
          <template slot="prepend">
            金额
          </template>
        </NumberInput>
        <el-input
          v-model="addDetails.remark"
          size="mini"
        >
          <template slot="prepend">
            备注
          </template>
        </el-input>
      </div>
      <div>
        <el-button style="float: right" size="mini" type="primary" @click="comfirm">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import common from '@/mixins/common'
  import canUseList from '@/mixins/canUseList.js'
  import {
    getClients,
    getSuppliers,
    getIncomeExpenses
  } from '@/service/PurchaseAndSale/common'
  import {
    getFundResult,
    postFundResult,
    postRedDashed
  } from '@/service/PurchaseAndSale/Fund/common'
  import bankAccountList from '@/mixins/bankAccountList.js'
  import { dataFormat } from '@/utils/index.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import { parseTime } from '@/utils'
  export default {
    name: 'OtherOut',
    components: { SelectTable },
    mixins: [common, canUseList, bankAccountList],
    data() {
      return {
        filterData: {
        },
        pickTime:'',
        targetOption2: [
          {
            value: 'kehu',
            label: '客户',
            children: []
          },
          {
            value: 'gongyingshang',
            label: '供应商',
            children: []
          }
        ],
        selectedOptions2:[],
        suppliersList: [],
        selectedOptions: [],
        targetOption: [
          {
            value: 'kehu',
            label: '客户',
            children: []
          },
          {
            value: 'gongyingshang',
            label: '供应商',
            children: []
          }
        ],
        orderFundList: [],
        addDetails:{
          remark: ''
        },
        addVisible:false,
        incomeExpensesList:[]
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getSuppliersFun()
      this.getClientsFun()
      this.getOrderFun()
      this.getIncomeExpensesFun()
    },
    methods: {
      addBtn(){
        this.addVisible = true
      },
      searchBtn() {
        this.paginationData.page = 1
        this.getOrderFun()
      },
      getIncomeExpensesFun(){
        const params = {
          storeId: this.storeId,
          type:2
        }
        getIncomeExpenses(params).then(res => {
          this.incomeExpensesList = res.data.data
        })
      },
      getSuppliersFun() {
        const params = {
          storeId: this.storeId
        }
        getSuppliers(params).then(res => {
          this.suppliersList = res.data.data
          const _suppliersList = []
          const _suppliersList2 = []
          this.suppliersList.forEach(v => {
            const _data = {
              value: v.name,
              label: v.name
            }
            const _data2 = {
              value: v.id,
              label: v.name
            }
            _suppliersList.push(_data)
            _suppliersList2.push(_data2)
          })
          this.targetOption[1].children = _suppliersList
          this.targetOption2[1].children = _suppliersList2
        })
      },
      getClientsFun() {
        const params = {
          disabled: 0
        }
        getClients(params).then(res => {
          const data = res.data.data
          const _clientsList = []
          const _clientsList2 = []
          data.forEach(v => {
            const _data = {
              value: v.id,
              label: v.name + '--' + v.username
            }
            _clientsList.push(_data)
            _clientsList2.push(_data)
          })
          this.targetOption[0].children = _clientsList
          this.targetOption2[0].children = _clientsList2
        })
      },
      redDashedFun(index, row) {
        const params = {
          storeId: this.storeId,
          id: row.id,
          userId: this.userId
        }
        this.$prompt('此操作将红冲此单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '可以输入备注'
        }).then((value) => {
          if (value.value) {
            params.remark = value.value
          }
          postRedDashed(params).then(res => {
            if (res.data.code !== 1001) {
              this.$message({
                showClose: true,
                message: '红冲失败',
                type: 'error'
              })
              return
            }
            this.$message({
              showClose: true,
              message: '红冲成功',
              type: 'success'
            })
            this.getOrderFun()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      getOrderFun(){
        if(!this.filterData.id){
          delete this.filterData.id
        }
        if(this.selectedOptions.length>0){
          this.filterData.targetName = this.selectedOptions[1]
        }else{
          delete this.filterData.targetName
        }
        this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
        this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
        const params = {
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        const path = '2'
        getFundResult(params, path).then(res => {
          const data = res.data.data
          this.orderFundList = data
          this.paginationData = data.pageVo
        })
      },
      comfirm(){
        let params = {
          "bankAccountId": this.addDetails.bankAccountId,
          "incomeExpensesId":  this.addDetails.incomeExpensesId,
          "money": this.addDetails.money,
          "remark ": this.remark,
          "storeId": this.storeId,
          "targetId": this.selectedOptions2[1],
          "type": 2,
          "userId": this.userId
        }
        console.log(params)
        postFundResult(params).then(res=>{
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: res.data.detail,
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          this.getOrderFun()
          this.addVisible = false
        })
      },
      /*readRow(index, row) {
        const params = {
          storeId: this.storeId
        }
        const path = row.id
        getStorageResultById(params, path).then(res => {
          const data = res.data.data
          const _data = dataFormat(data)
          if (_data.length > 0) {
            if (!this.isGetSkuMap) {
              const sku = eval(_data[0].goodsSkuSku)
              sku.forEach(v => {
                this.otherEntryMap.push({ key: v.key, name: v.key })
              })
              this.isGetSkuMap = true
            }
            _data.forEach(v => {
              let _itemSKU = {}
              const _sku = eval(v.goodsSkuSku)
              _sku.forEach(item => {
                _itemSKU = { [item.key]: item.value }
                Object.assign(v, _itemSKU)
              })
            })
          }
          this.orderDetails = _data
          this.orderVisible = true
        })
      },*/
    }
  }
</script>

<style lang='scss' scoped>

</style>
