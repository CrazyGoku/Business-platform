<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="dialogVisible1 = true; dialogTitle1 = '添加标签';isEdit = false;labelDetail = {}"
      >
        添加
      </el-button>
      <el-button type="primary" icon="el-icon-remove-outline" size="mini" @click="moreDel">
        批量删除
      </el-button>
    </div>
    <div class="flex-center">
      <select-table
        v-model="selectArr"
        :is-select="true"
        :data="labelsList"
        :pagination-data="paginationData"
        @paginationChange="getGoodsLabelsFun"
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
    <el-dialog :close-on-click-modal="false"
               :title="dialogTitle1"
               :visible.sync="dialogVisible1"
               width="80%"
    >
      <div class="dialog-content-input">
        <el-input v-model="labelDetail.name" placeholder="请输入标签名" size="mini">
          <template slot="prepend">
            请输入标签名
          </template>
        </el-input>
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
    getGoodsLabels,
    postGoodsLabels,
    delGoodsLabels,
    findIncomeExpensesById,
    putGoodsLabels
  } from '@/service/PurchaseAndSale/DataEditing/Label.js'
  import common from '@/mixins/common'

  export default {
    name: 'Label',
    components: {
      SelectTable,
      Tree,
      TransverseShrinkBox
    },
    mixins: [common],
    data() {
      return {
        labelsList: {},
        labelDetail: {},
        selectArr: [],
        paginationData: {
          page: 1,
          pageSize: 10
        },
        filterData: {
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
      this.getGoodsLabelsFun()
    },
    methods: {
      searchBtn(){
        this.paginationData.page = 1
        this.getGoodsLabelsFun()
      },
      deleteHandle() {
        console.log('delete')
      },
      addHandle() {
        console.log(this.$refs.TransverseShrinkBox.test(), 123213)
      },
      deleteRow(index, row, more) {
        /* if(this.labelsList.length===1){
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
        delGoodsLabels(params).then(res => {
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
            message: '删除成功',
            type: 'success'
          })
          this.getGoodsLabelsFun()
        })
      },
      moreDel() {
        this.deleteRow('', '', true)
      },
      editRow(index, row) {
        this.dialogVisible1 = true
        this.isEdit = true
        this.dialogTitle1 = '编辑标签'
        this.labelDetail = JSON.parse(JSON.stringify(row))
      },
      getGoodsLabelsFun() {
        const params = {
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        getGoodsLabels(params).then(res => {
          const data = res.data.data
          data.items.forEach(item => {
            console.log(item)
            item.checkItem = this.checkItemMap[item.checkItem]
            item.debitCredit = this.debitCreditMap[item.debitCredit]
            item.type = this.typeMap[item.type]
          })
          this.labelsList = data
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
        this.labelDetail = {}
        this.dialogVisible1 = false
      },
      confirmHandle1() {
        const params = {
          'storeId': this.storeId,
          ...this.labelDetail
        }
        const func = this.isEdit ? putGoodsLabels : postGoodsLabels
        const magSuccess = this.isEdit ? '成功编辑标签' : '成功添加标签'
        const failSuccess = this.isEdit ? '编辑标签失败' : '添加标签失败'
        func(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: failSuccess,
              type: 'error'
            })
            if (!this.isEdit) {
              this.labelDetail = {}
            }
            return
          }
          this.$message({
            showClose: true,
            message: magSuccess,
            type: 'success'
          })
          this.labelDetail = {}
          this.paginationData = {
            page: 1,
            pageSize: 10
          }
          this.getGoodsLabelsFun()
          this.dialogVisible1 = false
        })
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
