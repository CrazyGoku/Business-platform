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
      <el-input v-model="filterData.id" placeholder="请输入客户编号/名称" size="mini">
        <template slot="prepend">
          筛选条件
        </template>
      </el-input>
      <el-input v-model="filterData.name" placeholder="请输入客户名称" size="mini">
        <template slot="prepend">
          客户名称
        </template>
      </el-input>
      <el-input v-model="filterData.phone" maxlength="11" placeholder="请输入客户手机号" size="mini">
        <template slot="prepend">
          客户手机号
        </template>
      </el-input>
      <el-input v-model="filterData.membershipNumber" placeholder="请输入会员卡号" size="mini">
        <template slot="prepend">
          会员卡号
        </template>
      </el-input>
      <el-select v-model="filterData.levelId" size="mini" clearable placeholder="请选择会员等级">
        <el-option
          v-for="item in levelList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="filterData.disabled" size="mini" clearable placeholder="请选择是否禁用">
        <el-option
          label="是"
          value="1"
        />
        <el-option
          label="否"
          value="0"
        />
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchBtn">
          查询
        </el-button>
      </div>
    </div>
    <select-table
      v-model="selectArr"
      :is-select="true"
      :data="customersList"
      :pagination-data="paginationData"
      @paginationChange="getCustomerDataFun"
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
            @click.native.prevent="checkIntegral(scope.row,scope.$index)"
          >
            查看积分
          </el-button>

          <el-button
            type="text"
            size="small"
            @click.native.prevent="filterData2 = {};checkIntegralDetail(scope.row,scope.$index)"
          >
            查看明细
          </el-button>
        </template>
      </el-table-column>
    </select-table>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogIntegralVisible" title="查看用户积分预收余额">
      <!--<select-table :data="integraDetail" :pagination-data="paginationData2" />-->
      <p>积分:{{ integraDetail.integral }}</p>
      <p>预收余额:{{ integraDetail.advanceMoney }}</p>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="80%" :visible.sync="dialogIntegralDetail" title="查看用户积分预收余额">
      <div class="search-bar">
        <el-select v-model="filterData2.type" size="mini" clearable placeholder="请选择操作类型" @change="checkIntegralDetail">
          <el-option
            label="增加"
            value="1"
          />
          <el-option
            label="减少"
            value="0"
          />
        </el-select>
      </div>
      <select-table :data="integraDetailList" :pagination-data="paginationData2" @paginationChange="checkIntegralDetail" />
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="isEdit?'编辑客户':'添加客户'" :visible.sync="addDialog">
      <div class="dialog-content-input">
        <el-input v-model="addData.name" placeholder="请输入客户名称" size="mini">
          <template slot="prepend">
            客户名称
          </template>
        </el-input>
        <el-input v-model="addData.phone" maxlength="11" placeholder="请输入客户手机号" size="mini">
          <template slot="prepend">
            客户手机号
          </template>
        </el-input>
        <el-input v-model="addData.membershipNumber" placeholder="请输入会员卡号" size="mini">
          <template slot="prepend">
            会员卡号
          </template>
        </el-input>
        <el-input v-model="addData.inviterId" placeholder="请输入邀请人ID" size="mini">
          <template slot="prepend">
            邀请人ID
          </template>
        </el-input>
        <el-input v-model="addData.inviterPhone" maxlength="11" placeholder="请输入邀请人电话" size="mini">
          <template slot="prepend">
            邀请人电话
          </template>
        </el-input>
        <el-input v-model="addData.address" placeholder="请输入客户联系地址" size="mini">
          <template slot="prepend">
            客户联系地址
          </template>
        </el-input>

        <el-input v-model="addData.postcode" placeholder="请输入客户邮编" size="mini">
          <template slot="prepend">
            客户邮编
          </template>
        </el-input>
        <el-select v-model="addData.levelId" size="mini" placeholder="请选择客户级别">
          <el-option
            v-for="item in levelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="addData.birthday"
          type="date"
          size="mini"
          placeholder="请选择客户生日"
        />
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
// import {getCommodityData} from '@/service/PurchaseAndSale/DataEditing/CommodityAdd'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import Tree from '@/components/Tree/Tree' // 树状图组件
import TransverseShrinkBox from '@/components/TransverseShrinkBox/TransverseShrinkBox' // 收缩弹性盒子
import {getStore} from '@/service/common'
import { getCustomerData, getIntegralsDetails, getLevelData, postClients, getClientsIntegral } from '@/service/PurchaseAndSale/DataEditing/VIPCustomer.js'
import common from '@/mixins/common'
export default {
  name: 'VIPCustomer',
  components: {
    SelectTable,
    Tree,
    TransverseShrinkBox
  },
  mixins: [common],
  data() {
    return {
      integraDetailList: [],
      addDialog: false,
      isEdit: false,
      commodityList: {
      },
      selectArr: [],
      filterData: {
      },
      filterData2: {},
      customersList: [],
      disabledMap: {
        '1': '停用',
        '0': '启用'
      },
      dialogIntegralVisible: false,
      dialogIntegralDetail: false,
      paginationData2: {
        page: 1,
        pageSize: 10
      },
      integraDetail: [],
      addData: {
        name: '',
        phone: '',
        levelId: '',
        membershipNumber: '',
        inviterPhone: '',
        inviterId: '',
        birthday: '',
        address: '',
        postcode: ''
      },
      levelList: [],
      chioceRow: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getCustomerDataFun()
    this.getLevelDataFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getCustomerDataFun()
    },
    addBtn() {
      this.isEdit = false
      this.addData = {
        name: '',
        phone: '',
        levelId: '',
        membershipNumber: '',
        inviterPhone: '',
        inviterId: '',
        birthday: '',
        address: '',
        postcode: ''
      }
      this.addDialog = true
    },
    cancleHandle() {
      this.addDialog = false
    },
    confirmHandle() {
      this.addData.userId = this.userId
      this.addData.inviterPhone = this.addData.inviterPhone?this.addData.inviterPhone:''
      this.addData.inviterId =  this.addData.inviterId?this.addData.inviterId: ''
      if(!this.addData.inviterId && !this.addData.inviterPhone){
        getStore(this.storeId).then(res=>{
          let data  = res.data.data
          this.addData.inviterPhone = data.clientPhone
          this.addData.inviterId =  data.clientId
          postClients(this.addData).then(res => {
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
              message: '添加成功',
              type: 'success'
            })
            this.getCustomerDataFun()
            this.addDialog = false
          })
        })
        return
      }
      postClients(this.addData).then(res => {
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
          message: '添加成功',
          type: 'success'
        })
        this.getCustomerDataFun()
        this.addDialog = false
      })
    },
    getCustomerDataFun() {
      if (!this.filterData.id) {
        delete this.filterData.id
      }
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getCustomerData(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.disabled = this.disabledMap[v.disabled]
        })
        this.customersList = data
        this.paginationData = data.pageVo
      })
    },
    checkIntegral(row) {
      this.dialogIntegralVisible = true
      const params = {
        clientId: row.id,
        storeId: this.storeId,
        page: 1,
        pageSize: 100
      }
      getClientsIntegral(params).then(res => {
        this.integraDetail = res.data.data.items[0]
      })
    },
    checkIntegralDetail(row) {
      if (row) {
        this.chioceRow = row
        this.paginationData2.page = 1
      }
      this.dialogIntegralDetail = true
      const params = {
        clientId: this.chioceRow.id,
        storeId: this.storeId,
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize,
        ...this.filterData2
      }
      getIntegralsDetails(params).then(res => {
        const data = res.data.data
        this.integraDetailList = data
        this.paginationData2 = data.pageVo
      })
    },
    getLevelDataFun() {
      const params = {

      }
      getLevelData(params).then(res => {
        this.levelList = res.data.data
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
