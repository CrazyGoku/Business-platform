<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.clientName" placeholder="请输入客户名称" size="mini">
        <template slot="prepend">
          客户名称
        </template>
      </el-input>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchBtn">
          查询
        </el-button>
      </div>
    </div>
    <select-table
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
            @click.native.prevent="settingHandle(scope.$index,scope.row)"
          >
            设置期初
          </el-button>
        </template>
      </el-table-column>
    </select-table>
    <el-dialog :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="修改初期"
      width="60%"
    >
      <div class="dialog-content-input">
        <NumberInput
          v-model="opening.advanceInMoneyOpening"
        >
          <template slot="prepend">
            预收款期初
          </template>
        </NumberInput>
      </div>
      <div class="dialog-content-input">
        <NumberInput
          v-model="opening.needInMoneyOpening"
        >
          <template slot="prepend">
            应收款期初
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
  </div>
</template>

<script>
  // import {getCommodityData} from '@/service/PurchaseAndSale/DataEditing/CommodityAdd'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import { getCustomerData } from '@/service/PurchaseAndSale/DataEditing/VIPCustomer.js'
  import { putNeedInOpening,getNeedInOpening } from '@/service/PurchaseAndSale/Setting/InitialReceivables.js'
  import common from '@/mixins/common'
  export default {
    name: 'InitialReceivables',
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
        levelList: [],
        opening:{
          advanceInMoneyOpening:0,
          needInMoneyOpening:0
        },
        customersList:[],
        choiceRow:{}
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getCustomerDataFun()
    },
    methods: {
      searchBtn() {
        this.paginationData.page = 1
        this.getCustomerDataFun()
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
        getNeedInOpening(params).then(res => {
          const data = res.data.data
          this.customersList = data
          this.paginationData = data.pageVo
        })
      },
      confirmHandle(){
        console.log(this.opening)
        let data = {
          storeId: this.storeId,
          clientId: this.choiceRow.clientId,
          userId: this.userId,
          ...this.opening
        }
        putNeedInOpening(data).then(res=> {
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
          this.getCustomerDataFun()
          this.dialogVisible = false
        })
      },
      settingHandle(index,row){
        this.choiceRow = row
        this.opening = {
          advanceInMoneyOpening:this.choiceRow.advanceInMoneyOpening,
          needInMoneyOpening:this.choiceRow.needInMoneyOpening
        }
        this.dialogVisible = true
      }
      /*getLevelDataFun() {
        const params = {

        }
        getLevelData(params).then(res => {
          this.levelList = res.data.data
        })
      }*/
    }
  }
</script>

<style lang='scss' scoped>

</style>
