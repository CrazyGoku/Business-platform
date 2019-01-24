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
            <el-button
              type="text"
              size="small"
              @click.native.prevent="editRemark(scope.$index,scope.row)"
            >
              修改备注
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false" width="80%" :visible.sync="orderVisible" title="订单详情">
      <el-table :data="orderDetails">
        <el-table-column
          type="index"
          fixed
          align="center"
          width="20"
        />
        <el-table-column
          v-for="(item,index) in retailDetailMap"
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
    <el-dialog width="80%" :close-on-click-modal="false" :visible.sync="addVisible" :title="isEdit?'编辑订单':'添加订单'">
      <div class="dialog-content-input">
        <el-select
          v-model="chioceSelect.clientId"
          :disabled="isEdit"
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
          :disabled="!!!chioceSelect.clientId"
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

        <NumberInput
          v-model="chioceSelect.discountMoney"
          :disabled="!choiceGoodsSku.length"
          @input="changeDiscountMoney"
        >
          <template slot="prepend">
            直接优惠金额
          </template>
        </NumberInput>
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
        <el-table-column label="赠品" width="180" align="center">
          <template scope="scope">
            <el-checkbox v-model="scope.row.isGift"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodName"
          align="center"
          label="商品名称"
          min-width="150"
        />
        <el-table-column
          prop="sku"
          align="center"
          label="规格"
          min-width="200"
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
            <NumberInput
              v-model="scope.row.quantity"
              :no-slot="false"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="售价" width="180" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.money"
              :max="choiceClient.clientLevel.priceType==1?scope.row.retailPrice*choiceClient.clientLevel.price:scope.row.vipPrice*choiceClient.clientLevel.price"
              :no-slot="false"
              @input="moneyChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" label="总价" width="180" align="center">
          <template scope="scope">
            {{ scope.row.totalMoney }}
          </template>
        </el-table-column>
        <el-table-column label="会员折扣" width="150" align="center">
          <template scope="scope">
            {{ choiceClient.clientLevel.priceType==1?(scope.row.quantity*scope.row.retailPrice*(1-choiceClient.clientLevel.price)).toFixed(2):(scope.row.quantity*scope.row.vipPrice*(1-choiceClient.clientLevel.price)).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="折扣" width="180" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.discountMoney"
              :no-slot="false"
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
        <el-button v-if="choiceGoodsSku.length" style="float: right;" size="mini" type="primary" @click="moreQuantity">
          批量添加
        </el-button>
        <el-button v-if="choiceGoodsSku.length" style="float: right;margin-right: 10px" size="mini" type="primary" @click="comfirm">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/mixins/common'
import { getSuppliers, getSellApply, delSellApply, getSellApplyDetails, postSellApply,putSellApply,putSellApplyRemark } from '@/service/PurchaseAndSale/Sale/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { retailDetailMap } from '@/views/PurchaseAndSale/Sale/config.js'
import { dataFormat } from '@/utils/index.js'
import salecommon from '../mixins/salecommon'
import { statusMap,clearMap } from '../../config'
import addMixin from '../mixins/addMixin'
import { parseTime } from '@/utils'
export default {
  name: 'SalesOrder',
  components: { SelectTable },
  mixins: [common, salecommon, addMixin],
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
      retailDetailMap,
      isGetSkuMap: false,
      clientDetail:{}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSuppliersData()
    this.getSellApplyData()
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
          orderName: '销售订购单',
          orderId: data.items[0].id,
          orderTime: data.items[0].createTime,
          clientName: this.clientDetail.name,
          clientPhone: this.clientDetail.phone,
          clientAddr: this.clientDetail.address
        }
      })
      window.open(routeData.href, '_blank')
    },

    editRemark(index, row) {
      let params = {
        storeId: Number(this.storeId),
        userId: this.userId,
        id:row.id
      }
      this.$prompt('请输入备注', '修改备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        params.remark = value
        putSellApplyRemark(params).then(res=>{
          if(res.data.code!==1001){
            this.$message({
              type: 'error',
              message: res.data.detail
            });
            return
          }
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.getSellApplyData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });

    },

    getSuppliersData() {
      const params = {
        storeId: this.storeId
      }
      getSuppliers(params).then(res => {
        this.suppliersList = res.data.data
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
        type: '2',
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
      delSellApply(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: res.data.detail,
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
        this.chioceSelect.outWarehouseId = data.outWarehouseId
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
            id: v.goodsSkuId,
            quantity: v.quantity,
            money: v.money/v.quantity,
            discountMoney: v.discountMoney,
            retailPrice: v.goodsSkuRetailPrice,
            vipPrice: v.goodsSkuVipPrice,
            totalMoney: v.money,
            remark: v.remark,
            sku: v.goodsSkuSku
          }
          this.choiceGoodsSku.push(_data)
        })
        this.choiceOutWarehouse(data.outWarehouseId)
        this.addVisible = true
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
      if(this.isEdit){
        data.id = this.chioceSelect.id
      }
      data.outWarehouseId = this.chioceSelect.outWarehouseId
      data.userId = this.userId
      data.storeId = this.storeId
      data.type = 2
      data.discountCouponId = this.chioceSelect.discountCouponId
      data.remark = this.chioceSelect.remark
      data.prodcingWay = 1
      data.clientId = this.chioceSelect.clientId
      data.totalDiscountMoney = this.chioceSelect.totalDiscountMoney ? this.chioceSelect.totalDiscountMoney : 0
      let outTotalQuantity = 0
      let totalMoney = 0
      const details = []
      this.choiceGoodsSku.forEach(v => {
        let _detail = {}
        if(v.isGift){
          outTotalQuantity += Number(v.quantity)
          _detail = {
            'type': 0,
            'goodsSkuId': v.id,
            'quantity': v.quantity,
            'money': 0,
            'discountMoney': 0,
            'remark': '赠品'
          }
        }else{
          v.quantity = v.quantity ? v.quantity : 0
          v.discountMoney = v.discountMoney ? v.discountMoney : 0
          v.money = v.money ? this.choiceClient.clientLevel.priceType == 1 ? (v.retailPrice * this.choiceClient.clientLevel.price).toFixed(2) : (v.vipPrice * this.choiceClient.clientLevel.price).toFixed(2) : 0
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
        }
        details.push(_detail)
      })
      data.outTotalQuantity = outTotalQuantity
      data.discountMoney = this.chioceSelect.discountMoney ? this.chioceSelect.discountMoney : 0
      data.orderMoney = totalMoney - this.chioceSelect.totalDiscountMoney
      data.totalMoney = totalMoney
      data.details = details
      const func = this.isEdit ? putSellApply : postSellApply
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
        this.getSellApplyData()
      })
    }

  }
}
</script>

<style lang='scss' scoped>

</style>
