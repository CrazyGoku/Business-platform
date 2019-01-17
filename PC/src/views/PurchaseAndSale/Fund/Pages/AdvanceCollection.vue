<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addBtn"
      >
        添加预收款单
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.id" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
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
        v-model="selectArr"
        :is-select="true"
        :data="orderFundList"
        :pagination-data="paginationData"
        @paginationChange="getOrderFundData"
      >
        <el-table-column
          slot="handle"
          :fixed="true"
          label="操作"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="redRow(scope.$index,scope.row)"
            >
              红冲
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="addVisible" :title="isEdit?'编辑收款单':'添加收款单'">
      <div class="dialog-content-input">
        <el-cascader
          v-model="addDetails.selectedOptions"
          :options="targetOption"
          style="margin:0 10px 10px 0"
          size="mini"
          placeholder="请选择来往单位"
          filterable
        />
        <el-select
          v-model="addDetails.bankAccountId"
          clearable
          size="mini"
          placeholder="请选择银行账户"
        >
          <el-option
            v-for="item in bankAccountList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <NumberInput v-model="addDetails.money">
          <template slot="prepend">
            预收金额
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

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancleHandle">
          取 消
        </el-button>
        <el-button size="mini" type="primary" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/mixins/common'
import { getSuppliers, getOrderFund, postRedDashed, getClients, postFundOrder } from '@/service/PurchaseAndSale/Fund/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import bankAccountList from '@/mixins/bankAccountList.js'
import { statusMap } from '../config'
import { parseTime } from '@/utils'

export default {
  name: 'AdvanceCollection',
  components: { SelectTable },
  mixins: [common, bankAccountList],
  data() {
    return {
      filterData: {
      },
      pickTime:'',
      selectedOptions:[],
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
      addDetails: {
        remark: ''
      },
      suppliersList: [],
      orderFundList: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      selectArr: [],
      addVisible: false,
      isEdit: false
    }
  },

  computed: {},
  watch: {},
  mounted() {
    this.getSuppliersFun()
    this.getOrderFundData()
    this.getClientsFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getOrderFundData()
    },
    addBtn() {
      this.addVisible = true
      this.addDetails = {
      }
    },
    cancleHandle() {

    },
    confirmHandle() {
      const data = {
        ...this.addDetails
      }
      data.type = 3
      data.userId = this.userId
      data.storeId = this.storeId
      data.targetId = this.addDetails.selectedOptions[1]
      postFundOrder(data).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '添加失败',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.getOrderFundData()
      })
      this.addVisible = false
      console.log(data)
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
            value: v.id,
            label: v.name
          }
          const _data2 = {
            value: v.name,
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
          const _data2 = {
            value: v.name,
            label: v.name + '--' + v.username
          }
          _clientsList.push(_data)
          _clientsList2.push(_data2)
        })
        this.targetOption[0].children = _clientsList
        this.targetOption2[0].children = _clientsList2
      })
    },
    getOrderFundData() {
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
      const path = '3'
      getOrderFund(params, path).then(res => {
        const data = res.data.data
        let typeMap = {
          1: '收款单', 2: '付款单', 3: '预收款单', 4: '预付款单'
        }
        data.items.forEach(item => {
          item.type = typeMap[item.type]
        })
        this.orderFundList = data
        this.paginationData = data.pageVo
      })
    },
    deleteRow(index, row, more) {
    },
    editRow(index, row) {
    },
    redRow(index, row) {
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
          this.getOrderFundData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
