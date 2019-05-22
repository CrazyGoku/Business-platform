<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.id" clearable placeholder="商品货号" size="mini" @clear="getStorageInventorySkuFun">
        <template slot="prepend">
          商品货号
        </template>
      </el-input>
      <el-input
        v-model="filterData.name"
        clearable
        placeholder="商品名称"
        size="mini"
        @clear="getStorageInventorySkuFun"
      >
        <template slot="prepend">
          商品名称
        </template>
      </el-input>
      <el-select
        v-model="filterData.typeId"
        clearable
        size="mini"
        placeholder="商品类型"
        @clear="getStorageInventorySkuFun"
      >
        <el-option
          v-for="item in commodityTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchFun">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table
        :data="inventoryList"
        :pagination-data="paginationData"
        @paginationChange="getStorageInventorySkuFun"
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
              @click.native.prevent="distribution(scope.$index,scope.row,false)"
            >
              分布
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="reconciliation(scope.$index,scope.row)"
            >
              对账
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="dialogType===1?'库存分布':'库存对账'"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <select-table
        v-if="dialogType===1"
        :data="distributionList"
        :pagination-data="paginationData2"
        @paginationChange="getStorageInventorySkuDistributionFun"
      />
      <div v-if="dialogType===2">
        <div class="search-bar">
          <el-date-picker
            v-model="reconciliationTime"
            :picker-options="pickerOptions"
            type="daterange"
            align="right"
            unlink-panels
            size="mini"
            range-separator="至"
            start-placeholder="单据日期（起）"
            end-placeholder="单据日期（止）"
            @clear="getStorageInventorySkuCheckFun"
          />
          <div style="width: 20px;">
            <el-button type="primary" size="mini" @click="getStorageInventorySkuCheckFun">
              查询
            </el-button>
          </div>
        </div>
        <select-table
          :data="checkList"
          :pagination-data="paginationData2"
          @paginationChange="getStorageInventorySkuCheckFun"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">
          取 消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/mixins/common'
import {
  getStorageInventorySku,
  getStorageInventorySkuCheck,
  getStorageInventorySkuDistribution
} from '@/service/PurchaseAndSale/Report/SearchStock.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import commodityTypeList from '@/mixins/commodityTypeList.js'

export default {
  name: 'ByAttributes',
  components: { SelectTable },
  mixins: [common, commodityTypeList],
  data() {
    return {
      filterData: {
        orderId: '',
        pickTime: '',
        supplier: ''
      },
      inventoryList: [],
      paginationData2: {
        page: 1,
        pageSize: 10
      },
      dialogVisible: false,
      choiceRow: {},
      dialogType: -1,
      distributionList: [],
      checkList: [],
      reconciliationTime: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getStorageInventorySkuFun()
  },
  methods: {
    getStorageInventorySkuFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getStorageInventorySku(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.sku = eval(v.sku)
          let sku = ''
          v.sku.forEach((item, index) => {
            let _sku = ''
            if (v.sku.length === index + 1) {
              _sku = item.key + ':' + item.value
            } else {
              _sku = item.key + ':' + item.value + ','
            }
            sku += _sku
          })
          v.sku = sku
        })
        this.inventoryList = data
        this.paginationData = data.pageVo
      })
    },
    searchFun() {
      this.paginationData.page = 1
      this.getStorageInventorySkuFun()
    },
    getStorageInventorySkuCheckFun() {
      const params = {
        storeId: this.storeId,
        goodsSkuId: this.choiceRow.goodsSkuId,
        startTime: this.reconciliationTime ? this.reconciliationTime[0] : '',
        endTime: this.reconciliationTime ? this.reconciliationTime[1] : '',
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize
      }
      getStorageInventorySkuCheck(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.sku = eval(v.sku)
          let sku = ''
          v.sku.forEach((item, index) => {
            let _sku = ''
            if (v.sku.length === index + 1) {
              _sku = item.key + ':' + item.value
            } else {
              _sku = item.key + ':' + item.value + ','
            }
            sku += _sku
          })
          v.sku = sku
        })
        this.checkList = data
        this.paginationData = data.pageVo
      })
    },
    getStorageInventorySkuDistributionFun() {
      const params = {
        storeId: this.storeId,
        goodsSkuId: this.choiceRow.goodsSkuId,
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize
      }
      getStorageInventorySkuDistribution(params).then(res => {
        const data = res.data.data
        data.items.forEach(v => {
          v.sku = eval(v.sku)
          let sku = ''
          v.sku.forEach((item, index) => {
            let _sku = ''
            if (v.sku.length === index + 1) {
              _sku = item.key + ':' + item.value
            } else {
              _sku = item.key + ':' + item.value + ','
            }
            sku += _sku
          })
          v.sku = sku
        })
        this.distributionList = data
        this.paginationData = data.pageVo
      })
    },
    distribution(index, row) {
      this.dialogType = 1
      this.choiceRow = row
      this.paginationData2.page = 1
      this.dialogVisible = true
      this.getStorageInventorySkuDistributionFun()
    },
    reconciliation(index, row) {
      this.dialogType = 2
      this.choiceRow = row
      this.paginationData2.page = 1
      this.dialogVisible = true
      this.getStorageInventorySkuCheckFun()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
