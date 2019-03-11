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
      <el-input v-model="filterData.id" placeholder="单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-select
        v-model="filterData.inWarehouseId"
        size="mini"
        placeholder="请选择入库仓库"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filterData.outWarehouseId"
        size="mini"
        placeholder="请选择出库仓库"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-date-picker
        v-model="pickTime"
        :picker-options="pickerOptions"
        type="daterange"
        align="right"
        unlink-panels
        size="mini"
        range-separator="至"
        start-placeholder="单据日期（起）"
        end-placeholder="单据日期（止）"
      />
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="getStorageApplyFun">
          查询
        </el-button>
      </div>
    </div>
    <select-table
      :data="applyList"
      :pagination-data="paginationData"
      @paginationChange="getStorageApplyFun"
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
            @click.native.prevent="readRow(scope.$index,scope.row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </select-table>
    <el-dialog :close-on-click-modal="false" width="80%" :visible.sync="addVisible" title="添加订单">

      <div class="dialog-content-input">
        <el-input
          v-model="addRemark"
          size="mini"
        >
          <template slot="prepend">
            备注
          </template>
        </el-input>
        <el-select
          v-model="chioceSelect.outWarehouseId"
          size="mini"
          placeholder="请选择出库仓库"
          @change="choiceOutWarehouse"
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.goodType"
          :disabled="!chioceSelect.outWarehouseId"
          size="mini"
          filterable placeholder="请选择商品分类"
          @change="choiceGoodsTypeFun"
        >
          <el-option
            v-for="item in useGood"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.good"
          :disabled="!chioceSelect.goodType"
          size="mini"
          filterable
          placeholder="请选择商品"
          @change="choiceGoodsFun"
        >
          <el-option
            v-for="item in goodsVos"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.goodsSku"
          :disabled="!chioceSelect.good"
          size="mini"
          placeholder="请选择商品规格"
          @change="choiceGoodsSkuFun"
        >
          <el-option
            v-for="item in goodsSkuVos"
            :key="item.id"
            :disabled="choiceGoodsSku.findIndex(v=> v.id===item.id)>-1"
            :label="item.sku"
            :value="item.id"
          />
        </el-select>
      </div>
      <el-table
        v-if="choiceGoodsSku.length"
        :data="choiceGoodsSku"
        max-height="500"
        style="width: 100%"
      >
        <el-table-column
          label="操作"
          align="center"
          width="100"
        >
          <template scope="scope">
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button size="mini" type="danger" @click="deleteChoiceRow(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align="center"
          width="200"
          label="商品名称"
        />
        <el-table-column
          prop="sku"
          align="center"
          width="200"
          label="规格"
        />
        <el-table-column label="数量" width="180" align="center">
          <template scope="scope">
            <NumberInput :no-slot="false" v-model="scope.row.checkQuantityC">
            </NumberInput>
          </template>
        </el-table-column>
        <el-table-column label="结存金额" width="180" align="center">
          <template scope="scope">
            {{scope.row.checkMoneyC}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="总价"
        >
          <template scope="scope">
            {{(scope.row.checkQuantityC*scope.row.checkMoneyC).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column label="备注" width="180" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.remark"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="bookInventory"
          align="center"
          label="总库存"
        />
        <el-table-column
          prop="canUseInventory"
          align="center"
          label="可用库存"
        />
        <el-table-column
          prop="realInventory"
          align="center"
          label="实际库存"
        />
      </el-table>
      <el-button v-if="choiceGoodsSku.length"
                 style="float: right" size="mini" type="primary" @click="confirmHandle1">
        确认
      </el-button>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false" width="80%" :visible.sync="dialogVisible" title="请选择入库仓库"
    >
      <el-select
        v-model="chioceSelect.inWarehouseIdC"
        size="mini"
        placeholder="请选择入库仓库"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :disabled="chioceSelect.outWarehouseId === item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-button v-if="chioceSelect.inWarehouseIdC" style="float: right" size="mini" type="primary"
                 @click="confirmHandle2">
        确认
      </el-button>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="orderVisible" title="订单详情">
      <el-table :data="orderDetails">
        <el-table-column
          type="index"
          fixed
          align="center"
          width="20"
        />
        <el-table-column
          v-for="(item,index) in AllocationFormMap"
          :key="index"
          :fixed="index<1?true:false"
          :show-overflow-tooltip="true"
          :label="item.name"
          resizable
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            <!--{{ orderDetails[] }}-->
            <div>
              {{ scope.row[item.key] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getStorageApply,
    postStorageApply,
    getStorageApplyDetail
  } from '@/service/PurchaseAndSale/Warehouse/AllocationForm.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import canUseList from '@/mixins/canUseList.js'
  import {AllocationFormMap} from '@/views/PurchaseAndSale/Warehouse/config.js'
  import common from '@/mixins/common'
  import warehouseList from '@/mixins/warehouseList.js'
  import {parseTime} from '@/utils'
  import addMixin from '../mixins/addMixin'
  import {dataFormat} from '@/utils/index.js'

  export default {
    name: 'AllocationForm',
    components: {
      SelectTable
    },
    mixins: [common, warehouseList, addMixin, canUseList],
    data() {
      return {
        filterData: {
          warehouseId: ''
        },
        pickTime: '',
        applyList: [],
        dialogVisible: false,
        opening: {
          quantity: '',
          money: '',
          totalMoney: '',
          goodsSkuId: ''
        },
        orderDetails: [],
        orderVisible:false,
        AllocationFormMap
      }
    },
    computed: {},
    watch: {
      opening: {
        deep: true,
        handler(val) {
          val.totalMoney = (val.money * val.quantity).toFixed(2)
        }
      }
    },
    mounted() {
      this.getWarehousesFun()
      this.getStorageApplyFun()
    },
    methods: {
      getStorageApplyFun() {
        if (!this.filterData.id) {
          delete this.filterData.id
        }
        this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
        this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
        const params = {
          storeId: this.storeId,
          type: 1,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        getStorageApply(params).then(res => {
          const data = res.data.data
          this.applyList = data

          this.paginationData = data.pageVo
        })
      },
      editRow(index, row) {
        this.opening.quantity = row.openingQuantity
        this.opening.money = row.openingMoney
        this.opening.totalMoney = row.openingTotalMoney
        this.opening.goodsSkuId = row.goodsSkuId
        this.dialogVisible = true
      },
      readRow(index, row) {
        const params = {
          storeId: this.storeId
        }
        const path = row.id
        getStorageApplyDetail(params, path).then(res => {
          const data = res.data.data
          const _data = dataFormat(data)
          this.orderDetails = _data
          this.orderVisible = true
        })
      },
      confirmHandle1() {
        this.dialogVisible = true
      },
      confirmHandle2() {
        const params = {
          storeId: this.storeId,
          "type": 1,
          "inWarehouseId": this.chioceSelect.inWarehouseIdC,
          "outWarehouseId": this.chioceSelect.outWarehouseId,
          "userId": this.userId,
          "remark": this.chioceSelect.remark
        }
        const details = []
        let totalQuantity = 0
        let totalMoney = 0
        this.choiceGoodsSku.forEach(v => {
          let _detail = {}
          let _detail2 = {}
          totalQuantity += Number(v.checkQuantityC)
          totalMoney += Number(v.checkMoneyC * v.checkQuantityC)
          _detail = {
            'goodsSkuId': v.id,
            'money': v.checkMoneyC * v.checkQuantityC,
            'quantity': v.checkQuantityC,
            'remark': v.remark,
            'type': 0
          }
          _detail2 = {
            'goodsSkuId': v.id,
            'money': v.checkMoneyC * v.checkQuantityC,
            'quantity': v.checkQuantityC,
            'remark': v.remark,
            'type': 1
          }
          details.push(_detail)
          details.push(_detail2)
        })
        params.details = details
        params.totalQuantity = totalQuantity
        params.totalMoney = totalMoney
        postStorageApply(params).then(res => {
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
            message: '添加成功',
            type: 'success'
          })
          this.getStorageApplyFun()
          this.dialogVisible = false
          this.addVisible = false
        })
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
