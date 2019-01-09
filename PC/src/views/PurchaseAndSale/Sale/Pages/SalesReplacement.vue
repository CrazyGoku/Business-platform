<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click=""
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
  </div>
</template>

<script>
import common from '@/mixins/common'
import { getSuppliers, getSellApply, delOrderApply, getSellApplyDetails } from '@/service/PurchaseAndSale/Sale/common.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { orderDetailMap } from '@/views/PurchaseAndSale/Purchase/config.js'
import { dataFormat } from '@/utils/index.js'
export default {
  name: 'SalesReplacement',
  components: { SelectTable },
  mixins: [common],
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
        type: '4'
      }
      getSellApply(params).then(res => {
        const data = res.data.data
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
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
