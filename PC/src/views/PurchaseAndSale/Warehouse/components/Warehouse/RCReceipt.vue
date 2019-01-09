<template>
  <div class="warrap" />
</template>

<script>
import common from '@/mixins/common'

export default {
  name: 'RCReceipt',
  mixins: [common],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
  },
  methods: {}
}
</script>

<style lang='scss' scoped>

</style>
<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.orderId" placeholder='请输入单据编号' size="mini">
        <template slot="prepend">单据编号</template>
      </el-input>
      <el-select
        v-model="filterData.supplier"
        clearable
        size="mini"
        placeholder="请选择供应商名">
        <el-option
          v-for="item in suppliersList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filterData.pickTime"
        type="daterange"
        align="right"
        unlink-panels
        size="mini"
        range-separator="至"
        start-placeholder="单据日期（起）"
        end-placeholder="单据日期（止）"
        :picker-options="pickerOptions">
      </el-date-picker>
      <div style="width: 20px;">
        <el-button type="primary" size="mini">查询</el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table :is-select="true" v-model="selectArr" :data="orderStorageList" :pagination-data="paginationData"
                    @paginationChange="getOrderStorageData"
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
              @click.native.prevent="redRow(scope.$index,scope.row)"
            >
              红冲
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import {getOrderStorage,postRedDashed} from '@/service/PurchaseAndSale/Warehouse/common.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import {
    getSuppliers
  } from '@/service/PurchaseAndSale/common'
  export default {
    name: "RCReceipt",
    mixins: [common],
    data() {
      return {
        filterData: {
          orderId: '',
          pickTime: '',
          supplier: ''
        },
        suppliersList: [],
        orderStorageList: [],
        paginationData: {
          page: 1,
          pageSize: 10
        },
        selectArr: []
      }
    },
    mounted() {
      this.getSuppliersData()
      this.getOrderStorageData()
    },
    methods: {
      getSuppliersData() {
        let params = {
          storeId: this.storeId
        }
        getSuppliers(params).then(res => {
          this.suppliersList = res.data.data
        })
      },
      getOrderStorageData() {
        let params = {
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize
        }
        let path = '2'
        getOrderStorage(params, path).then(res => {
          let data = res.data.data
          this.orderStorageList = data
          this.paginationData = data.pageVo
        })
      },
      deleteRow(index, row, more) {
      },
      editRow(index, row) {
      },
      redRow(index, row){
        let params = {
          storeId:this.storeId,
          id: row.id,
          userId: this.userId
        }
        this.$prompt('此操作将红冲此订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder:'可以输入备注',
        }).then((value) => {
          if(value.value){
            params.remark = value.value
          }
          postRedDashed(params).then(res=>{
            if (res.data.code !== 1001) {
              this.$message({
                showClose: true,
                message: '红冲失败',
                type: 'error'
              })
              return
            }
            this.$message({
              showClose: true,
              message: '红冲成功',
              type: 'success'
            })
            this.getOrderStorageData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });

      }

    },

    computed: {},
    watch: {},
    components: {SelectTable}
  }
</script>

<style lang='scss' scoped>

</style>
