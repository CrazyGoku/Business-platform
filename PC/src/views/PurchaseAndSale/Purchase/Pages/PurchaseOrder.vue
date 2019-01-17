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
      <el-input v-model="filterData.id" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-select
        v-model="filterData.supplierName"
        clearable
        size="mini"
        filterable placeholder="请选择供应商名"
      >
        <el-option
          v-for="item in suppliersList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
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
        <el-button type="primary" size="mini" @click="searchBtn">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        :data="orderStorageList"
        :pagination-data="paginationData"
        @paginationChange="getOrderApplyData"
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
              :disabled="!(scope.row.status==1||scope.row.status==4||scope.row.status==7)"
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index,scope.row,false)"
            >
              删除
            </el-button>
            <el-button
              :disabled="!(scope.row.status==1||scope.row.status==4||scope.row.status==7)"
              type="text"
              size="small"
              @click.native.prevent="editRow(scope.$index,scope.row)"
            >
              编辑
            </el-button>
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
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="orderVisible" title="订单详情" width="80%">
      <el-table :data="orderDetails">
        <el-table-column
          type="index"
          fixed
          align="center"
          width="20"
        />
        <el-table-column
          v-for="(item,index) in orderDetailMap"
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
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-printer" size="mini" type="primary" @click="printFun">
          打印
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="addVisible" width="80%" :title="isEdit?'编辑订单':'添加订单'">
      <div class="dialog-content-input">
        <el-select
          v-model="chioceSelect.supplierId"
          :disabled="isEdit"
          clearable
          size="mini"
          filterable placeholder="请选择供应商名"
        >
          <el-option
            v-for="item in suppliersList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.inWarehouseId"
          :disabled="isEdit"
          size="mini"
          filterable placeholder="请选择仓库"
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
          :disabled="!chioceSelect.inWarehouseId"
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
        tooltip-effect="dark"
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
        <!--   <el-table-column
          prop="bookInventory"
          align="center"
          label="总库存">
        </el-table-column>
        <el-table-column
          prop="canUseInventory"
          align="center"
          label="可用库存">
        </el-table-column>
        <el-table-column
          prop="realInventory"
          align="center"
          label="实际库存">
        </el-table-column>
        <el-table-column
          prop="integral"
          align="center"
          label="积分">
        </el-table-column>-->
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
        <el-table-column
          align="center"
          width="150"
          label="预设进价"
        >
          <template scope="scope">
            <NumberInput
              v-model="scope.row.purchasePrice"
              :no-slot="false"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="150" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.quantity"
              :no-slot="false"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="折扣" width="150" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.discountMoney"
              :no-slot="false"
              @input="discountChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="money" label="总价" align="center">
          <template scope="scope">
            {{ scope.row.money }}
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
      </el-table>
      <div>
        <el-button v-if="choiceGoodsSku.length" style="float: right" size="mini" type="primary" @click="comfirm">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import {
    getSuppliers,
    getOrderApply,
    delOrderApply,
    getOrderApplyDetails,
    postOrderApply,
    putOrderApply
  } from '@/service/PurchaseAndSale/Purchase/common.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import {orderDetailMap} from '@/views/PurchaseAndSale/Purchase/config.js'
  import {clearMap} from '@/views/PurchaseAndSale/config.js'
  import {dataFormat} from '@/utils/index.js'
  import purchasecommon from '../mixins/purchasecommon'
  import addMixin from '../mixins/addMixin.js'
  import {statusMap, orderApplyMap} from '../config'
  import {parseTime} from '@/utils'

  export default {
    name: 'PurchaseOrder',
    components: {SelectTable},
    mixins: [common, purchasecommon, addMixin],
    data() {
      return {
        filterData: {},
        pickTime: '',
        suppliersList: [],
        orderStorageList: [],
        paginationData: {
          page: 1,
          pageSize: 10
        },
        selectArr: [],
        orderDetails: {},
        detailsMap: {},
        orderVisible: false,
        orderDetailMap,
        isGetSkuMap: false

      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getSuppliersData()
      this.getOrderApplyData()
    },
    methods: {
      searchBtn() {
        this.paginationData.page = 1
        this.getOrderApplyData()
      },
      printFun() {
        console.log()
        const data = {}
        data.items = JSON.parse(JSON.stringify(this.orderDetails))
        data.title = [
          {key: 'id', name: '订单编号'},
          {key: 'goodsName', name: '商品名称'},
          {key: 'goodsSkuSku', name: '商品规格'},
          {key: 'discountMoney', name: '折扣'},
          {key: 'inTotalQuantity', name: '入库总量'},
          {key: 'inWarehouseName', name: '入库名称'},
          {key: 'goodsBarCode', name: '商品条形码'},
          {key: 'goodsId', name: '商品货号'},
          {key: 'money', name: '金额'},
          {key: 'quantity', name: '总量'},
          {key: 'remark', name: '备注'},
          {key: 'clearStatus', name: '结算状态'},
          {key: 'clearedMoney', name: '已结算金额'},
          {key: 'createTime', name: '日期'},
          {key: 'inNotReceivedQuantity', name: '未收数量'},
          {key: 'inReceivedQuantity', name: '收到数量'},
          {key: 'notClearedMoney', name: '未结算金额'},
          {key: 'orderMoney', name: '订单金额'},
          {key: 'orderStatus', name: '订单状态'},
          {key: 'supplierName', name: '供应商名称'},
          {key: 'totalDiscountMoney', name: '总优惠金额'},
          {key: 'totalMoney', name: '总金额'},
          {key: 'userName', name: '经手人'}
        ]
        window.localStorage.setItem('printData', JSON.stringify(data))
        const routeData = this.$router.resolve({
          name: 'PrintPage',
          query: {
            orderName: '采购订单'
          }
        })
        window.open(routeData.href, '_blank')
      },
      getSuppliersData() {
        const params = {
          storeId: this.storeId
        }
        getSuppliers(params).then(res => {
          this.suppliersList = res.data.data
        })
      },
      getOrderApplyData() {
        if (!this.filterData.id) {
          delete this.filterData.id
        }
        this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
        this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
        const params = {
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          type: '1',
          ...this.filterData
        }
        getOrderApply(params).then(res => {
          const data = res.data.data
          data.items.forEach(v => {
            v.status = v.orderStatus
            v.type = orderApplyMap[v.type]
            v.orderStatus = statusMap[v.orderStatus]
          })
          this.orderStorageList = data
          this.paginationData = data.pageVo
        })
      },
      // moreDel() {
      //   this.deleteRow('', '', true)
      // },
      deleteRow(index, row, more) {
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
        delOrderApply(params).then(res => {
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
          this.getOrderApplyData()
        })
        console.log(row)
      },
      editRow(index, row) {
        this.choiceGoodsSku = []
        this.isEdit = true
        const params = {
          storeId: this.storeId
        }
        this.chioceSelect.id = row.id
        const path = row.id
        getOrderApplyDetails(params, path).then(res => {
          const data = res.data.data
          this.chioceSelect.inWarehouseId = data.inWarehouseId
          this.chioceSelect.supplierId = data.supplierId
          data.details.forEach(v => {
            v.goodsSkuSku = eval(v.goodsSkuSku)
            let sku = ''
            v.goodsSkuSku.forEach((item, index) => {
              let _sku = ''
              if (v.goodsSkuSku.length === index + 1) {
                _sku = item.key + ':' + item.value
              } else {
                _sku = item.key + ':' + item.value + ','
              }
              sku += _sku
            })
            v.goodsSkuSku = sku
            const _data = {
              id: v.goodsSkuId,
              quantity: v.quantity,
              money: v.money,
              discountMoney: v.discountMoney,
              remark: v.remark,
              purchasePrice: (v.money + v.discountMoney * v.quantity) / v.quantity,
              sku: v.goodsSkuSku
            }
            this.choiceGoodsSku.push(_data)
          })
          this.choiceOutWarehouse(data.inWarehouseId)
          this.addVisible = true
        })
      },
      readRow(index, row) {
        const params = {
          storeId: this.storeId
        }
        const path = row.id
        getOrderApplyDetails(params, path).then(res => {
          const data = res.data.data
          data.orderStatus = statusMap[data.orderStatus]
          data.clearStatus = clearMap[data.clearStatus]
          data.details.forEach(v => {
            v.goodsSkuSku = eval(v.goodsSkuSku)
            let sku = ''
            v.goodsSkuSku.forEach((item, index) => {
              let _sku = ''
              if (v.goodsSkuSku.length === index + 1) {
                _sku = item.key + ':' + item.value
              } else {
                _sku = item.key + ':' + item.value + ','
              }
              sku += _sku
            })
            v.goodsSkuSku = sku
          })
          const _data = dataFormat(data)
          this.orderDetails = _data
          this.orderVisible = true
        })
      },
      comfirm() {
        const data = {}
        data.userId = this.userId
        data.storeId = this.storeId
        data.supplierId = this.chioceSelect.supplierId
        data.inWarehouseId = this.chioceSelect.inWarehouseId
        data.type = 1
        data.id = this.chioceSelect.id
        let inTotalQuantity = 0
        let orderMoney = 0
        let totalDiscountMoney = 0
        let totalMoney = 0
        const details = []
        this.choiceGoodsSku.forEach(v => {
          let _detail = {}
          v.quantity = v.quantity ? v.quantity : 0
          v.discountMoney = v.discountMoney ? v.discountMoney : 0
          v.money = v.money ? v.money : 0
          inTotalQuantity += Number(v.quantity)
          totalDiscountMoney += Number(v.discountMoney)
          totalMoney += Number(v.money)
          _detail = {
            'type': 1,
            'goodsSkuId': v.id,
            'quantity': v.quantity,
            'money': v.money,
            'discountMoney': v.discountMoney,
            'remark': v.remark
          }
          details.push(_detail)
        })
        orderMoney = totalMoney - totalDiscountMoney
        data.inTotalQuantity = inTotalQuantity
        data.totalDiscountMoney = totalDiscountMoney
        data.orderMoney = orderMoney
        data.totalMoney = totalMoney
        data.details = details
        const func = this.isEdit ? putOrderApply : postOrderApply
        const magSuccess = this.isEdit ? '成功编辑订单' : '成功添加订单'
        const failSuccess = this.isEdit ? '编辑订单失败' : '添加订单失败'
        func(data).then(res => {
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
          this.addVisible = false
          this.getOrderApplyData()
        })
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
