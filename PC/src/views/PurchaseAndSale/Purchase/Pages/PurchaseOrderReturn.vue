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
      <el-button type="primary" icon="el-icon-remove-outline" size="mini" @click="moreDel">
        批量删除
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.orderId" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-select
        v-model="filterData.supplier"
        clearable
        size="mini"
        placeholder="请选择供应商名"
      >
        <el-option
          v-for="item in suppliersList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-date-picker
        v-model="filterData.pickTime"
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
        <el-button type="primary" size="mini">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        v-model="selectArr"
        :is-select="true"
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
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index,scope.row,false)"
            >
              删除
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
    <el-dialog :visible.sync="orderVisible" title="订单详情">
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
    </el-dialog>
    <el-dialog :visible.sync="addVisible" :title="isEdit?'编辑订单':'添加订单'">
      <div class="dialog-content-input">
        <el-select
          v-model="chioceSelect.supplierId"
          :disabled="isEdit"
          clearable
          size="mini"
          placeholder="请选择供应商名"
        >
          <el-option
            v-for="item in suppliersList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.outWarehouseId"
          :disabled="isEdit"
          size="mini"
          placeholder="请选择仓库"
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
          placeholder="请选择商品分类"
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
          prop="sku"
          align="center"
          width="200"
          label="规格"
        />
        <el-table-column
          align="center"
          label="预设进价"
        >
          <template scope="scope">
            <el-input
              v-model="scope.row.purchasePrice"
              size="small"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.quantity"
              size="small"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="折扣" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.discountMoney"
              size="small"
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
import { getSuppliers, getOrderApply, getOrderApplyDetails, delOrderApply } from '@/service/PurchaseAndSale/Purchase/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { dataFormat } from '@/utils/index.js'
import { orderDetailMap } from '@/views/PurchaseAndSale/Purchase/config.js'
import addMixin from '../mixins/addMixin.js'
import purchasecommon from '../mixins/purchasecommon'

export default {
  name: 'PurchaseOrderReturn',
  components: { SelectTable },
  mixins: [common, purchasecommon, addMixin],
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
      selectArr: [],
      orderVisible: false,
      orderDetailMap,
      orderDetails: [],
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
    moreDel() {
      this.deleteRow('', '', true)
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
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        type: '2'
      }
      getOrderApply(params).then(res => {
        const data = res.data.data
        this.orderStorageList = data
        this.paginationData = data.pageVo
      })
    },
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
    },
    readRow(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getOrderApplyDetails(params, path).then(res => {
        const data = res.data.data
        const _data = dataFormat(data)
        if (_data.length > 0) {
          if (!this.isGetSkuMap) {
            const sku = eval(_data[0].goodsSkuSku)
            sku.forEach(v => {
              this.orderDetailMap.push({ key: v.key, name: v.key })
            })
            this.isGetSkuMap = true
          }
          _data.forEach(v => {
            let _itemSKU = {}
            const _sku = eval(v.goodsSkuSku)
            _sku.forEach(item => {
              _itemSKU = { [item.key]: item.value }
              Object.assign(v, _itemSKU)
            })
          })
        }

        this.orderDetails = _data
        this.orderVisible = true
      })
    },
    comfirm() {
      const data = {}
      data.userId = this.userId
      data.storeId = this.storeId
      data.supplierId = this.chioceSelect.supplierId
      data.outWarehouseId = this.chioceSelect.outWarehouseId
      data.type = 2
      const outTotalQuantity = 0
      let orderMoney = 0
      let totalDiscountMoney = 0
      let totalMoney = 0
      const details = []
      this.choiceGoodsSku.forEach(v => {
        let _detail = {}
        inTotalQuantity += Number(v.quantity)
        totalDiscountMoney += Number(v.discountMoney)
        totalMoney += Number(v.money)
        _detail = {
          'type': 0,
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
