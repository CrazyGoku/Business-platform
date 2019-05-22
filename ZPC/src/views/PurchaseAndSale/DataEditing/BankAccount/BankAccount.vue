<template>
  <div>
    <div class="handle-bar">
      <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="dialogVisible1 = true; dialogTitle1 = '添加银行账户';isEdit = false;bankAccountDetail = {}">
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
        :data="bankAccountList"
        :pagination-data="paginationData"
        @paginationChange="getBankAccountDataFun"
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
        <el-input v-model="bankAccountDetail.name" placeholder="请输入科目名称" size="mini">
          <template slot="prepend">
            科目名称
          </template>
        </el-input>
        <el-input v-model="bankAccountDetail.id" placeholder="请输入科目编号" size="mini">
          <template slot="prepend">
            科目编号
          </template>
        </el-input>
        <el-input v-model="bankAccountDetail.head" placeholder="请输入户主名" size="mini">
          <template slot="prepend">
            户主名
          </template>
        </el-input>
        <el-input v-model="bankAccountDetail.account" placeholder="请输入账户" size="mini">
          <template slot="prepend">
            账户
          </template>
        </el-input>
        <el-input v-model="bankAccountDetail.address" placeholder="请输入地址" size="mini">
          <template slot="prepend">
            地址
          </template>
        </el-input>
        <el-select
          v-model="bankAccountDetail.type"
          clearable
          size="mini"
          placeholder="请选择账户类型"
        >
          <el-option
            v-for="item in typeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select><el-select
          v-model="bankAccountDetail.gathering"
          clearable
          size="mini"
          placeholder="请选择是否用于商城收款"
        >
          <el-option
            v-for="item in gatheringOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="bankAccountDetail.procurement"
          clearable
          size="mini"
          placeholder="请选择是否用于订货平台"
        >
          <el-option
            v-for="item in procurementOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="bankAccountDetail.remark" placeholder="请输入备注" size="mini">
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
import { getBankAccountData, postBankAccountData, delBankAccountData, findBankAccountById, putBankAccountData } from '@/service/PurchaseAndSale/DataEditing/BankAccount.js'
import common from '@/mixins/common'

export default {
  name: 'BankAccount',
  components: {
    SelectTable,
    Tree,
    TransverseShrinkBox
  },
  mixins: [common],
  data() {
    return {
      bankAccountList: {},
      bankAccountDetail: {},
      selectArr: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      filterData: {
        bankAccountId: ''
      },
      dialogVisible1: false,
      dialogTitle1: '',
      isEdit: false,
      typeMap: {
        '1': '现金',
        '2': '支付宝',
        '3': '微信',
        '4': '银行卡'
      },
      procurementMap: {
        '0': '否',
        '1': '是'
      },
      gatheringMap: {
        '0': '否',
        '1': '是'
      },
      typeOption: [{ name: '现金', id: 1 }, { name: '支付宝', id: 2 }, { name: '微信', id: 3 }, { name: '银行卡', id: 4 }],
      procurementOption: [{ name: '否', id: 0 }, { name: '是', id: 1 }],
      gatheringOption: [{ name: '否', id: 0 }, { name: '是', id: 1 }]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // getCommodityData()
    this.getBankAccountDataFun()
  },
  methods: {
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    deleteRow(index, row, more) {
      /* if(this.bankAccountList.length===1){
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
      delBankAccountData(params).then(res => {
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
        this.getBankAccountDataFun()
      })
    },
    moreDel() {
      this.deleteRow('', '', true)
    },
    editRow(index, row) {
      this.dialogVisible1 = true
      this.isEdit = true
      this.dialogTitle1 = '编辑银行账户'
      console.log(row)
      this.bankAccountDetail = JSON.parse(JSON.stringify(row))
      console.log(this.bankAccountDetail)
      this.bankAccountDetail.type = this.typeOption.filter(v => {
        return v.name === row.type
      })[0].id
      this.bankAccountDetail.procurement = this.procurementOption.filter(v => {
        return v.name === row.procurement
      })[0].id
      this.bankAccountDetail.gathering = this.gatheringOption.filter(v => {
        return v.name === row.gathering
      })[0].id
    },
    getBankAccountDataFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getBankAccountData(params).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          console.log(item)
          item.procurement = this.procurementMap[item.procurement]
          item.type = this.typeMap[item.type]
          item.gathering = this.gatheringMap[item.gathering]
        })
        this.bankAccountList = res.data.data
        this.paginationData = data.pageVo
      })
    },
    cancleHandle1() {
      this.bankAccountDetail = {}
      this.dialogVisible1 = false
    },
    confirmHandle1() {
      const params = {
        ...this.bankAccountDetail
      }
      params.storeId = this.storeId
      params.userId = this.userId
      const func = this.isEdit ? putBankAccountData : postBankAccountData
      const magSuccess = this.isEdit ? '成功编辑银行账户' : '成功添加银行账户'
      const failSuccess = this.isEdit ? '编辑银行账户失败' : '添加银行账户失败'
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
        this.bankAccountDetail = {}
        this.paginationData = {
          page: 1,
          pageSize: 10
        }
        this.getBankAccountDataFun()
        this.dialogVisible1 = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
