<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="dialogVisible1 = true; dialogTitle1 = '添加费用';isEdit = false"
      >
        添加
      </el-button>
      <el-button type="primary" icon="el-icon-remove-outline" size="mini" @click="moreDel">
        批量删除
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.incomeExpenseId" placeholder="费用编号/名称" size="mini">
        <template slot="prepend">
          筛选条件
        </template>
      </el-input>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="findIncomeExpensesByIdFun">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        v-model="selectArr"
        :is-select="true"
        :data="incomeExpenseList"
        :pagination-data="paginationData"
        @paginationChange="getIncomeExpensesDataFun"
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
              @click.native.prevent="deleteRow(scope.$index,scope.row,false)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="editRow(scope.$index,scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog
      :title="dialogTitle1"
      :visible.sync="dialogVisible1"
      width="80%"
    >
      <div class="dialog-content-input">
        <el-input v-model="incomeExpenseDetail.name" placeholder="请输入科目名称" size="mini">
          <template slot="prepend">
            科目名称
          </template>
        </el-input>
        <el-select
          v-model="incomeExpenseDetail.checkItem"
          clearable
          size="mini"
          placeholder="请选择核算项"
        >
          <el-option
            v-for="item in checkItemOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="incomeExpenseDetail.debitCredit"
          clearable
          size="mini"
          placeholder="请选择贷/借"
        >
          <el-option
            v-for="item in debitCreditOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="incomeExpenseDetail.type"
          clearable
          size="mini"
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in typeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleHandle1">
          取 消
        </el-button>
        <el-button type="primary" @click="confirmHandle1">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import Tree from '@/components/Tree/Tree' // 树状图组件
import TransverseShrinkBox from '@/components/TransverseShrinkBox/TransverseShrinkBox' // 收缩弹性盒子
import {
  getIncomeExpensesData,
  postIncomeExpensesData,
  delIncomeExpensesData,
  findIncomeExpensesById,
  putIncomeExpensesData
} from '@/service/PurchaseAndSale/DataEditing/CostType.js'
import common from '@/mixins/common'

export default {
  name: 'CostType',
  components: {
    SelectTable,
    Tree,
    TransverseShrinkBox
  },
  mixins: [common],
  data() {
    return {
      incomeExpenseList: {},
      incomeExpenseDetail: {},
      selectArr: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      filterData: {
        incomeExpenseId: ''
      },
      dialogVisible1: false,
      dialogTitle1: '',
      isEdit: false,
      checkItemMap: {
        1: '供应商', 2: '客户', 3: '往来单位', 4: '职员', 5: '部门'
      },
      debitCreditMap: {
        1: '贷',
        2: '借'
      },
      typeMap: {
        1: '收入',
        2: '支出'
      },
      checkItemOption: [{ name: '供应商', id: 1 }, { name: '客户', id: 2 }, { name: '往来单位', id: 3 }, { name: '职员', id: 4 }, { name: '部门', id: 5 }],
      debitCreditOption: [{ name: '贷', id: 1 }, { name: '借', id: 2 }],
      typeOption: [{ name: '收入', id: 1 }, { name: '支出', id: 2 }]

    }
  },
  computed: {},
  watch: {},
  mounted() {
    // getCommodityData()
    this.getIncomeExpensesDataFun()
  },
  methods: {
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    deleteRow(index, row, more) {
      /* if(this.incomeExpenseList.length===1){
          this.$message({
            showClose: true,
            message: '不能删除最后一个供应商',
            type: 'error'
          });
          return
        }*/
      const params = {
        storeId: this.storeId
      }
      if (!more) {
        params.ids = row.id
      } else {
        const arr = []
        this.selectArr.forEach(item => {
          arr.push(item.id)
        })
        params.ids = arr.join(',')
      }
      delIncomeExpensesData(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getIncomeExpensesDataFun()
      })
    },
    moreDel() {
      this.deleteRow('', '', true)
    },
    editRow(index, row) {
      this.dialogVisible1 = true
      this.isEdit = true
      this.dialogTitle1 = '编辑费用'
      this.incomeExpenseDetail = JSON.parse(JSON.stringify(row))
      this.incomeExpenseDetail.checkItem = this.checkItemOption.filter(v => {
        return v.name === row.checkItem
      })[0].id
      this.incomeExpenseDetail.type = this.typeOption.filter(v => {
        return v.name === row.type
      })[0].id
      this.incomeExpenseDetail.debitCredit = this.debitCreditOption.filter(v => {
        return v.name === row.debitCredit
      })[0].id
    },
    getIncomeExpensesDataFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      getIncomeExpensesData(params).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          console.log(item)
          item.checkItem = this.checkItemMap[item.checkItem]
          item.debitCredit = this.debitCreditMap[item.debitCredit]
          item.type = this.typeMap[item.type]
        })
        this.incomeExpenseList = data
        this.paginationData = data.pageVo
      })
    },
    findIncomeExpensesByIdFun() {
      const params = {
        storeId: this.storeId
      }
      const path = this.filterData.incomeExpenseId
      findIncomeExpensesById(params, path).then(res => {

      })
    },
    cancleHandle1() {
      this.incomeExpenseDetail = {}
      this.dialogVisible1 = false
    },
    confirmHandle1() {
      const params = {
        'storeId': this.storeId,
        ...this.incomeExpenseDetail
      }
      const func = this.isEdit ? putIncomeExpensesData : postIncomeExpensesData
      const magSuccess = this.isEdit ? '成功编辑费用' : '成功添加费用'
      const failSuccess = this.isEdit ? '编辑费用失败' : '添加费用失败'
      func(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: failSuccess,
            type: 'error'
          })
          if (!this.isEdit) {
            this.incomeExpenseDetail = {}
          }
          return
        }
        this.$message({
          showClose: true,
          message: magSuccess,
          type: 'success'
        })
        this.incomeExpenseDetail = {}
        this.paginationData = {
          page: 1,
          pageSize: 10
        }
        this.getIncomeExpensesDataFun()
        this.dialogVisible1 = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
