<template>
  <div>
    <div class="search-bar">
      <el-input @clear="getStorageInventoryWarehouseFun" clearable v-model="filterData.goodsId" placeholder='商品货号' size="mini">
        <template slot="prepend">商品货号</template>
      </el-input>
      <el-input @clear="getStorageInventoryWarehouseFun" clearable v-model="filterData.name" placeholder='商品名称'
                size="mini">
        <template slot="prepend">商品名称</template>
      </el-input>
      <el-select
        v-model="filterData.warehouseId"
        clearable
        @clear="getStorageInventoryWarehouseFun"
        size="mini"
        placeholder="仓库"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filterData.typeId"
        clearable
        @clear="getStorageInventoryWarehouseFun"
        size="mini"
        placeholder="商品类型"
      >
        <el-option
          v-for="item in commodityTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchFun">查询</el-button>
      </div>
    </div>
    <div class="flex-center">
      <select-table :data="inventoryList" :pagination-data="paginationData"
                    @paginationChange="getStorageInventoryWarehouseFun"
      >
      </select-table>
    </div>
 
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import {
    getStorageInventoryWarehouse,
  } from '@/service/PurchaseAndSale/Report/SearchStock.js'
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import commodityTypeList from '@/mixins/commodityTypeList.js'
  import warehouseList from '@/mixins/warehouseList.js'

  export default {
    name: "ByWarehouse",
    components: {SelectTable},
    mixins: [common, commodityTypeList,warehouseList],
    data() {
      return {
        filterData: {
          goodsId: '',
          pickTime: '',
          supplier: '',
          warehouseId:''
        },
        inventoryList: []
      }
    },
    mounted() {
      this.getStorageInventoryWarehouseFun()
    },
    methods: {
      getStorageInventoryWarehouseFun() {
        let params = {
          flag:0,
          storeId: this.storeId,
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize,
          ...this.filterData
        }
        getStorageInventoryWarehouse(params).then(res => {
          let data = res.data.data
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
        this.getStorageInventoryWarehouseFun()
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang='scss' scoped>

</style>
