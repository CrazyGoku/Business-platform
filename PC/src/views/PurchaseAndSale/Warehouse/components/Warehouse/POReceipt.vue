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
              @click.native.prevent="getHandle(scope.$index,scope.row)"
            >
              收货
            </el-button>
           <!-- <el-button
              type="text"
              size="small"
              @click.native.prevent="redRow(scope.$index,scope.row)"
            >
              红冲
            </el-button>-->
          </template>
        </el-table-column>
      </select-table>
      <el-dialog
        width="80%"
        title="收货"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
      >
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
            width="200"
            label="商品名称"
          />
          <el-table-column
            prop="goodsSkuSku"
            align="center"
            label="规格"
          />
          <el-table-column
            prop="notFinishQuantity"
            align="center"
            label="未收货数量"
          />
          <el-table-column label="数量" width="180" align="center">
            <template scope="scope">
              <NumberInput
                :max="scope.row.notFinishQuantity"
                v-model="scope.row.notFinishQuantity"
                :no-slot="false"
              >

              </NumberInput>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="confirmHandle">
          确 定
        </el-button>
      </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import {
    getOrderStorage,
    postRedDashed,
    postStorage,
    getProcurementApplyDetails
  } from '@/service/PurchaseAndSale/Warehouse/common.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import {
    getSuppliers, getClients
  } from '@/service/PurchaseAndSale/common'
  import {statusMap} from '@/views/PurchaseAndSale/config.js'
  import {parseTime} from '@/utils'

  export default {
    name: 'POReceipt',
    components: {SelectTable},
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
        dialogVisible: false,
        orderDetail: []
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
        const path = '1'
        getOrderStorage(params, path).then(res => {
          const data = res.data.data
          data.items.forEach(item => {
            item.orderStatus = statusMap[item.orderStatus]
          })
          this.orderStorageList = data
          this.paginationData = data.pageVo
        })
      },
      deleteRow(index, row, more) {
        this.orderDetail.details.splice(index,1)

      },
      getHandle(index, row) {
        let params = {
          storeId: this.storeId,
        }
        let path = row.id
        getProcurementApplyDetails(params, path).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '获取订单失败',
              type: 'error'
            })
            return
          }
          let data = res.data.data
          for (let i = data.details.length-1;i>=0;i--){
            if(data.details[i].notFinishQuantity==0){
              data.details.splice(i,1)
            }else{
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
        /*if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '获取来源订单失败',
            type: 'error'
          })
          return
        }
        orderDetail = res.data.data
      })
      this.$prompt('此操作将确认收货, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '可以输入备注',
      }).then((value) => {
        let params = {
          procurementApplyOrderVo: {}
        }
        params.remark = value.value ? value.value : ''
        params.applyOrderId = orderDetail.id
        params.quantity = orderDetail.inNotReceivedQuantity
        params.storeId = this.storeId
        params.userId = this.userId
        params.type = 1
        let _details = []
        orderDetail.details.forEach(v => {
          let _detail = {}
          _detail.changeQuantity = v.quantity
          _detail.goodsSkuId = v.goodsSkuId
          _detail.id = v.id
          _detail.type = 1
          _details.push(_detail)
        })
        params.procurementApplyOrderVo.details = _details
        postStorage(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '收货失败',
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '收货成功',
            type: 'success'
          })
          this.getOrderStorageData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });*/
      },
      confirmHandle(){
        let params = {
          procurementApplyOrderVo: {}
        }
        params.remark = ''
        params.applyOrderId = this.orderDetail.id
        params.storeId = this.storeId
        params.userId = this.userId
        params.type = 1
        let _details = []
        let total = 0
        this.orderDetail.details.forEach(v => {
          let _detail = {}
          v.quantity = v.notFinishQuantity
          total+=Number(v.quantity)
          _detail.changeQuantity = v.quantity
          _detail.goodsSkuId = v.goodsSkuId
          _detail.id = v.id
          _detail.type = 1
          _details.push(_detail)
        })
        params.quantity = total
        params.procurementApplyOrderVo.details = _details
        postStorage(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '收货失败',
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '收货成功',
            type: 'success'
          })
          this.getOrderStorageData()
          this.dialogVisible = false
        })
      },

      /*redRow(index, row) {
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

</style>
