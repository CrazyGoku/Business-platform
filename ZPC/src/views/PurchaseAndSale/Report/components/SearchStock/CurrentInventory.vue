<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.id" clearable placeholder="商品货号" size="mini" @clear="getStorageInventoryCurrentFun">
        <template slot="prepend">
          商品货号
        </template>
      </el-input>
      <el-input
        v-model="filterData.name"
        clearable
        placeholder="商品名称"
        size="mini"
        @clear="getStorageInventoryCurrentFun"
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
        @clear="getStorageInventoryCurrentFun"
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
        @paginationChange="getStorageInventoryCurrentFun"
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
            <el-button
              type="text"
              size="small"
              @click.native.prevent="redAttr(scope.$index,scope.row)"
            >
              属性
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="dialogType===1?'库存分布':dialogType===2?'库存对账':'属性明细'"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <select-table
        v-if="dialogType===3"
        :data="skuList"
        :pagination-data="paginationData2"
        @paginationChange="getStorageInventoryCurrentSkuFun"
      />
      <select-table
        v-if="dialogType===1"
        :data="distributionList"
        :pagination-data="paginationData2"
        @paginationChange="getStorageInventoryCurrentDistributionFun"
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
          />
          <div style="width: 20px;">
            <el-button type="primary" size="mini" @click="getStorageInventoryCurrentCheckFun">
              查询
            </el-button>
          </div>
        </div>
        <select-table
          :data="checkList"
          :pagination-data="paginationData2"
          @paginationChange="getStorageInventoryCurrentCheckFun"
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
  getStorageInventoryCurrent,
  getStorageInventoryCurrentSku,
  getStorageInventoryCurrentCheck,
  getStorageInventoryCurrentDistribution
} from '@/service/PurchaseAndSale/Report/SearchStock.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import commodityTypeList from '@/mixins/commodityTypeList.js'

export default {
  name: 'CurrentInventory',
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
      skuList: [],
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
    this.getStorageInventoryCurrentFun()
  },
  methods: {
    getStorageInventoryCurrentFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getStorageInventoryCurrent(params).then(res => {
        const data = res.data.data
        this.inventoryList = data
        this.paginationData = data.pageVo
      })
    },
    searchFun() {
      this.paginationData.page = 1
      this.getStorageInventoryCurrentFun()
    },
    redAttr(index, row) {
      this.dialogType = 3
      this.choiceRow = row
      this.paginationData2.page = 1
      this.dialogVisible = true
      this.getStorageInventoryCurrentSkuFun()
    },
    getStorageInventoryCurrentSkuFun() {
      const params = {
        storeId: this.storeId,
        goodsId: this.choiceRow.id,
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize
      }
      getStorageInventoryCurrentSku(params).then(res => {
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
        this.skuList = data
        this.paginationData = data.pageVo
      })
    },
    getStorageInventoryCurrentCheckFun() {
      const params = {
        storeId: this.storeId,
        goodsId: this.choiceRow.id,
        startTime: this.reconciliationTime[0] ? this.reconciliationTime[0] : '',
        endTime: this.reconciliationTime[1] ? this.reconciliationTime[1] : '',
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize
      }
      getStorageInventoryCurrentCheck(params).then(res => {
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
    getStorageInventoryCurrentDistributionFun() {
      const params = {
        storeId: this.storeId,
        goodsId: this.choiceRow.id,
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize
      }
      getStorageInventoryCurrentDistribution(params).then(res => {
        const data = res.data.data
        this.distributionList = data
        this.paginationData = data.pageVo
      })
    },
    distribution(index, row) {
      this.dialogType = 1
      this.choiceRow = row
      this.paginationData2.page = 1
      this.dialogVisible = true
      this.getStorageInventoryCurrentDistributionFun()
    },
    reconciliation(index, row) {
      this.dialogType = 2
      this.choiceRow = row
      this.paginationData2.page = 1
      this.dialogVisible = true
      this.getStorageInventoryCurrentCheckFun()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
