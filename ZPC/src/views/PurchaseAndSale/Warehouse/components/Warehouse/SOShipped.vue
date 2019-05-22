<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.id" placeholder="请输入单据编号" size="mini">
        <template slot="prepend">
          单据编号
        </template>
      </el-input>
      <el-cascader
        v-model="selectedOptions"
        :options="targetOption"
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
        v-model="selectArr"
        :is-select="true"
        :data="orderStorageList"
        :pagination-data="paginationData"
        @paginationChange="getOrderStorageData"
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
              @click.native.prevent="postHandle(scope.$index,scope.row);createTime = ''"
            >
              发货
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="readRow(scope.$index,scope.row)"
            >
              查看详情
            </el-button>
            <!--<el-button
              type="text"
              size="small"
              @click.native.prevent="redRow(scope.$index,scope.row)"
            >
              红冲
            </el-button>-->
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog
      width="80%"
      title="发货"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <div class="handle-bar">
        <el-date-picker
          v-model="createTime"
          type="datetime"
          size="mini"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="可选择订单生成日期"
        />
      </div>
      <el-table
        :data="orderDetail.details"
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
          prop="goodsName"
          align="center"
          label="商品名"
        />
        <el-table-column
          prop="goodsSkuSku"
          align="center"
          label="规格"
        />
        <el-table-column
          prop="notFinishQuantityC"
          align="center"
          label="未发货数量"
        />
        <el-table-column label="数量" width="180" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.notFinishQuantity"
              :max="scope.row.notFinishQuantity"
              :no-slot="false"
            />
          </template>
        </el-table-column>
      </el-table>
      <div v-if="isOnline" class="dialog-content-input" style="margin-top: 10px;">
        <el-input v-model="resevieInfo.logisticsCompany" placeholder="请输入快递公司" size="mini">
          <template slot="prepend">
            快递公司
          </template>
        </el-input>

        <el-input v-model="resevieInfo.waybillNumber" placeholder="请输入运单号" size="mini">
          <template slot="prepend">
            运单号
          </template>
        </el-input>
        <el-input v-model="resevieInfo.receiverName" placeholder="请输入收货人名称" size="mini">
          <template slot="prepend">
            收货人名称
          </template>
        </el-input>
        <el-input v-model="resevieInfo.receiverPhone" placeholder="请输入收货人手机" size="mini">
          <template slot="prepend">
            收货人手机
          </template>
        </el-input>
        <el-input v-model="resevieInfo.receiverZipcode" placeholder="请输入收货人邮编" size="mini">
          <template slot="prepend">
            收货人邮编
          </template>
        </el-input>
        <el-input v-model="resevieInfo.receiverAddress" placeholder="请输入收货人地址" size="mini">
          <template slot="prepend">
            收货人地址
          </template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>
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
    </el-dialog>
  </div>
</template>

<script>
import common from '@/mixins/common'
import {
  getOrderStorage,
  postRedDashed,
  getSellResultDetails,
  postStorage,
  getSellApplyDetails
} from '@/service/PurchaseAndSale/Warehouse/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import {
  getSuppliers, getClients
} from '@/service/PurchaseAndSale/common'
import {
  getStorageReceiver
} from '@/service/PurchaseAndSale/Warehouse/SOShipped.js'
import { clearMap, statusMap } from '@/views/PurchaseAndSale/config.js'
import { parseTime } from '@/utils'
import { dataFormat } from '@/utils/index.js'
import { orderDetailMap } from '@/views/PurchaseAndSale/config.js'

