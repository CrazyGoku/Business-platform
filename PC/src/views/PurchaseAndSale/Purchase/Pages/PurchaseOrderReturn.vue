<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addDialog = true"
      >
        添加
      </el-button>
      <el-button type="primary" icon="el-icon-remove-outline" size="mini" @click="moreDel">
        批量删除
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
              :disabled="!(scope.row.status==1||scope.row.status==4||scope.row.status==7)"
              @click.native.prevent="deleteRow(scope.$index,scope.row,false)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="!(scope.row.status==1||scope.row.status==4||scope.row.status==7)"
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
    <el-dialog :close-on-click-modal="false" :visible.sync="orderVisible" title="订单详情">
      <el-table :data="orderDetails">
        <el-table-column
          type="index"
          fixed
          align="center"
          width="20"
        />
        <el-table-column
          v-for="(item,index) in purchaseOrderReturnDetailMap"
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
    <el-dialog :close-on-click-modal="false" :visible.sync="addVisible" :title="isEdit?'编辑订单':'添加退货订单'">
      <div class="dialog-content-input">
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
            <NumberInput
              :max="scope.row.quantity"
              v-model="scope.row.quantity"
              :no-slot="false"
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
      <span slot="footer" class="dialog-footer">
        <el-button v-if="choiceGoodsSku.length" style="float: right" size="mini" type="primary" @click="comfirm">
          确认添加
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="addDialog" width="80%" title="选择采购订单退货">
      <select-table
        :data="procurementOrderList"
        :pagination-data="paginationData"
        @paginationChange="getOrderResultFun"
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
              @click.native.prevent="addBtnFun(scope.$index,scope.row,false)"
            >
              退货
            </el-button>
          </template>
        </el-table-column>
      </select-table>
      <span slot="footer" class="dialog-footer">
        <el-button style="float: right" size="mini" type="primary" @click="addDialog = false">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/mixins/common'
import { getSuppliers, getOrderApply, getOrderApplyDetails, delOrderApply, getOrderResultDetails, getOrderResult, postOrderApply } from '@/service/PurchaseAndSale/Purchase/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { dataFormat } from '@/utils/index.js'
import { purchaseOrderReturnDetailMap, orderApplyMap } from '@/views/PurchaseAndSale/Purchase/config.js'
import addMixin from '../mixins/addMixin.js'
import purchasecommon from '../mixins/purchasecommon'
import { statusMap,clearMap } from '../../config'
import { parseTime } from '@/utils'

export default {
  name: 'PurchaseOrderReturn',
  components: { SelectTable },
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
      addDialog: false,
      selectArr: [],
      orderVisible: false,
      paginationData2: {
        page: 1,
        pageSize: 10
      },
      purchaseOrderReturnDetailMap,
      orderDetails: [],
      isGetSkuMap: false,
      procurementOrderList: []
    }
  },

  computed: {},
  watch: {},
  mounted() {
    this.getSuppliersData()
    this.getOrderApplyData()
    this.getOrderResultFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getOrderApplyData()
    },
    moreDel() {
      this.deleteRow('', '', true)
    },
    // dialog获取采购订单
    getOrderResultFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize,
        type: '1'
      }
      getOrderResult(params).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          item.orderStatus = statusMap[item.orderStatus]
        })
        this.procurementOrderList = data
        this.paginationData2 = data.pageVo
      })
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
        type: '2',
        ...this.filterData
      }
      getOrderApply(params).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          item.status = item.orderStatus
          item.orderStatus = statusMap[item.orderStatus]
          item.clearStatus = clearMap[item.clearStatus]
          item.type = orderApplyMap[item.type]
        })
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
        console.log(data)
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
      data.outWarehouseId = this.chioceSelect.outWarehouseId
      data.resultOrderId = this.chioceSelect.resultOrderId
      data.type = 2
      let outTotalQuantity = 0
      let orderMoney = 0
      let totalDiscountMoney = 0
      let totalMoney = 0
      const details = []
      this.choiceGoodsSku.forEach(v => {
        let _detail = {}
        outTotalQuantity += Number(v.quantity)
        totalDiscountMoney += Number(v.discountMoney)
        totalMoney += Number(v.money)
        _detail = {
          'type': 0,
          'goodsSkuId': v.goodsSkuId,
          'quantity': v.quantity,
          'money': v.money,
          'discountMoney': v.discountMoney,
          'remark': v.remark,
          'id': v.id
        }
        details.push(_detail)
      })
      orderMoney = totalMoney - totalDiscountMoney
      data.outTotalQuantity = outTotalQuantity
      data.totalDiscountMoney = totalDiscountMoney * -1
      data.orderMoney = orderMoney * -1
      data.totalMoney = totalMoney * -1
      data.details = details
      postOrderApply(data).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '添加订单失败',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '成功添加订单',
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
