<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="dialogVisible1 = true; dialogTitle1 = '添加操作员';isEdit = false;roles = []"
      >
        添加
      </el-button>
      <el-button type="primary" icon="el-icon-remove-outline" size="mini" @click="moreDel">
        批量删除
      </el-button>
    </div>
    <div class="search-bar">
      <el-select
        v-model="filterData.roleId"
        size="mini"
        clearable
        placeholder="请选择角色"
        @clear="searchBtn"
      >
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input v-model="filterData.name" placeholder="姓名" size="mini">
        <template slot="prepend">
          姓名
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
        :data="userList"
        :pagination-data="paginationData"
        @paginationChange="getUsersDataFun"
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
        <el-switch
          v-model="userDetail.disabledC"
          active-text="启用"
          inactive-text="禁用 "
        />
        <el-input v-model="userDetail.name" placeholder="请输入操作员名" size="mini">
          <template slot="prepend">
            操作员名
          </template>
        </el-input>
        <el-input v-model="userDetail.username" placeholder="请输入操作员登录账号" size="mini">
          <template slot="prepend">
            操作员登录账号
          </template>
        </el-input>
        <el-input v-model="userDetail.password" placeholder="请输入操作员登录密码" size="mini">
          <template slot="prepend">
            操作员登录密码
          </template>
        </el-input>
        <el-input v-model="userDetail.phone" maxlength="11" placeholder="请输入操作员手机号" size="mini">
          <template slot="prepend">
            操作员手机号
          </template>
        </el-input>
        <el-select
          v-model="roles"
          size="mini"
          multiple
          placeholder="请选角色"
        >
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
  </div>
</template>

<script>
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import TransverseShrinkBox from '@/components/TransverseShrinkBox/TransverseShrinkBox' // 收缩弹性盒子
import {
  getUsersData,
  postUsersData,
  putUsersData,
  delUsersData,
  getRolesData
} from '@/service/PurchaseAndSale/DataEditing/AllStaff.js'
import common from '@/mixins/common'
import { disabledMap } from '@/views/PurchaseAndSale/config.js'
export default {
  name: 'StaffInformation',
  components: {
    SelectTable,
    TransverseShrinkBox
  },
  mixins: [common],
  data() {
    return {
      userList: {},
      userDetail: {},
      roles: [],
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
      rolesList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getUsersDataFun()
    this.getRolesDataFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getUsersDataFun()
    },
    getRolesDataFun() {
      const params = {
        storeId: this.storeId
      }
      getRolesData(params).then(res => {
        this.rolesList = res.data.data
      })
    },
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    deleteRow(index, row, more) {
      /* if(this.userList.length===1){
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
      delUsersData(params).then(res => {
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
        this.getUsersDataFun()
      })
    },
    moreDel() {
      this.deleteRow('', '', true)
    },
    editRow(index, row) {
      this.dialogVisible1 = true
      this.isEdit = true
      this.dialogTitle1 = '编辑操作员信息'
      this.userDetail = JSON.parse(JSON.stringify(row))
    },
    getUsersDataFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getUsersData(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.disabledC = !v.disabled
          v.disabled = disabledMap[v.disabled]
        })
        this.userList = data
      })
    },
    findUsersByIdFun() {
      const params = {
        storeId: this.storeId
      }
      const path = this.filterData.userId
      findUsersById(params, path).then(res => {

      })
    },
    cancleHandle1() {
      this.userDetail = {}
      this.dialogVisible1 = false
    },
    confirmHandle1() {
      const params = {
        'storeId': this.storeId,
        id: this.userDetail.id,
        name: this.userDetail.name,
        username: this.userDetail.username,
        password: this.userDetail.password,
        phone: this.userDetail.phone,
        disabled: this.userDetail.disabledC ? '0' : '1',
        roles: this.userDetail.roles
      }
      const roles = []
      this.roles.forEach(v => {
        this.rolesList.forEach(v2 => {
          if (v === v2.id) {
            roles.push(v2)
          }
        })
      })
      params.roles = roles
      const func = this.isEdit ? putUsersData : postUsersData
      const magSuccess = this.isEdit ? '成功编辑操作员' : '成功添加操作员'
      const failSuccess = this.isEdit ? '编辑操作员失败' : '添加操作员失败'
      func(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: failSuccess,
            type: 'error'
          })
          if (!this.isEdit) {
            this.userDetail = {}
          }
          return
        }
        this.$message({
          showClose: true,
          message: magSuccess,
          type: 'success'
        })
        this.userDetail = {}
        this.paginationData = {
          page: 1,
          pageSize: 10
        }
        this.getUsersDataFun()
        this.dialogVisible1 = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
