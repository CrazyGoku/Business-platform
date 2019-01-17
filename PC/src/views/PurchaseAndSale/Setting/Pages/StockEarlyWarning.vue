<template>
  <div>
    <div class="search-bar">
      <el-select
        v-model="filterData.warehouseId"
        clearable
        size="mini"
        filterable placeholder="请选择仓库"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchHandle">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        :data="inventoryWarningList"
        :pagination-data="paginationData"
        @paginationChange="getInventoryWarningFun"
      >
        <el-table-column
          slot="handle"
          :fixed="true"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <!--<el-button-->
            <!--type="text"-->
            <!--size="small"-->
            <!--@click.native.prevent="deleteRow(scope.$index,scope.row,false)"-->
            <!--&gt;-->
            <!--删除-->
            <!--</el-button>-->
            <el-button
              type="text"
              size="small"
              @click.native.prevent="setting(scope.$index,scope.row)"
            >
              设置
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
      <div style="margin-bottom: 10px;"><el-switch
        v-model="openStatus"
        active-text="开启库存预警"
        @change="changeSwitch"
        inactive-text="关闭库存预警">
      </el-switch></div>
      <div class="dialog-content-input">


        <NumberInput min="-1000" v-show="openStatus" v-model="inventoryDetail.inventoryUpperLimit">
          <template slot="prepend">
            库存上限
          </template>
        </NumberInput>
        <NumberInput min="-1000" v-show="openStatus" v-model="inventoryDetail.inventoryLowLimit">
          <template slot="prepend">
            库存下限
          </template>
        </NumberInput>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelHandle">
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
  import {getInventoryWarning, getInventoryWarhouse,putInventoryWarning} from '@/service/PurchaseAndSale/Setting/StockEarlyWarning.js'
  import {getWarehouses} from '@/service/PurchaseAndSale/common.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件

  export default {
    name: 'StockEarlyWarning',
    components: {SelectTable},
    mixins: [common],
    data() {
      return {
        inventoryWarningList: [],
        filterData: {
          warehouseId: ''
        },
        warehouseList: [],
        dialogVisible: false,
        inventoryDetail: {},
        openStatus: false
      }
    },
    computed: {},
    watch: {
      inventoryDetail:{
        deep:true,
        handler(val){
          console.log(val)
        }
      },
      dialogVisible(val){
        if(!val){
          this.inventoryDetail={}
        }
      }
    },
    mounted() {
      this.getWarehousesFun()
    },
    methods: {
      changeSwitch(val){
        if(val&&this.inventoryDetail.inventoryUpperLimit===null&&this.inventoryDetail.inventoryLowLimit===null){
          this.inventoryDetail.inventoryLowLimit = 0
          this.inventoryDetail.inventoryUpperLimit = 0
        }
      },
      cancelHandle() {
        this.dialogVisible = false
      },
      confirmHandle() {
        let data = {
          ...this.inventoryDetail
        }
        data.storeId = this.storeId
        data.userId = this.userId
        data.warehouseId = this.filterData.warehouseId
        if(!this.openStatus){
          data.inventoryUpperLimit = null
          data.inventoryLowLimit = null
        }
        putInventoryWarning(data).then(res=>{
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '设置失败，请稍后重试',
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '设置成功',
            type: 'success'
          })
          this.getWarehousesFun()
          this.dialogVisible = false
        })
      },
      searchHandle() {
        this.paginationData.page = 1
        this.getInventoryWarningFun()
      },
      getWarehousesFun() {
        const params = {
          storeId: this.storeId
        }
        getWarehouses(params).then(res => {
          this.warehouseList = res.data.data
          this.filterData.warehouseId = this.warehouseList[0].id
          this.getInventoryWarningFun()
        })
      },
      setting(index, row) {
        this.inventoryDetail.inventoryUpperLimit = row.inventoryUpperLimit
        this.inventoryDetail.inventoryLowLimit = row.inventoryLowLimit
        this.inventoryDetail.goodsSkuId = row.goodsSkuId
        if(this.inventoryDetail.inventoryUpperLimit!==null&&this.inventoryDetail.inventoryLowLimit!==null){
          this.openStatus = true
        }else{
          this.openStatus = false
        }
        this.dialogVisible = true
      },
      getInventoryWarningFun() {
        const params = {
          storeId: this.storeId,
          flag: 1,
          warehouseId: this.filterData.warehouseId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize
        }
        getInventoryWarhouse(params).then(res => {
          const data = res.data.data
          data.items.forEach(v => {
            v.sku = eval(v.sku)
            let sku = ''
            v.sku.forEach((item, index) => {
              let _sku = ''
              if (v.sku.length === index + 1) {
                _sku = item.key + ':' + item.value
              } else {
                _sku = item.key + ':' + item.value + ','
              }
              sku += _sku
            })
            v.sku = sku
          })
          this.inventoryWarningList = data
          this.paginationData = data.pageVo
        })
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
