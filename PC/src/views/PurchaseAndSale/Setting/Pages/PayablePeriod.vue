<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.supplierName" placeholder="供应商名称" size="mini">
        <template slot="prepend">
          供应商名称
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
        :data="suppliersList"
        :pagination-data="paginationData"
        @paginationChange="getSupplierDataFun"
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
              :disabled="scope.row.advanceOutMoneyOpening>0||scope.row.needOutMoneyOpening>0"
              @click.native.prevent="settingHandle(scope.$index,scope.row)"
            >
              设置期初
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="修改初期"
      width="60%"
    >
      <div class="dialog-content-input">
        <NumberInput
          v-model="opening.advanceOutMoneyOpening"
        >
          <template slot="prepend">
            预付款期初
          </template>
        </NumberInput>
      </div>
      <div class="dialog-content-input">
        <NumberInput
          v-model="opening.needOutMoneyOpening"
        >
          <template slot="prepend">
            应付款期初
          </template>
        </NumberInput>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!--<select-table-->
      <!--:data="suppliersList"-->
      <!--:pagination-data="paginationData"-->
      <!--@paginationChange="getSupplierDataFun"-->
    <!--&gt;-->
      <!--<el-table-column-->
        <!--slot="handle"-->
        <!--:fixed="true"-->
        <!--label="操作"-->
        <!--width="200"-->
        <!--align="center"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<el-button-->
            <!--type="text"-->
            <!--size="small"-->
            <!--@click.native.prevent="settingHandle(scope.row,scope.$index)"-->
          <!--&gt;-->
            <!--设置期初-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</select-table>-->
  </div>
</template>

<script>
  // import {getCommodityData} from '@/service/PurchaseAndSale/DataEditing/CommodityAdd'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import { getSupplierData } from '@/service/PurchaseAndSale/DataEditing/Supplier.js'
  import { putNeedOutOpening,getNeedOutOpening } from '@/service/PurchaseAndSale/Setting/PayablePeriod.js'
  import common from '@/mixins/common'
  export default {
    name: 'PayablePeriod',
    components: {
      SelectTable
    },
    mixins: [common],
    data() {
      return {
        filterData: {
        },
        disabledMap: {
          '1': '停用',
          '0': '启用'
        },
        dialogVisible: false,
        suppliersList:[],
        opening:{},
        choiceRow:{}
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getSupplierDataFun()
    },
    methods: {
      searchBtn() {
        this.paginationData.page = 1
        this.getSupplierDataFun()
      },
      getSupplierDataFun() {
        if (!this.filterData.id) {
          delete this.filterData.id
        }
        const params = {
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        getNeedOutOpening(params).then(res => {
          const data = res.data.data
          this.suppliersList = data
          this.paginationData = data.pageVo
        })
      },
      confirmHandle(){
        let data = {
          storeId: this.storeId,
          id: this.choiceRow.id,
          userId: this.userId,
          ...this.opening
        }
        putNeedOutOpening(data).then(res=> {
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
            message: '设置成功',
            type: 'success'
          })
          this.getSupplierDataFun()
          this.dialogVisible = false
        })
      },

      settingHandle(index,row){
        this.choiceRow = row
        this.opening = {}
        this.dialogVisible = true
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
