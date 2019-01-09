<template>
  <div>
    <div class="handle-bar">
      <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="dialogVisible1 = true; dialogTitle1 = '添加仓库';isEdit = false">
        添加
      </el-button>
      <el-button type="primary" icon="el-icon-remove-outline" size="mini" @click="moreDel">
        批量删除
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.warehouseId" placeholder="仓库编号/名称" size="mini">
        <template slot="prepend">
          筛选条件
        </template>
      </el-input>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="findWarehouseByIdFun">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        v-model="selectArr"
        :is-select="true"
        :data="warehouseList"
        :pagination-data="paginationData"
        @paginationChange="getWarehouseDataFun"
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
        <el-input v-model="warehouseDetail.name" placeholder="请输入仓库名" size="mini">
          <template slot="prepend">
            仓库名
          </template>
        </el-input>

        <el-input v-model="warehouseDetail.contacts" placeholder="请输入联系人" size="mini">
          <template slot="prepend">
            联系人
          </template>
        </el-input>
        <el-input v-model="warehouseDetail.contactNumber" placeholder="请输入联系电话" size="mini">
          <template slot="prepend">
            联系电话
          </template>
        </el-input>
        <el-input v-model="warehouseDetail.address" placeholder="请输入地址" size="mini">
          <template slot="prepend">
            地址
          </template>
        </el-input>
        <el-input v-model="warehouseDetail.postcode" placeholder="请输入邮编" size="mini">
          <template slot="prepend">
            邮编
          </template>
        </el-input>
        <el-input v-model="warehouseDetail.remark" placeholder="请输入备注" size="mini">
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
import { getWarehouseData, postWarehouseData, delWarehouseData, findWarehouseById, putWarehouseData } from '@/service/PurchaseAndSale/DataEditing/Warehouse.js'
import common from '@/mixins/common'

export default {
  name: 'Warehouse',
  components: {
    SelectTable,
    Tree,
    TransverseShrinkBox
  },
  mixins: [common],
  data() {
    return {
      warehouseList: {},
      warehouseDetail: {},
      selectArr: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      filterData: {
        warehouseId: ''
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
    this.getWarehouseDataFun()
  },
  methods: {
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    deleteRow(index, row, more) {
      /* if(this.warehouseList.length===1){
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
      delWarehouseData(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getWarehouseDataFun()
      })
    },
    moreDel() {
      this.deleteRow('', '', true)
    },
    editRow(index, row) {
      this.dialogVisible1 = true
      this.isEdit = true
      this.dialogTitle1 = '编辑仓库'
      this.warehouseDetail = JSON.parse(JSON.stringify(row))
    },
    getWarehouseDataFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      getWarehouseData(params).then(res => {
        this.warehouseList = res.data.data
      })
    },
    findWarehouseByIdFun() {
      const params = {
        storeId: this.storeId
      }
      const path = this.filterData.warehouseId
      findWarehouseById(params, path).then(res => {

      })
    },
    cancleHandle1() {
      this.warehouseDetail = {}
      this.dialogVisible1 = false
    },
    confirmHandle1() {
      const params = {
        'storeId': this.storeId,
        ...this.warehouseDetail
      }
      const func = this.isEdit ? putWarehouseData : postWarehouseData
      const magSuccess = this.isEdit ? '成功编辑仓库' : '成功添加仓库'
      const failSuccess = this.isEdit ? '编辑仓库失败' : '添加仓库失败'
      func(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: failSuccess,
            type: 'error'
          })
          if (!this.isEdit) {
            this.warehouseDetail = {}
          }
          return
        }
        this.$message({
          showClose: true,
          message: magSuccess,
          type: 'success'
        })
        this.warehouseDetail = {}
        this.paginationData = {
          page: 1,
          pageSize: 10
        }
        this.getWarehouseDataFun()
        this.dialogVisible1 = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
