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
        @paginationChange="getSellApplyData"
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
          v-model="chioceSelect.clientId"
          :disabled="isEdit"
          size="mini"
          placeholder="请选择客户"
          @change="changeClientId"
        >
          <el-option
            v-for="item in clientsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.discountCouponId"
          :disabled="!choiceGoodsSku.length||!chioceSelect.clientId"
          clearable
          size="mini"
          placeholder="可选择使用优惠券"
          @change="changeDiscountMoney"
        >
          <el-option
            v-for="item in discountCouponList"
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
        <el-input
          v-model="chioceSelect.discountMoney"
          :disabled="!choiceGoodsSku.length"
          placeholder="请输入直接优惠金额"
          size="mini"
          @input="changeDiscountMoney"
        >
          <template slot="prepend">
            直接优惠金额
          </template>
        </el-input>
        <el-input v-model="chioceSelect.remark" placeholder="请输入备注" size="mini">
          <template slot="prepend">
            备注
          </template>
        </el-input>
      </div>
      <el-table
        v-if="choiceGoodsSku.length"
        :data="choiceGoodsSku"
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
          prop="bookInventory"
          align="center"
          label="账面库存"
        />
        <el-table-column
          prop="canUseInventory"
          align="center"
          label="可用库存"
        />
        <el-table-column
          prop="realInventory"
          align="center"
          label="实物库存"
        />
        <el-table-column
          prop="integral"
          align="center"
          label="积分"
        />
        <el-table-column
          prop="purchasePrice"
          align="center"
          label="进价"
        />
        <el-table-column
          prop="retailPrice"
          align="center"
          label="零售价"
        />
        <el-table-column
          prop="vipPrice"
          align="center"
          label="VIP价格"
        />
        <el-table-column label="数量" width="180" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.quantity"
              size="small"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="售价" width="180" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.money"
              size="small"
              @input="moneyChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" label="总价" width="180" align="center">
          <template scope="scope">
            {{ scope.row.totalMoney }}
          </template>
        </el-table-column>
        <el-table-column label="折扣" width="180" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.discountMoney"
              size="small"
              @input="discountChange(scope.row)"
            />
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
          确认添加
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/mixins/common'
import { getSuppliers, getSellApply, delOrderApply, getSellApplyDetails, postSellApply } from '@/service/PurchaseAndSale/Sale/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { orderDetailMap, statusMap } from '@/views/PurchaseAndSale/Purchase/config.js'
import { dataFormat } from '@/utils/index.js'
import salecommon from '../mixins/salecommon'
import addMixin from '../mixins/addMixin'
export default {
  name: 'SalesOrder',
  components: { SelectTable },
  mixins: [common, salecommon, addMixin],
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
    this.getSellApplyData()
  },
  methods: {
    getSuppliersData() {
      const params = {
        storeId: this.storeId
      }
      getSuppliers(params).then(res => {
        this.suppliersList = res.data.data
      })
    },
    getSellApplyData() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        type: '2'
      }
      getSellApply(params).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          item.orderStatus = statusMap[item.orderStatus]
        })
        this.orderStorageList = data
        this.paginationData = data.pageVo
      })
    },
    moreDel() {
      this.deleteRow('', '', true)
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
        this.getSellApplyData()
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
      getSellApplyDetails(params, path).then(res => {
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
      data.outWarehouseId = this.chioceSelect.outWarehouseId
      data.userId = this.userId
      data.storeId = this.storeId
      data.type = 2
      data.discountMoney = this.chioceSelect.discountMoney
      data.discountCouponId = this.chioceSelect.discountCouponId
      data.remark = this.chioceSelect.remark
      data.prodcingWay = 1
      data.clientId = this.chioceSelect.clientId
      data.totalDiscountMoney = this.chioceSelect.totalDiscountMoney
      let outTotalQuantity = 0
      let totalMoney = 0
      const details = []
      this.choiceGoodsSku.forEach(v => {
        let _detail = {}
        outTotalQuantity += Number(v.quantity)
        totalMoney += Number(v.totalMoney)
        _detail = {
          'type': 0,
          'goodsSkuId': v.id,
          'quantity': v.quantity,
          'money': v.totalMoney,
          'discountMoney': v.discountMoney,
          'remark': v.remark
        }
        details.push(_detail)
      })
      data.outTotalQuantity = outTotalQuantity
      data.discountMoney = this.chioceSelect.discountMoney
      data.orderMoney = totalMoney - this.chioceSelect.totalDiscountMoney
      data.totalMoney = totalMoney
      data.details = details
      postSellApply(data).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '添加失败，请稍后重试',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.getSellApplyData()
        this.addVisible = false
      })
    }

  }
}
</script>

<style lang='scss' scoped>

</style>
