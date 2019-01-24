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
      <el-input v-model="filterData.membershipNumber" placeholder="会员卡号" size="mini">
        <template slot="prepend">
          会员卡号
        </template>
      </el-input>
      <el-input v-model="filterData.id" placeholder="单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-input v-model="filterData.clientName" placeholder="客户名" size="mini">
        <template slot="prepend">
          客户名
        </template>
      </el-input>
      <el-input v-model="filterData.phone" placeholder="电话" size="mini">
        <template slot="prepend">
          电话
        </template>
      </el-input>
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
    <el-dialog :close-on-click-modal="false" :visible.sync="addVisible" :title="isEdit?'编辑订单':'添加换货订单'">
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
              :max="scope.row.quantityC"
              v-model="scope.row.quantity"
              :no-slot="false"
              @input="quantityChange(scope.row)"
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
    <el-dialog :close-on-click-modal="false" :visible.sync="addDialog" width="80%" title="选择销售订单换货">
      <select-table
        :data="sellOrderList"
        :pagination-data="paginationData"
        @paginationChange="getSellResultFun"
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
              换货
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
import {
  getSuppliers,
  getSellApply,
  delOrderApply,
  getSellApplyDetails,
  postSellApply,
  getSellResult,
  putSellApply
} from '@/service/PurchaseAndSale/Sale/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { orderDetailMap } from '@/views/PurchaseAndSale/Purchase/config.js'
import { dataFormat } from '@/utils/index.js'
import salecommon from '../mixins/salecommon'
import addMixin from '../mixins/addMixin'
import { statusMap,clearMap } from '@/views/PurchaseAndSale/config.js'
import { parseTime } from '@/utils'
export default {
  name: 'SalesReplacement',
  components: { SelectTable },
  mixins: [common, salecommon, addMixin],
  data() {
    return {
      filterData: {},
      pickTime: '',
      addDialog: false,
      suppliersList: [],
      orderStorageList: [],
      paginationData2: {
        page: 1,
        pageSize: 10
      },
      sellOrderList: [],
      selectArr: [],
      orderDetails: {},
      detailsMap: {},
      orderVisible: false,
      orderDetailMap,
      clientDetail:{}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSuppliersData()
    this.getSellApplyData()
    this.getSellResultFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getSellApplyData()
    },
    printFun() {
      const data = {}
      data.items = JSON.parse(JSON.stringify(this.orderDetails))
      data.title = [
        {key: 'goodsName', name: '商品名称'},
        {key: 'goodsSkuSku', name: '商品规格'},
        {key: 'goodsSkuPurchasePrice', name: '单价'},
        {key: 'quantity', name: '数量'},
        {key: 'money', name: '金额'},
        {key: 'remark', name: '备注'}
      ]
      window.localStorage.setItem('printData', JSON.stringify(data))
      let routeData = this.$router.resolve({
        name: 'PrintPage',
        query: {
          orderName: '销售换货单',
          orderId: data.items[0].id,
          orderTime: data.items[0].createTime,
          clientName: this.clientDetail.name,
          clientPhone: this.clientDetail.phone,
          clientAddr: this.clientDetail.address
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
    // dialog获取销售订单
    getSellResultFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize,
        type: '2',
        flag:1
      }
      getSellResult(params).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          item.orderStatus = statusMap[item.orderStatus]
        })
        this.sellOrderList = data
        this.paginationData2 = data.pageVo
      })
    },
    getSellApplyData() {
      if (!this.filterData.id) {
        delete this.filterData.id
      }
      this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
      this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        type: '4',
        ...this.filterData
      }
      getSellApply(params).then(res => {
        const data = res.data.data

        data.items.forEach(item => {
          item.status = item.orderStatus
          item.orderStatus = statusMap[item.orderStatus]
          item.clearStatus = clearMap[item.clearStatus]
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
      data.prodcingWay = 1
      data.userId = this.userId
      data.storeId = this.storeId
      data.outWarehouseId = this.chioceSelect.inWarehouseId
      data.inWarehouseId = this.chioceSelect.inWarehouseId
      data.resultOrderId = this.chioceSelect.resultOrderId
      data.remark = this.chioceSelect.remark
      data.totalDiscountMoney = 0
      data.discountMoney = 0
      data.totalMoney = 0
      data.orderMoney = 0
      data.type = 4
      data.clientId = this.chioceSelect.client
      let inTotalQuantity = 0
      let outTotalQuantity = 0
      const details = []
      this.choiceGoodsSku.forEach(v => {
        let _detail = {}
        let _detail2 = {}
        inTotalQuantity +=  Number(v.quantity)
        outTotalQuantity +=  Number(v.quantity)
        _detail = {
          'type': 1,
          "id":v.id,
          'goodsSkuId': v.goodsSkuId,
          'quantity': v.quantity,
          'money': v.money,
          'discountMoney': v.discountMoney,
          'remark': v.remark
        }
        _detail2 = {
          'type': 0,
          'goodsSkuId': v.goodsSkuId,
          'quantity': v.quantity,
          'money': v.money,
          'discountMoney': v.discountMoney,
          'remark': v.remark
        }
        details.push(_detail)
        details.push(_detail2)
      })
      data.outTotalQuantity = outTotalQuantity
      data.inTotalQuantity = inTotalQuantity
      data.details = details
      const func = this.isEdit ? putSellApply : postSellApply
      const magSuccess = this.isEdit ? '成功编辑订单' : '成功添加订单'
      func(data).then(res => {
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
          message: magSuccess,
          type: 'success'
        })
        this.addVisible = false
        this.getSellApplyData()
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
