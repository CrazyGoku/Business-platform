<template>
  <div>
    <select-table
      :data="bankAccountList"
      :pagination-data="paginationData"
      @paginationChange="getBankFundFun"
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
            @click.native.prevent="editRow(scope.$index,scope.row)"
          >
            设置初期
          </el-button>
        </template>
      </el-table-column>
    </select-table>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="修改初期"
      width="60%"
    >
      <div class="dialog-content-input">
        <el-input v-model="opening.openingMoney" placeholder="请输入期初金额" size="mini">
          <template slot="prepend">
            期初金额
          </template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHandle">
          取 消
        </el-button>
        <el-button type="primary" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { putBankOpening, getBankFund } from '@/service/PurchaseAndSale/Setting/BankOpening.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { bankAccountMap } from '../config'
import common from '@/mixins/common'

export default {
  name: 'BankOpening',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      bankAccountList: [],
      dialogVisible: false,
      opening: {
        openingMoney: '',
        id: ''
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getBankFundFun()
  },
  methods: {
    getBankFundFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      getBankFund(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.type = bankAccountMap[v.type]
        })
        this.bankAccountList = res.data.data
        this.paginationData = res.data.data.pageVo
      })
    },
    editRow(index, row) {
      this.opening = {
        openingMoney: row.openingMoney,
        id: row.id
      }
      this.dialogVisible = true
    },
    cancelHandle() {
      this.opening = {
        openingMoney: '',
        id: ''
      }
      this.dialogVisible = false
    },
    confirmHandle() {
      if (this.opening.openingMoney < 0) {
        this.$message({
          message: '初期金额不能小于0',
          type: 'warning'
        })
        return
      }
      const params = {
        storeId: this.storeId,
        userId: this.userId,
        ...this.opening
      }
      putBankOpening(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '修改失败，请稍后重试',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        this.getBankFundFun()
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
