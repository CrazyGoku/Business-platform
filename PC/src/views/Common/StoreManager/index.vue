<template>
  <div style="padding: 30px">
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="dialogVisible1 = true; dialogTitle1 = '添加店铺';isEdit = false;"
      >
        添加
      </el-button>
    </div>
    <div class="flex-center">
      <select-table
        :data="storeList"
        :pagination-data="paginationData"
        @paginationChange="getStoreFun"
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
              @click.native.prevent="initStore(scope.row)"
            >
              初始化数据
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
        <el-input v-model="storeDetail.name" placeholder="请输入店铺名" size="mini">
          <template slot="prepend">
            店铺名
          </template>
        </el-input>
        <el-input v-model="storeDetail.address" placeholder="请输入店铺地址" size="mini">
          <template slot="prepend">
            店铺地址
          </template>
        </el-input>
        <el-input v-model="storeDetail.boss" placeholder="请输入店长姓名" size="mini">
          <template slot="prepend">
            店长姓名
          </template>
        </el-input>
        <el-input v-model="storeDetail.phone" maxlength="11" placeholder="请输入店长手机" size="mini">
          <template slot="prepend">
            店长手机
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
  </div>
</template>

<script>
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { getStore, putStore, postStore, initialization } from '@/service/Common/StoreManager.js'
import common from '@/mixins/common'
import { disabledMap } from '@/views/PurchaseAndSale/config.js'
export default {
  name: 'StoreManager',
  components: {
    SelectTable
  },
  mixins: [common],
  data() {
    return {
      storeDetail: {},
      storeList: {},
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
    this.getStoreFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getStoreFun()
    },
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    initStore(row) {
      /* if(this.storeList.length===1){
            this.$message({
              showClose: true,
              message: '不能删除最后一个供应商',
              type: 'error'
            });
            return
          }*/
      const path = row.id
      this.$confirm('此操作将初始化店铺数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        initialization(path).then(res => {
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
            message: '初始化成功',
            type: 'success'
          })
          this.getStoreFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    moreDel() {
      this.initStore('', '', true)
    },
    editRow(index, row) {
      this.dialogVisible1 = true
      this.isEdit = true
      this.dialogTitle1 = '编辑店铺信息'
      this.storeDetail = JSON.parse(JSON.stringify(row))
    },
    getStoreFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getStore(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.disabledC = !v.disabled
          v.disabled = disabledMap[v.disabled]
        })
        this.storeList = data
      })
    },
    cancleHandle1() {
      this.storeDetail = {}
      this.dialogVisible1 = false
    },
    confirmHandle1() {
      const params = {
        'storeId': this.storeId,
        ...this.storeDetail
      }
      const func = this.isEdit ? putStore : postStore
      const magSuccess = this.isEdit ? '成功编辑店铺' : '成功添加店铺'
      const failSuccess = this.isEdit ? '编辑店铺失败' : '添加店铺失败'
      func(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: failSuccess,
            type: 'error'
          })
          if (!this.isEdit) {
            this.storeDetail = {}
          }
          return
        }
        this.$message({
          showClose: true,
          message: magSuccess,
          type: 'success'
        })
        this.storeDetail = {}
        this.paginationData = {
          page: 1,
          pageSize: 10
        }
        this.getStoreFun()
        this.dialogVisible1 = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
