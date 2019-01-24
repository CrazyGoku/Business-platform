<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="dialogVisible1 = true; dialogTitle1 = '添加仓库';isEdit = false"
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
        :data="staffList"
        :pagination-data="paginationData"
        @paginationChange="getRolesDataFun"
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
            <el-button
              type="text"
              size="small"
              @click.native.prevent="editFunction(scope.$index,scope.row)"
            >
              编辑功能
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false"
      :title="dialogTitle1"
      :visible.sync="dialogVisible1"
      width="400px"
    >
      <div class="dialog-content-input">
        <el-input v-model="staffDetail.name" placeholder="请输入角色名" size="mini">
          <template slot="prepend">
            角色名
          </template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancleHandle1">
          取 消
        </el-button>
        <el-button size="mini" type="primary" @click="confirmHandle1">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
      title="编辑功能"
      :visible.sync="dialogVisible2"
    >
      <div
        v-for="v1 in functions"
        :key="v1.id"
        style="margin-bottom: 10px;padding-bottom:5px;border-bottom: 1px solid #e0e0e0"
      >
        <el-checkbox v-model="v1.checkAll" :indeterminate="v1.indeterminate" @change="handleCheckAllChange(v1)">
          全选{{ v1.name }}
        </el-checkbox>
        <el-checkbox-group v-model="v1.checkList" @change="handleCheckedChange(v1)">
          <el-checkbox v-for="v2 in v1.children" :key="v2.id" :label="v2.id">
            {{ v2.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancleHandle2">
          取 消
        </el-button>
        <el-button size="mini" type="primary" @click="confirmHandle2">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import TransverseShrinkBox from '@/components/TransverseShrinkBox/TransverseShrinkBox' // 收缩弹性盒子
import {
  getRolesData,
  postRolesData,
  putRolesData,
  delRolesData,
  putRolesFunctions,
  getRolesFunctions
} from '@/service/PurchaseAndSale/DataEditing/StaffInformation.js'
import common from '@/mixins/common'
import { functions } from '@/router/functionConfig.js'

export default {
  name: 'StaffInformation',
  components: {
    SelectTable,
    TransverseShrinkBox
  },
  mixins: [common],
  data() {
    return {
      staffList: {},
      functions,
      choiceRow: {},
      isIndeterminate: false,
      staffDetail: {},
      selectArr: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      filterData: {
        staffId: ''
      },
      dialogVisible1: false,
      dialogVisible2: false,
      dialogTitle1: '',
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getRolesDataFun()
  },
  methods: {
    handleCheckAllChange(val) {
      if (val.checkAll) {
        val.checkList = []
        val.children.forEach(v => {
          val.checkList.push(v.id)
        })
      } else {
        val.checkList = []
      }
      val.isIndeterminate = false
    },
    handleCheckedChange(value) {
      const checkedCount = value.checkList.length
      value.checkAll = checkedCount === value.children.length
      value.isIndeterminate = checkedCount > 0 && checkedCount < value.children.length
    },
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    deleteRow(index, row, more) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
        delRolesData(params).then(res => {
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
          this.getRolesDataFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    moreDel() {
      this.deleteRow('', '', true)
    },
    editRow(index, row) {
      this.dialogVisible1 = true
      this.isEdit = true
      this.dialogTitle1 = '编辑角色信息'
      this.staffDetail = JSON.parse(JSON.stringify(row))
    },
    editFunction(index, row) {
      this.choiceRow = row
      const params = {
        storeId: this.storeId,
        roleId: row.id
      }
      getRolesFunctions(params).then(res => {
        const data = res.data.data
        this.functions.forEach(v1 => {
          v1.checkList = []
          v1.children.forEach(v2 => {
            data.forEach(v3 => {
              if (v3 === v2.id) {
                v1.checkList.push(v2.id)
              }
            })
          })
        })
        this.functions.forEach(v => {
          v.checkAll = v.checkList.length === v.children.length
        })
      })
      this.dialogVisible2 = true
    },
    getRolesDataFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      getRolesData(params).then(res => {
        this.staffList = res.data.data
        this.paginationData = res.data.data.pageVo
      })
    },
    cancleHandle1() {
      this.staffDetail = {}
      this.dialogVisible1 = false
    },
    cancleHandle2() {
      this.dialogVisible2 = false
    },
    confirmHandle2() {
      const data = {
        storeId: this.storeId,
        roleId: this.choiceRow.id,
        functionIds: []
      }
      this.functions.forEach(v => {
        if (v.checkList.length > 0) {
          data.functionIds.push(v.id)
          v.checkList.forEach(v2 => {
            data.functionIds.push(v2)
          })
        }
      })
      if (data.functionIds.length > 0) {
        data.functionIds.push(1)
      }
      putRolesFunctions(data).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '编辑失败',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '编辑成功',
          type: 'success'
        })
      })
      this.dialogVisible2 = false
      console.log(data)
    },
    confirmHandle1() {
      const params = {
        'storeId': this.storeId,
        ...this.staffDetail
      }
      const func = this.isEdit ? putRolesData : postRolesData
      const magSuccess = this.isEdit ? '成功编辑角色' : '成功添加角色'
      const failSuccess = this.isEdit ? '编辑角色失败' : '添加角色失败'
      func(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: failSuccess,
            type: 'error'
          })
          if (!this.isEdit) {
            this.staffDetail = {}
          }
          return
        }
        this.$message({
          showClose: true,
          message: magSuccess,
          type: 'success'
        })
        this.staffDetail = {}
        this.paginationData = {
          page: 1,
          pageSize: 10
        }
        this.getRolesDataFun()
        this.dialogVisible1 = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
