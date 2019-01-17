<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addBtn"
      >
        添加零售订单
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
              @click.native.prevent="redRow(scope.$index,scope.row)"
            >
              红冲
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
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="addVisible" :title="isEdit?'编辑订单':'添加订单'">
      <div class="dialog-content-input">
        <el-select
          v-model="chioceSelect.clientId"
          :disabled="isEdit"
          size="mini"
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
          v-model="chioceSelect.bankAccountId"
          :disabled="isEdit"
          size="mini"
          placeholder="请选择银行账户"
        >
          <el-option
            v-for="item in bankAccountList"
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
            <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">
              删除
            </el-button>
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
import salecommon from '../mixins/salecommon'
import addMixin from '../mixins/addMixin.js'
import {
  getSuppliers,
  getSellApply,
  delOrderApply,
  getSellApplyDetails,
  postSellApply,
  putSellApply,
  redDashed,
  getWarehouseData
} from '@/service/PurchaseAndSale/Sale/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { retailDetailMap, statusMap } from '@/views/PurchaseAndSale/Sale/config.js'
import { dataFormat } from '@/utils/index.js'
import { parseTime } from '@/utils'
export default {
  name: 'RetailOrder',
  components: { SelectTable },
  mixins: [common, salecommon, addMixin],
  data() {
    return {
      filterData: {},
      pickTime:'',
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
      editVisible: false,
      editOrderDetail: [],
      editOrderRow: {},
      orderDetailMapShow: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSellApplyData()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getSellApplyData()
    },
    deleteRow(index, row) {
      this.choiceGoodsSku = this.choiceGoodsSku.filter(v => {
        return v.id !== row.id
      })
      this.addDetail.choiceGoodsSku = this.addDetail.choiceGoodsSku.filter(v => {
        return v !== row.id
      })
    },
    comfirm() {
      const data = {}
      data.outWarehouseId = this.chioceSelect.outWarehouseId
      data.userId = this.userId
      data.storeId = this.storeId
      data.type = 1
      data.discountCouponId = this.chioceSelect.discountCouponId
      data.remark = this.chioceSelect.remark
      data.prodcingWay = 1
      data.clientId = this.chioceSelect.clientId
      data.bankAccountId = this.chioceSelect.bankAccountId
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
          'money': v.money,
          'discountMoney': v.discountMoney,
          'remark': v.remark
        }
        details.push(_detail)
      })
      data.outTotalQuantity = outTotalQuantity
      data.discountMoney = this.chioceSelect.discountMoney?this.chioceSelect.discountMoney:''
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
    },
    getSellApplyData() {
      if(!this.filterData.id){
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
    // deleteRow(index, row, more) {
    //   const params = {
    //     storeId: this.storeId
    //   }
    //   if (!more) {
    //     params.ids = row.id
    //   } else {
    //     const arr = []
    //     this.selectArr.forEach(item => {
    //       arr.push(item.id)
    //     })
    //     params.ids = arr.join(',')
    //   }
    //   delOrderApply(params).then(res => {
    //     if (res.data.code !== 1001) {
    //       this.$message({
    //         showClose: true,
    //         message: '删除失败',
    //         type: 'error'
    //       })
    //       return
    //     }
    //     this.$message({
    //       showClose: true,
    //       message: '删除成功',
    //       type: 'success'
    //     })
    //     this.getSellApplyData()
    //   })
    //   console.log(row)
    // },
    editRow(index, row) {
      this.orderDetailMapShow = JSON.parse(JSON.stringify(this.orderDetailMap))
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getSellApplyDetails(params, path).then(res => {
        const data = res.data.data
        this.editOrderRow = data
        this.editOrderDetail = data.details
        const _data = dataFormat(data)
        if (_data.length > 0) {
          const sku = JSON.parse(_data[0].goodsSkuSku)
          Object.keys(sku).forEach(v => {
            this.orderDetailMapShow.push({ key: v, name: v })
          })
          _data.forEach(v => {
            let _itemSKU = {}
            const _sku = JSON.parse(v.goodsSkuSku)
            Object.keys(_sku).forEach(v2 => {
              _itemSKU = { [v2]: _sku[v2] }
              Object.assign(v, _itemSKU)
            })
          })
        }
        console.log(_data)
        this.editVisible = true
      })
    },
    readRow(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getSellApplyDetails(params, path).then(res => {
        const data = res.data.data
        this.orderDetails = data.details
        this.orderVisible = true
      })
    },
    redRow(index, row) {
      const params = {
        storeId: this.storeId,
        id: row.id,
        userId: this.userId
      }
      this.$prompt('此操作将红冲此单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '可以输入备注'
      }).then((value) => {
        if (value.value) {
          params.remark = value.value
        }
        postRedDashed(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '红冲失败',
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '红冲成功',
            type: 'success'
          })
          this.getOrderFundData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }

  }
}
</script>

<style lang='scss' scoped>

</style>
