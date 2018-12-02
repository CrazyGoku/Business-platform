<template>
  <div>
    <div class="search-bar">
      <el-input v-model="filterData.vagueFilter" placeholder="商品名称/货号/条码/规格" size="mini">
        <template slot="prepend">筛选条件</template>
      </el-input>
      <el-select v-model="filterData.brandFilter" filterable placeholder="请选择条码状态" size="mini">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="filterData.openStatusFilter" placeholder="请选择上架状态" size="mini">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <div style="width: 20px;">
        <el-button type="primary" size="mini">查询</el-button>
      </div>
    </div>
    <div class="flex-center">
      <TransverseShrinkBox ref="TransverseShrinkBox">
        <Tree :add="true" :delete-c="true" @deleteHandle="deleteHandle" @addHandle="addHandle"/>
      </TransverseShrinkBox>
      <select-table :is-select="true" v-model="selectArr" :data="commodityList" :pagination-data="paginationData">
        <el-table-column
          slot="handle"
          :fixed="true"
          label="操作"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>

  </div>
</template>

<script>
// import {getCommodityData} from '@/service/PurchaseAndSale/DataEditing/CommodityAdd'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import Tree from '@/components/Tree/Tree' // 树状图组件
import TransverseShrinkBox from '@/components/TransverseShrinkBox/TransverseShrinkBox' // 收缩弹性盒子
export default {
  name: 'CommoditySKUCode',
  components: {
    SelectTable,
    Tree,
    TransverseShrinkBox
  },
  data() {
    return {
      commodityList: {
        title: [{ name: '图片', key: 'img' }, { name: '名称', key: 'commodityName' }, {
          name: '货号',
          key: 'commodityAtrNo'
        }, { name: '条码', key: 'commodityCode' }, { name: '品牌', key: 'commodityBrand' }, {
          name: '单位',
          key: 'commodityUnit'
        }, { name: '库存', key: 'commodityStock' }, { name: '积分', key: 'commodityScore' }, {
          name: '零售价',
          key: 'commodityRetail'
        }, { name: 'VIP', key: 'commodityVip' }, { name: '备注', key: 'remarks' }],
        items: [{
          img: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', // 图片
          commodityName: '马连帽卫衣男2018秋季男', // 商品名称
          commodityAtrNo: 'ml002000081', // 商品货号
          commodityCode: '101', // 商品条码
          commodityBrand: '耐克', // 商品品牌
          commodityUnit: '件', // 商品单位
          commodityStock: '123', // 商品库存
          commodityScore: '12312', // 商品积分
          commodityRetail: '123123', // 商品零售价
          commodityVip: '3213123', // 商品VIP价
          remarks: '好的好的' // 备注
        }, {
          img: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          commodityName: '马连帽卫衣男2018秋123季男',
          commodityAtrNo: 'ml002000082',
          commodityCode: '102',
          commodityBrand: '啊克',
          commodityUnit: '件',
          commodityStock: '123',
          commodityScore: '12312',
          commodityRetail: '123123',
          commodityVip: '3213123',
          remarks: '好的'
        }]
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      selectArr: [],
      paginationData: {
        total: 100,
        currentPage: 1,
        pageSize: 10
      },
      filterData: {
        vagueFilter: '',
        brandFilter: '',
        openStatusFilter: ''
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // getCommodityData()
  },
  methods: {
    deleteHandle() {
      console.log('delete')
    },
    addHandle() {
      console.log(this.$refs.TransverseShrinkBox.test(), 123213)
    },
    deleteRow(index) {
      console.log(index)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
