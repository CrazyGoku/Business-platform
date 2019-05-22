<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="dialogVisible1 = true; dialogTitle1 = '添加供应商';isEdit = false"
      >
        添加
      </el-button>
      <el-button type="primary" icon="el-icon-remove-outline" size="mini" @click="moreDel">
        批量删除
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.name" placeholder="供应商名称" size="mini">
        <template slot="prepend">
          供应商名称
        </template>
      </el-input>
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
        :data="supplierList"
        :pagination-data="paginationData"
        @paginationChange="getSupplierDataFun"
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
      :close-on-click-modal="false"
      :title="dialogTitle1"
      :visible.sync="dialogVisible1"
      width="80%"
    >
      <div class="dialog-content-input">
        <el-input v-model="supplierDetail.name" placeholder="请输入供应商名称" size="mini">
          <template slot="prepend">
            供应商名称
          </template>
        </el-input>
        <el-input v-model="supplierDetail.id" placeholder="请输入供应商编号" size="mini">
          <template slot="prepend">
            供应商编号
          </template>
        </el-input>

        <el-input v-model="supplierDetail.contacts" placeholder="请输入联系人" size="mini">
          <template slot="prepend">
            联系人
          </template>
        </el-input>
        <el-input v-model="supplierDetail.contactNumber" max-lenth="11" placeholder="请输入联系电话" size="mini">
          <template slot="prepend">
            联系电话
          </template>
        </el-input>
        <el-input v-model="supplierDetail.contactAddress" placeholder="请输入联系地址" size="mini">
          <template slot="prepend">
            联系地址
          </template>
        </el-input>
        <el-input v-model="supplierDetail.fax" placeholder="请输入传真" size="mini">
          <template slot="prepend">
            传真
          </template>
        </el-input>
        <el-input v-model="supplierDetail.remark" placeholder="请输入备注" size="mini">
          <template slot="prepend">
            备注
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
  getSupplierData,
  postSupplierData,
  delSupplierData,
  findSupplierById,
  putSupplierData
} from '@/service/PurchaseAndSale/DataEditing/Supplier.js'
import common from '@/mixins/common'

export default {
  name: 'Supplier',
  components: {
    SelectTable,
    Tree,
    TransverseShrinkBox
  },
  mixins: [common],
  data() {
    return {
      supplierList: {},
      supplierDetail: {},
      selectArr: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      filterData: {
        supplierId: ''
      },
      dialogVisible1: false,
      dialogTitle1: '',
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // getCommodityData()
    this.getSupplierDataFun()
  },
  methods: {
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    deleteRow(index, row, more) {
      /* if(this.supplierList.length===1){
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
      console.log(index, row)
      delSupplierData(params).then(res => {
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
        this.getSupplierDataFun()
      })
    },
    moreDel() {
      this.deleteRow('', '', true)
    },
    editRow(index, row) {
      this.dialogVisible1 = true
      this.isEdit = true
      this.dialogTitle1 = '编辑供应商'
      this.supplierDetail = JSON.parse(JSON.stringify(row))
    },
    getSupplierDataFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getSupplierData(params).then(res => {
        const data = res.data.data
        this.supplierList = data
        this.paginationData = data.pageVo
      })
    },
    searchBtn() {
      this.paginationData.page = 1
      this.getSupplierDataFun()
    },
    cancleHandle1() {
      this.supplierDetail = {}
      this.dialogVisible1 = false
    },
    confirmHandle1() {
      if (this.isEdit) {
        delete this.supplierDetail.userId
        delete this.supplierDetail.storeId
      }
      const params = {
        'storeId': this.storeId,
        userId: this.userId,
        ...this.supplierDetail
      }
      const func = this.isEdit ? putSupplierData : postSupplierData
      const magSuccess = this.isEdit ? '成功编辑供应商' : '成功添加供应商'
      const failSuccess = this.isEdit ? '编辑供应商失败，请确认输入参数' : '添加供应商失败，请确认输入参数'
      func(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: failSuccess,
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: magSuccess,
          type: 'success'
        })
        this.supplierDetail = {}
        this.paginationData = {
          page: 1,
          pageSize: 10
        }
        this.getSupplierDataFun()
        this.dialogVisible1 = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
