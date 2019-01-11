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
      <el-cascader
        v-model="selectedOptions2"
        :options="targetOption2"
        style="margin:0 10px 10px 0"
        size="mini"
        placeholder="请选择来往单位"
        filterable
        clearable
      />
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
        :data="storageResultList"
        :pagination-data="paginationData"
        @paginationChange="getStorageResultFun"
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
              @click.native.prevent="redDashedFun(scope.$index,scope.row)"
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
    <el-dialog :visible.sync="orderVisible" title="订单详情">
      <el-table :data="orderDetails">
        <el-table-column
          type="index"
          fixed
          align="center"
          width="20"
        />
        <el-table-column
          v-for="(item,index) in CostAdjustmentMap"
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
        <div class="dialog-content-input">
          <el-cascader
            v-model="selectedOptions"
            :options="targetOption"
            style="margin:0 10px 10px 0"
            size="mini"
            placeholder="请选择来往单位"
            filterable
          />
          <el-input
            v-model="addRemark"
            size="mini"
          >
            <template slot="prepend">
              备注
            </template>
          </el-input>
        </div>
        <el-select
          v-model="chioceSelect.inWarehouseId"
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
          :disabled="!chioceSelect.inWarehouseId"
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
        <el-table-column label="数量" width="180" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.quantity"
              size="small"
              @input="quantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="money" label="价格" width="180" align="center">
          <template scope="scope">
            <el-input
              v-model="scope.row.money"
              size="small"
              @input="moneyChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalMoney"
          align="center"
          label="总价"
        />
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
import canUseList from '@/mixins/canUseList.js'
import {
  postStorageResult,
  getStorageResult,
  getStorageResultById,
  redDashed
} from '@/service/PurchaseAndSale/Warehouse/common'
import {
  getClients,
  getSuppliers
} from '@/service/PurchaseAndSale/common'
import warehouseList from '@/mixins/warehouseList.js'
import { dataFormat } from '@/utils/index.js'
import { CostAdjustmentMap, orderType } from '@/views/PurchaseAndSale/Warehouse/config.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import addMixin from '../mixins/addMixin'
import { parseTime } from '@/utils'
export default {
  name: 'OtherOutOrder',
  components: { SelectTable },
  mixins: [common, addMixin, canUseList, warehouseList],
  data() {
    return {
      filterData: {
      },
      pickTime:'',
      targetOption2: [
        {
          value: 'kehu',
          label: '客户',
          children: []
        },
        {
          value: 'gongyingshang',
          label: '供应商',
          children: []
        }
      ],
      selectedOptions2:[],
      suppliersList: [],
      selectedOptions: [],
      targetOption: [
        {
          value: 'kehu',
          label: '客户',
          children: []
        },
        {
          value: 'gongyingshang',
          label: '供应商',
          children: []
        }
      ],
      storageResultList: [],
      orderDetails: [],
      isGetSkuMap: false,
      orderVisible: false,
      CostAdjustmentMap
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSuppliersFun()
    this.getClientsFun()
    this.getStorageResultFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getStorageResultFun()
    },
    getStorageResultFun() {
      if(!this.filterData.id){
        delete this.filterData.id
      }
      if(this.selectedOptions2.length>0){
        this.filterData.targetName = this.selectedOptions2[1]
      }else{
        delete this.filterData.targetName
      }
      this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
      this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
      const params = {
        storeId: this.storeId,
        type: 5,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getStorageResult(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.type = orderType[v.type]
        })
        this.storageResultList = data
        this.paginationData = data.pageVo
      })
    },
    getSuppliersFun() {
      const params = {
        storeId: this.storeId
      }
      getSuppliers(params).then(res => {
        this.suppliersList = res.data.data
        const _suppliersList = []
        const _suppliersList2 = []
        this.suppliersList.forEach(v => {
          const _data = {
            value: v.id,
            label: v.name
          }
          const _data2 = {
            value: v.name,
            label: v.name
          }
          _suppliersList.push(_data)
          _suppliersList2.push(_data2)
        })
        this.targetOption[1].children = _suppliersList
        this.targetOption2[1].children = _suppliersList2
      })
    },
    getClientsFun() {
      const params = {
        disabled: 0
      }
      getClients(params).then(res => {
        const data = res.data.data
        const _clientsList = []
        const _clientsList2 = []
        data.forEach(v => {
          const _data = {
            value: v.id,
            label: v.name + '--' + v.username
          }
          const _data2 = {
            value: v.name,
            label: v.name + '--' + v.username
          }
          _clientsList.push(_data)
          _clientsList2.push(_data2)
        })
        this.targetOption[0].children = _clientsList
        this.targetOption2[0].children = _clientsList2
      })
    },
    redDashedFun(index, row) {
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
        redDashed(params).then(res => {
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
          this.getStorageResultFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    readRow(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getStorageResultById(params, path).then(res => {
        const data = res.data.data
        const _data = dataFormat(data)
        if (_data.length > 0) {
          if (!this.isGetSkuMap) {
            const sku = eval(_data[0].goodsSkuSku)
            sku.forEach(v => {
              this.CostAdjustmentMap.push({ key: v.key, name: v.key })
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
      data.targetId = this.selectedOptions[1]
      data.warehouseId = this.chioceSelect.inWarehouseId
      data.type = 3
      data.remark = this.addRemark
      let totalQuantity = 0
      let totalMoney = 0
      const details = []
      this.choiceGoodsSku.forEach(v => {
        let _detail = {}
        totalQuantity += Number(v.quantity)
        totalMoney += Number(v.totalMoney)
        _detail = {
          'goodsSkuId': v.id,
          'money': v.totalMoney,
          'quantity': v.quantity,
          'remark': v.remark,
          'type': 1,
          'checkQuantity': v.checkQuantity,
          'checkMoney': v.checkMoney,
          'checkTotalMoney': v.checkTotalMoney
        }
        details.push(_detail)
      })
      data.details = details
      data.totalMoney = totalMoney
      data.totalQuantity = totalQuantity
      postStorageResult(data).then(res => {
        if (res.data.code != 1001) {
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
        this.addVisible = false
        this.getStorageResultFun()
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
