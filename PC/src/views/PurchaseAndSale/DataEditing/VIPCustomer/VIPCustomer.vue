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
      <el-input v-model="filterData.vagueFilter" placeholder="请输入客户编号/名称" size="mini">
        <template slot="prepend">
          筛选条件
        </template>
      </el-input>
      <el-date-picker
        v-model="filterData.pickTime"
        :picker-options="pickerOptions"
        type="daterange"
        align="right"
        unlink-panels
        size="mini"
        range-separator="至"
        start-placeholder="最近交易（起）"
        end-placeholder="最近交易（止）"
      />
      <div style="width: 20px;">
        <el-button type="primary" size="mini">
          查询
        </el-button>
      </div>
    </div>
    <select-table v-model="selectArr" :is-select="true" :data="customersList" :pagination-data="paginationData">
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
            @click.native.prevent="checkIntegral(scope.row,scope.$index)"
          >
            查看积分
          </el-button>
        </template>
      </el-table-column>
    </select-table>
    <el-dialog :visible.sync="dialogIntegralVisible" title="查询用户积分">
      <select-table :data="integraList" :pagination-data="paginationData2" />
    </el-dialog>
    <el-dialog :title="isEdit?'编辑客户':'添加客户'" :visible.sync="addDialog">
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
import { getCustomerData, getIntegralsData, getLevelData, postClients } from '@/service/PurchaseAndSale/DataEditing/VIPCustomer.js'
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
      addDialog: false,
      isEdit: false,
      commodityList: {
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      selectArr: [],
      filterData: {
        vagueFilter: '',
        pickTime: ''
      },
      customersList: [],
      disabledMap: {
        '1': '停用',
        '0': '启用'
      },
      dialogIntegralVisible: false,
      paginationData2: {
        page: 1,
        pageSize: 10
      },
      integraList: [],
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
      levelList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getCustomerDataFun()
    this.getLevelDataFun()
  },
  methods: {
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
      postClients(this.addData).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '添加失败，请稍后重试',
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
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
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
      const params = {

      }
      getIntegralsData().then(res => {
        // this.levelList =res.data.data
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
