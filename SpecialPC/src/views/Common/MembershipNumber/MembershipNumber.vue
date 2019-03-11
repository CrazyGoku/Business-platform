<template>
  <div  style="padding: 30px">
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
      <el-input v-model="filterData.number" placeholder="会员卡号" size="mini">
        <template slot="prepend">
          会员卡号
        </template>
      </el-input>
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

    <div class="flex-center">
      <select-table
        :data="clientsList"
        :pagination-data="paginationData"
        @paginationChange="getClientsMembershipNumberFun"
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
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false" :title="isEdit?'编辑会员卡':'添加会员卡'" :visible.sync="addDialog">
      <div class="dialog-content-input">
        <el-input v-model="addData.startNumber" placeholder="请输入起始会员卡账号" size="mini">
          <template slot="prepend">
            起始会员卡账号
          </template>
        </el-input>
        <el-input v-model="addData.stopNumber" placeholder="请输入结束会员卡账号" size="mini">
          <template slot="prepend">
            结束会员卡账号
          </template>
        </el-input>
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
import common from '@/mixins/common'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import {
  getClientsMembershipNumber,
  postClientsMembershipNumber,
  putClientsMembershipNumber,
  delClientsMembershipNumber
} from '@/service/PurchaseAndSale/DataEditing/MembershipNumber.js'
import {disabledMap} from '@/views/PurchaseAndSale/config.js'
export default {
  name: 'MembershipNumber',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      clientsList: [],
      filterData:{},
      addData: {
        startNumber: '',
        stopNumber: '',
      },
      addDialog: false,
      isEdit: false,
      priceType: [
        {
          label: '零售价',
          value: '1'
        },
        {
          label: 'vip售价',
          value: '2'
        }]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getClientsMembershipNumberFun()
  },
  methods: {
    searchBtn(){
      this.paginationData.page = 1
      this.getClientsMembershipNumberFun()
    },
    addBtn() {
      this.isEdit = false
      this.addData = {
      }
      this.addDialog = true
    },
    getClientsMembershipNumberFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getClientsMembershipNumber(params,this.userId).then(res => {
        const data = res.data.data
        data.items.forEach(v=>{
          v.disabled = disabledMap[v.disabled]
        })
        this.clientsList = data
        this.paginationData = data.pageVo
      })
    },
    deleteRow(index, row) {
      const data = {
        ids: row.id
      }
      this.$confirm('此操作将删除该会员卡级别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delClientsMembershipNumber(data,this.userId).then(res => {
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
          this.getClientsMembershipNumberFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    editRow(index, row) {
      console.log(row)
      this.isEdit = true
      this.addData = {
        ...row
      }
      this.addDialog = true
    },
    cancleHandle() {
      this.addData = {
        name: '',
        priceType: '',
        price: ''
      }
      this.addDialog = false
    },
    confirmHandle() {
      const func = this.isEdit ? putClientsMembershipNumber : postClientsMembershipNumber
      const magSuccess = this.isEdit ? '成功编辑会员卡' : '添加会员卡成功'
      const failSuccess = this.isEdit ? '编辑会员卡失败' : '添加会员卡失败'
      console.log(this.addData)
      let data = []
      let len = this.addData.stopNumber.length
      let str = this.addData.stopNumber.replace(/[0-9]/g,'0')
      for (let i = Number(this.addData.startNumber);i<=Number(this.addData.stopNumber);i++){
        let _num = str + i
        console.log(str)
        data.push(_num.substring(_num.length-len))
      }
      console.log(data)
      func(data,this.userId).then(res => {
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
        this.getClientsMembershipNumberFun()
        this.addDialog = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
