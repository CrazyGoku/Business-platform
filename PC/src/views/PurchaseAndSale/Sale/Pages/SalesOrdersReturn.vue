<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="directDialog = true;isEdit = false;chioceSelect={};choiceGoodsSku = []"
      >
        直接添加
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addDialog = true"
      >
        根据订单添加
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
    <el-dialog :close-on-click-modal="false" :visible.sync="addDialog" width="80%" title="选择销售订单退货">
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
    <el-dialog :close-on-click-modal="false" :visible.sync="directDialog" width="80%" title="直接退货">
      <div class="dialog-content-input">
        <el-select
          v-model="chioceSelect.clientId"
          size="mini"
          filterable
          filterable placeholder="请选择客户"
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
          v-model="chioceSelect.inWarehouseId"
          size="mini"
          :disabled="!chioceSelect.clientId"
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
          prop="goodName"
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
          label="价格"
        >
          <template scope="scope">
            <NumberInput
              v-model="scope.row.money"
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
              min="1"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <!--<el-table-column label="折扣" width="150" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.discountMoney"
              :no-slot="false"
              @input="moneyChange(scope.row)"
            />
          </template>
        </el-table-column>-->
        <el-table-column label="总价" align="center">
          <template scope="scope">
            {{ scope.row.totalMoney }}
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
        <el-button v-if="choiceGoodsSku.length" style="float: right" size="mini" type="primary" @click="comfirm2">
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
  getSellApply,
  delSellApply,
  getSellApplyDetails,
  postSellApply,
  getSellResult,
  putSellApply
} from '@/service/PurchaseAndSale/Sale/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { orderDetailMap } from '@/views/PurchaseAndSale/Sale/config.js'
import { dataFormat } from '@/utils/index.js'
import salecommon from '../mixins/salecommon'
import clientsList from '@/mixins/clientsList.js'
import addMixin from '../mixins/addMixin'
import { statusMap,clearMap } from '@/views/PurchaseAndSale/config.js'
import { parseTime } from '@/utils'
export default {
  name: 'SalesOrdersReturn',
  components: { SelectTable },
  mixins: [common, salecommon, addMixin,clientsList],
  data() {
    return {
      filterData: {},
      pickTime: '',
      addDialog: false,
      directDialog:false,
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
        {key: 'company', name: '单位'},
        {key: 'unitPrice', name: '单价'},
        {key: 'quantity', name: '数量'},
        {key: 'money', name: '金额'},
        {key: 'remark', name: '备注'}
      ]
      let reg = new RegExp(/单位/ig)
      let company = ''
      data.items.forEach(v=>{
        v.unitPrice = (v.money/v.quantity).toFixed(2)
        v.goodsSkuSku.split(',').forEach(v2=>{
          if(reg.test(v2)) company = v2
        })
        let _company = company.split(':')
        company = _company[_company.length-1]
        v.company = company
      })
      window.localStorage.setItem('printData', JSON.stringify(data))
      let routeData = this.$router.resolve({
        name: 'PrintPage',
        query: {
          orderName: '销售退货单',
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
          item.clearStatus = clearMap[item.clearStatus]
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
        type: '3',
        ...this.filterData
      }
      getSellApply(params).then(res => {
        const data = res.data.data
        data.title.forEach((v,index)=>{
          if(v.key=='type') {
            data.title.splice(index,1)
          }
          if(v.key=='prodcingWay'){
            data.title.splice(index,1)
          }
        })
        data.items.forEach(item => {
          item.status = item.orderStatus
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
      delSellApply(params).then(res => {
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
      this.choiceGoodsSku = []
      this.isEdit = true
      const params = {
        storeId: this.storeId
      }
      this.chioceSelect.id = row.id
      const path = row.id
      getSellApplyDetails(params, path).then(res => {
        const data = res.data.data
        let discountCouponMoney = 0
        if(data.discountCouponId){
          discountCouponMoney = this.discountCouponList.filter(v => {
            return v.id === this.chioceSelect.discountCouponId
          })[0].money
        }
        console.log(data.inWarehouseId)
        this.chioceSelect.inWarehouseId = data.inWarehouseId
        this.chioceSelect.totalDiscountMoney = data.totalDiscountMoney
        this.chioceSelect.discountMoney = data.totalDiscountMoney - discountCouponMoney
        this.chioceSelect.clientId = data.client.id
        this.choiceClient = this.clientsList.filter(v => {
          return v.id === this.chioceSelect.clientId
        })[0]
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
            goodsSkuId: v.goodsSkuId,
            quantity: v.quantity,
            money: v.money/v.quantity,
            discountMoney: v.discountMoney,
            retailPrice: v.goodsSkuRetailPrice,
            goodName: v.goodsName,
            vipPrice: v.goodsSkuVipPrice,
            bossPrice: v.goodsSkuBossPrice,
            totalMoney: v.money,
            remark: v.remark,
            sku: v.goodsSkuSku
          }
          this.choiceGoodsSku.push(_data)
        })
        this.choiceOutWarehouse(data.inWarehouseId)
        this.directDialog = true
      })
    },

    readRow(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getSellApplyDetails(params, path).then(res => {
        const data = res.data.data
        this.clientDetail = data.client
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
      data.type = 3
      data.resultOrderId = this.chioceSelect.resultOrderId
      data.remark = this.chioceSelect.remark
      data.inWarehouseId = this.chioceSelect.inWarehouseId
      data.prodcingWay = 1
      data.clientId = this.chioceSelect.client
      let inTotalQuantity = 0
      let totalDiscountMoney = 0
      let discountMoney = 0
      let totalMoney = 0
      let orderMoney = 0
      const details = []
      // 有问题 需重新计算
      this.choiceGoodsSku.forEach(v => {
        const _detail = {}
        inTotalQuantity += Number(v.quantity)
        v.discountMoney = Number(v.discountMoney/v.quantityC*v.quantity).toFixed(2)
        totalDiscountMoney += Number(v.discountMoney)
        discountMoney += Number(v.discountMoney)
        v.money = (v.money-v.discountMoney)/v.quantityC *v.quantity.toFixed(2)
        totalMoney += Number(v.money)
        _detail.id = v.id
        _detail.type = 1
        _detail.goodsSkuId = v.goodsSkuId
        _detail.quantity = v.quantity
        _detail.money = v.money
        _detail.discountMoney = v.discountMoney
        _detail.remark = v.remark
        details.push(_detail)
      })
      orderMoney = totalMoney - totalDiscountMoney
      data.details = details
      data.inTotalQuantity = inTotalQuantity
      data.totalDiscountMoney = totalDiscountMoney * -1
      data.discountMoney = discountMoney * -1
      data.totalMoney = totalMoney * -1
      data.orderMoney = orderMoney * -1
      console.log(data)
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
    },
    comfirm2(){
      const data = {}
      if(this.isEdit){
        data.id = this.chioceSelect.id
        data.storeId = this.storeId
        data.totalDiscountMoney = 0
        data.totalMoney = 0
        let inTotalQuantity = 0
        let totalMoney = 0
        let orderMoney = 0
        let totalDiscountMoney = 0
        let discountMoney = 0
        const details = []
        this.choiceGoodsSku.forEach(v => {
          const _detail = {}
          inTotalQuantity += Number(v.quantity)
          totalMoney += Number(v.totalMoney)
          _detail.type = 1
          _detail.goodsSkuId = v.goodsSkuId
          _detail.quantity = v.quantity
          _detail.money = v.totalMoney
          _detail.discountMoney = v.discountMoney
          _detail.remark = v.remark
          details.push(_detail)
        })
        orderMoney = totalMoney - totalDiscountMoney
        data.details = details
        data.inTotalQuantity = inTotalQuantity
        data.totalDiscountMoney = totalDiscountMoney * -1
        data.discountMoney = discountMoney * -1
        data.totalMoney = totalMoney * -1
        data.orderMoney = orderMoney * -1
      }else{
        data.userId = this.userId
        data.storeId = this.storeId
        data.type = 3
        data.remark = this.chioceSelect.remark
        data.inWarehouseId = this.chioceSelect.inWarehouseId
        data.prodcingWay = 1
        data.clientId = this.chioceSelect.clientId
        let inTotalQuantity = 0
        let totalDiscountMoney = 0
        let discountMoney = 0
        let totalMoney = 0
        let orderMoney = 0
        const details = []
        // 有问题 需重新计算
        this.choiceGoodsSku.forEach(v => {
          const _detail = {}
          inTotalQuantity += Number(v.quantity)
          totalDiscountMoney += Number(v.discountMoney)
          discountMoney += Number(v.discountMoney)
          totalMoney += Number(v.totalMoney)
          _detail.id = v.id
          _detail.type = 1
          _detail.goodsSkuId = v.goodsSkuId
          _detail.quantity = v.quantity
          _detail.money = v.totalMoney
          _detail.discountMoney = v.discountMoney
          _detail.remark = v.remark
          details.push(_detail)
        })
        orderMoney = totalMoney - totalDiscountMoney
        data.details = details
        data.inTotalQuantity = inTotalQuantity
        data.totalDiscountMoney = totalDiscountMoney * -1
        data.discountMoney = discountMoney * -1
        data.totalMoney = totalMoney * -1
        data.orderMoney = orderMoney * -1
      }

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
        this.directDialog = false
        this.getSellApplyData()
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
