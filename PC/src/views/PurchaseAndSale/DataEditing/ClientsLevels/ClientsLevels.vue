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
    <div class="flex-center">
      <select-table
        :data="clientsList"
        :pagination-data="paginationData"
        @paginationChange="getClientsLevelsFun"
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
    <el-dialog :close-on-click-modal="false" :title="isEdit?'编辑客户级别':'添加客户级别'" :visible.sync="addDialog">
      <div class="dialog-content-input">
        <el-input v-model="addData.name" placeholder="请输入客户级别名称" size="mini">
          <template slot="prepend">
            客户级别名称
          </template>
        </el-input>
        <el-select v-model="addData.priceType" size="mini" placeholder="请选择级别价格类型">
          <el-option
            v-for="item in priceType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <NumberInput v-model="addData.price" max="1" step="0.1">
          <template slot="prepend">
            级别默认价格
          </template>
        </NumberInput>
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
  getClientsLevels,
  postClientsLevels,
  putClientsLevels,
  delClientsLevels
} from '@/service/PurchaseAndSale/DataEditing/ClientsLevels.js'

export default {
  name: 'ClientsLevels',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      clientsList: [],
      addData: {
        name: '',
        priceType: '',
        price: ''
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
    this.getClientsLevelsFun()
  },
  methods: {
    addBtn() {
      this.isEdit = false
      this.addData = {
        name: '',
        priceType: '',
        price: ''
      }
      this.addDialog = true
    },
    getClientsLevelsFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize
      }
      getClientsLevels(params).then(res => {
        const data = res.data.data
        this.clientsList = data
        this.paginationData = data.pageVo
      })
    },
    deleteRow(index, row) {
      const data = {
        ids: row.id
      }
      this.$confirm('此操作将删除该客户级别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delClientsLevels(data).then(res => {
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
          this.getClientsLevelsFun()
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
      const func = this.isEdit ? putClientsLevels : postClientsLevels
      const magSuccess = this.isEdit ? '成功编辑客户级别' : '添加客户级别成功'
      const failSuccess = this.isEdit ? '编辑客户级别失败' : '添加客户级别失败'
      func(this.addData).then(res => {
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
        this.getClientsLevelsFun()
        this.addDialog = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
