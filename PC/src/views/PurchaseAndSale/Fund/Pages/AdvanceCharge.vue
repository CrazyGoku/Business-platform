<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addBtn"
      >
        添加预付款单
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.orderId" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-select
        v-model="filterData.supplier"
        clearable
        size="mini"
        placeholder="请选择供应商名"
      >
        <el-option
          v-for="item in suppliersList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-date-picker
        v-model="filterData.pickTime"
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
        <el-button type="primary" size="mini">
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
    <el-dialog :visible.sync="addVisible" :title="isEdit?'编辑付款单':'添加付款单'">
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
            预付金额
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
export default {
  name: 'AdvanceCollection',
  components: { SelectTable },
  mixins: [common, bankAccountList],
  data() {
    return {
      filterData: {
        orderId: '',
        pickTime: '',
        supplier: ''
      },
      targetOption: [
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
    // this.getClientsFun()
  },
  methods: {
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
      data.type = 4
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
        this.suppliersList.forEach(v => {
          const _data = {
            value: v.id,
            label: v.name
          }
          _suppliersList.push(_data)
        })
        this.targetOption[0].children = _suppliersList
      })
    },
    // getClientsFun() {
    //   let params = {
    //     disabled: 0
    //   }
    //   getClients(params).then(res => {
    //     let data = res.data.data
    //     let _clientsList = []
    //     data.forEach(v => {
    //       let _data = {
    //         value: v.id,
    //         label: v.name + '--' + v.username
    //       }
    //       _clientsList.push(_data)
    //     })
    //     this.targetOption[0].children = _clientsList
    //   })
    // },
    getOrderFundData() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      const path = '4'
      getOrderFund(params, path).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          item.orderStatus = statusMap[item.orderStatus]
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
