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
        <el-input v-model="staffDetail.name" placeholder="请输入角色名" size="mini">
          <template slot="prepend">
            角色名
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
import TransverseShrinkBox from '@/components/TransverseShrinkBox/TransverseShrinkBox' // 收缩弹性盒子
import { getRolesData, postRolesData, putRolesData, delRolesData } from '@/service/PurchaseAndSale/DataEditing/StaffInformation.js'
import common from '@/mixins/common'
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
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    deleteRow(index, row, more) {
      /* if(this.staffList.length===1){
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
    getRolesDataFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      getRolesData(params).then(res => {
        this.staffList = res.data.data
        this.paginationData = data.pageVo
      })
    },
    cancleHandle1() {
      this.staffDetail = {}
      this.dialogVisible1 = false
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