export default {
  name: 'SOShipped',
  components: { SelectTable },
  mixins: [common],
  data() {
    return {
      filterData: {},
      pickTime: '',
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
      selectedOptions: [],
      suppliersList: [],
      orderStorageList: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      selectArr: [],
      addDialog: false,
      payParams: {},
      dialogVisible: false,
      orderDetail: [],
      orderDetailMap,
      orderDetails: [],
      orderVisible: false,
      isOnline: false,
      resevieInfo: {},
      createTime: ''
    }
  },

  computed: {},
  watch: {},
  mounted() {
    this.getSuppliersFun()
    this.getOrderStorageData()
    this.getClientsFun()
  },
  methods: {
    searchBtn() {
      this.paginationData.page = 1
      this.getOrderStorageData()
    },
    readRow(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getSellApplyDetails(params, path).then(res => {
        const data = res.data.data
        this.isOnline = data.prodcingWay == 2

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
        if (this.isOnline) {
          getStorageReceiver({ storeId: this.storeId, applyOrderId: row.id }).then(res => {
            if (res.data.code !== 1001) {
              this.$message({
                showClose: true,
                message: '查询收货地址错误',
                type: 'error'
              })
              return
            }
            this.resevieInfo = res.data.data
          })
        }
      })
    },
    getSuppliersFun() {
      const params = {
        storeId: this.storeId
      }
      getSuppliers(params).then(res => {
        this.suppliersList = res.data.data
        const _suppliersList = []
        this.suppliersList.forEach(v => {
          const _data = {
            value: v.name,
            label: v.name
          }
          _suppliersList.push(_data)
        })
        this.targetOption[1].children = _suppliersList
      })
    },
    getClientsFun() {
      const params = {
        disabled: 0
      }
      getClients(params).then(res => {
        const data = res.data.data
        const _clientsList = []
        data.forEach(v => {
          const _data = {
            value: v.name,
            label: v.name + '--' + v.username
          }
          _clientsList.push(_data)
        })
        this.targetOption[0].children = _clientsList
      })
    },
    getOrderStorageData() {
      if (!this.filterData.id) {
        delete this.filterData.id
      }
      if (this.selectedOptions.length > 0) {
        this.filterData.targetName = this.selectedOptions[1]
      } else {
        delete this.filterData.targetName
      }
      this.filterData.startTime = this.pickTime ? parseTime(this.pickTime[0]) : ''
      this.filterData.endTime = this.pickTime ? parseTime(this.pickTime[1]) : ''
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      const path = '3'
      getOrderStorage(params, path).then(res => {
        const data = res.data.data
        data.items.forEach(item => {
          item.orderStatus = statusMap[item.orderStatus]
        })
        this.orderStorageList = data
        this.paginationData = data.pageVo
      })
    },
    deleteRow(index, row) {
      this.orderDetail.details.splice(index, 1)
    },
    postHandle(index, row) {
      const params = {
        storeId: this.storeId
      }
      const path = row.id
      getSellApplyDetails(params, path).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '获取订单失败',
            type: 'error'
          })
          return
        }
        const data = res.data.data
        this.isOnline = data.prodcingWay == 2
        for (let i = data.details.length - 1; i >= 0; i--) {
          data.details[i].notFinishQuantityC = data.details[i].notFinishQuantity
          if (data.details[i].notFinishQuantity == 0) {
            data.details.splice(i, 1)
          } else {
            data.details[i].goodsSkuSku = eval(data.details[i].goodsSkuSku)
            let sku = ''
            data.details[i].goodsSkuSku.forEach((item, index2) => {
              let _sku = ''
              if (data.details[i].goodsSkuSku.length === index2 + 1) {
                _sku = item.key + ':' + item.value
              } else {
                _sku = item.key + ':' + item.value + ','
              }
              sku += _sku
            })
            data.details[i].goodsSkuSku = sku
          }
        }
        this.orderDetail = data
      })
      this.dialogVisible = true
      if (this.isOnline) {
        getStorageReceiver({ storeId: this.storeId, applyOrderId: row.id }).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '查询收货地址错误',
              type: 'error'
            })
            return
          }
          this.resevieInfo = res.data.data
        })
      }
    },
    confirmHandle() {
      const params = {
        sellApplyOrderVo: {}
      }
      params.remark = ''
      params.applyOrderId = this.orderDetail.id
      params.storeId = this.storeId
      params.userId = this.userId
      params.type = 3
      if (this.isOnline) {
        if (!this.resevieInfo.receiverAddress || !this.resevieInfo.receiverName || !this.resevieInfo.receiverPhone || !this.resevieInfo.receiverZipcode || !this.resevieInfo.logisticsCompany || !this.resevieInfo.waybillNumber) {
          this.$message.info('请完整输入收货人信息，以及快递信息')
          return
        }
        params.receiverAddress = this.resevieInfo.receiverAddress
        params.receiverName = this.resevieInfo.receiverName
        params.receiverPhone = this.resevieInfo.receiverPhone
        params.receiverZipcode = this.resevieInfo.receiverZipcode
        params.logisticsCompany = this.resevieInfo.logisticsCompany
        params.waybillNumber = this.resevieInfo.waybillNumber
      }
      let total = 0
      const _details = []
      this.orderDetail.details.forEach(v => {
        const _detail = {}
        v.quantity = v.notFinishQuantity
        total += Number(v.quantity)
        _detail.changeQuantity = v.quantity
        _detail.goodsSkuId = v.goodsSkuId
        _detail.id = v.id
        _detail.type = 0
        _details.push(_detail)
      })
      params.sellApplyOrderVo.details = _details
      params.quantity = total
      params.createTime = this.createTime
      postStorage(params).then(res => {
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
          message: '发货成功',
          type: 'success'
        })
        this.getOrderStorageData()
        this.dialogVisible = false
      })
    }
    /* redRow(index, row) {
        const params = {
          storeId: this.storeId,
          id: row.id,
          userId: this.userId
        }
        this.$prompt('此操作将红冲此订单, 是否继续?', '提示', {
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
            this.getOrderStorageData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }*/

  }
}
</script>

<style lang='scss' scoped>
  .dialog-footer {
    padding: 10px 20px 10px;
  }
</style>
