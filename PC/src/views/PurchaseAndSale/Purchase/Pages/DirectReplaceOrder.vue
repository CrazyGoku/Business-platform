<template>
  <div>
    <div class="search-bar">
      <el-select
        v-model="chioceSelect.supplierId"
        size="mini"
        filterable
        filterable placeholder="请选择供应商"
      >
        <el-option
          v-for="item in supplierList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="chioceSelect.inWarehouseId"
        size="mini"
        filterable placeholder="请选择入库仓库"
        @change="choiceWarehose(1)"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="chioceSelect.outWarehouseId"
        size="mini"
        filterable placeholder="请选择出库仓库"
        @change="choiceWarehose(2)"

      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="in-content">
      <p>换入商品</p>
      <div class="search-bar">
        <el-select
          v-model="chioceSelect.inGoodType"
          :disabled="!chioceSelect.inWarehouseId"
          size="mini"
          filterable placeholder="请选择商品分类"
          @change="choiceInGoodsTypeFun"
        >
          <el-option
            v-for="item in inUseGood"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.inGood"
          :disabled="!chioceSelect.inGoodType"
          size="mini"
          filterable
          placeholder="请选择商品"
          @change="choiceInGoodsFun"
        >
          <el-option
            v-for="item in goodsInVos"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.inGoodsSku"
          :disabled="!chioceSelect.inGood"
          size="mini"
          placeholder="请选择商品规格"
          @change="choiceInGoodsSkuFun"
        >
          <el-option
            v-for="item in goodsInSkuVos"
            :key="item.id"
            :disabled="choiceInGoodsSku.findIndex(v=> v.id===item.id)>-1"
            :label="item.sku"
            :value="item.id"
          />
        </el-select>
      </div>
      <el-table
        :data="choiceInGoodsSku"
        height="500"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          label="操作"
          align="center"
          width="100"
        >
          <template scope="scope">
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button size="mini" type="danger" @click="deleteInChoiceRow(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <!--   <el-table-column
          prop="bookInventory"
          align="center"
          label="总库存">
        </el-table-column>
        <el-table-column
          prop="canUseInventory"
          align="center"
          label="可用库存">
        </el-table-column>
        <el-table-column
          prop="realInventory"
          align="center"
          label="实际库存">
        </el-table-column>
        <el-table-column
          prop="integral"
          align="center"
          label="积分">
        </el-table-column>-->
        <el-table-column
          prop="goodName"
          align="center"
          width="200"
          label="商品名称"
        />
        <el-table-column
          prop="sku"
          align="center"
          width="200"
          label="规格"
        />
        <el-table-column
          align="center"
          width="150"
          label="预设进价"
        >
          <template scope="scope">
            <NumberInput
              v-model="scope.row.money"
              :no-slot="false"
              @input="moneyChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="150" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.quantity"
              :no-slot="false"
              min="1"
              @input="moneyChange(scope.row)"
            />
          </template>
        </el-table-column>
        <!--<el-table-column label="折扣" width="150" align="center">-->
          <!--<template scope="scope">-->
            <!--<NumberInput-->
              <!--v-model="scope.row.discountMoney"-->
              <!--:no-slot="false"-->
              <!--@input="moneyChange(scope.row)"-->
            <!--/>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="总价" align="center">
          <template scope="scope">
            {{ scope.row.totalMoney }}
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

    </div>
    <div class="out-content">
      <p>换出商品</p>
      <div class="search-bar">
        <el-select
          v-model="chioceSelect.goodOutType"
          :disabled="!chioceSelect.outWarehouseId"
          size="mini"
          filterable placeholder="请选择商品分类"
          @change="choiceOutGoodsTypeFun"
        >
          <el-option
            v-for="item in outUseGood"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.outGood"
          :disabled="!chioceSelect.goodOutType"
          size="mini"
          filterable
          placeholder="请选择商品"
          @change="choiceOutGoodsFun"
        >
          <el-option
            v-for="item in goodsOutVos"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="chioceSelect.goodsSku"
          :disabled="!chioceSelect.outGood"
          size="mini"
          placeholder="请选择商品规格"
          @change="choiceOutGoodsSkuFun"
        >
          <el-option
            v-for="item in goodsOutSkuVos"
            :key="item.id"
            :disabled="choiceOutGoodsSku.findIndex(v=> v.id===item.id)>-1"
            :label="item.sku"
            :value="item.id"
          />
        </el-select>
      </div>
      <el-table
        :data="choiceOutGoodsSku"
        height="500"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          label="操作"
          align="center"
          width="100"
        >
          <template scope="scope">
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button size="mini" type="danger" @click="deleteOutChoiceRow(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <!--   <el-table-column
          prop="bookInventory"
          align="center"
          label="总库存">
        </el-table-column>
        <el-table-column
          prop="canUseInventory"
          align="center"
          label="可用库存">
        </el-table-column>
        <el-table-column
          prop="realInventory"
          align="center"
          label="实际库存">
        </el-table-column>
        <el-table-column
          prop="integral"
          align="center"
          label="积分">
        </el-table-column>-->
        <el-table-column
          prop="goodName"
          align="center"
          width="200"
          label="商品名称"
        />
        <el-table-column
          prop="sku"
          align="center"
          width="200"
          label="规格"
        />
        <el-table-column
          align="center"
          width="150"
          label="预设进价"
        >
          <template scope="scope">
            <NumberInput
              v-model="scope.row.money"
              :no-slot="false"
              @input="moneyChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="150" align="center">
          <template scope="scope">
            <NumberInput
              v-model="scope.row.quantity"
              :no-slot="false"
              min="1"
              @input="moneyChange(scope.row)"
            />
          </template>
        </el-table-column>
        <!--<el-table-column label="折扣" width="150" align="center">-->
          <!--<template scope="scope">-->
            <!--<NumberInput-->
              <!--v-model="scope.row.discountMoney"-->
              <!--:no-slot="false"-->
              <!--@input="moneyChange(scope.row)"-->
            <!--/>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="总价" align="center">
          <template scope="scope">
            {{ scope.row.totalMoney }}
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

    </div>
    <div style="display: flex;justify-content: flex-end;align-items: center;margin-top: 20px;">

      <span style="color: orangered;margin-right: 10px">{{amountReceivable}} 元</span>
      <el-button  type="primary" @click="comfirm">确定</el-button>

    </div>
  </div>
</template>

<script>
  import common from '@/mixins/common'
  import addMixin from '../mixins/addMixin'
  import supplierList from '@/mixins/supplierList.js'
  import warehouseList from '@/mixins/warehouseList.js'
  import {
    canUse,
    postOrderApply,
    putOrderApply
  } from '@/service/PurchaseAndSale/Purchase/common.js'
  export default {
    name: "DirectReplaceOrder",
    mixins: [common, supplierList, warehouseList],
    data() {
      return {
        inUseGood: [],
        outUseGood: [],
        chioceSelect: {},
        choiceClient: {},
        goodsInVos: [],
        goodsInSkuVos: [],
        goodsOutVos: [],
        goodsOutSkuVos: [],
        choiceInGoodsSku: [],
        choiceOutGoodsSku: [],
        amountReceivable:0
      }
    },
    mounted() {
    },
    methods: {
      moneyChange(row){
        row.totalMoney = ( row.quantity * row.money ) - row.discountMoney
        let inTotalMoney = 0
        let outTotalMoney = 0
        this.choiceInGoodsSku.forEach(v=>{
          inTotalMoney+=Number(v.totalMoney)
        })
        this.choiceOutGoodsSku.forEach(v=>{
          outTotalMoney+=Number(v.totalMoney)
        })

        this.amountReceivable = inTotalMoney - outTotalMoney
      },
      deleteInChoiceRow(index,row){
        this.choiceInGoodsSku = this.choiceInGoodsSku.filter(v => {
          return v.id !== row.id
        })

        let inTotalMoney = 0
        let outTotalMoney = 0
        this.choiceInGoodsSku.forEach(v=>{
          inTotalMoney+=Number(v.totalMoney)
        })
        this.choiceOutGoodsSku.forEach(v=>{
          outTotalMoney+=Number(v.totalMoney)
        })
        this.amountReceivable =inTotalMoney - outTotalMoney
      },
      deleteOutChoiceRow(index,row){
        this.choiceOutGoodsSku = this.choiceOutGoodsSku.filter(v => {
          return v.id !== row.id
        })

        let inTotalMoney = 0
        let outTotalMoney = 0
        this.choiceInGoodsSku.forEach(v=>{
          inTotalMoney+=Number(v.totalMoney)
        })
        this.choiceOutGoodsSku.forEach(v=>{
          outTotalMoney+=Number(v.totalMoney)
        })
        this.amountReceivable = inTotalMoney - outTotalMoney
      },
      choiceInGoodsTypeFun(value) {
        this.goodsInVos = this.inUseGood.filter(v => {
          return v.id === value
        })[0].goodsVos
        if (this.goodsInVos.length <= 0) {
          this.$message({
            message: '该商品分类没有可用商品',
            type: 'warning'
          })
        }
      },
      choiceInGoodsFun(value) {
        this.goodsInSkuVos = this.goodsInVos.filter(v => {
          return v.id === value
        })[0].goodsSkuVos
        if (this.goodsInSkuVos.length <= 0) {
          this.$message({
            message: '该商品分类没有可用规格',
            type: 'warning'
          })
        } else {
          this.goodsInSkuVos.forEach(v => {
            v.goodName = this.goodsInVos.filter(v => {
              return v.id === value
            })[0].name
            if(v.sku[0]=='['){
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
            }
          })
          this.chioceSelect.goodsSku = this.goodsInSkuVos[0].id
          this.choiceInGoodsSkuFun(this.goodsInSkuVos[0].id)
        }
      },
      choiceInGoodsSkuFun(value) {

        let inTotalMoney = 0
        let outTotalMoney = 0
        if (this.choiceInGoodsSku.findIndex(v => {
          return v.goodsSkuId === value || v.id === value
        }) > -1) {
          this.$message({
            showClose: true,
            message: '重复添加商品规格',
            type: 'info'
          })
          return
        }
        const _data = this.goodsInSkuVos.filter(v => {
          return v.id == value
        })[0]
        this.choiceInGoodsSku.push(_data)

        this.choiceInGoodsSku.forEach(v => {
          let quantity = 1
          if(v.quantity>1) quantity = v.quantity
          this.$set(v, 'type', 1)
          this.$set(v, 'isGift', false)
          this.$set(v, 'goodsSkuId', v.id)
          this.$set(v, 'goodName', v.goodName)
          this.$set(v, 'quantity', quantity)
          this.$set(v, 'money', v.retailPrice)
          this.$set(v, 'discountMoney', 0)
          this.$set(v, 'remark', '')
          this.$set(v, 'totalMoney', quantity*v.retailPrice)
          inTotalMoney+=Number(v.totalMoney)
        })
        this.choiceOutGoodsSku.forEach(v=>{
          outTotalMoney+=Number(v.totalMoney)
        })
        this.amountReceivable = inTotalMoney - outTotalMoney
        this.chioceSelect.goodsSku = ''
      },
      choiceOutGoodsTypeFun(value) {
        this.goodsOutVos = this.outUseGood.filter(v => {
          return v.id === value
        })[0].goodsVos
        if (this.goodsOutVos.length <= 0) {
          this.$message({
            message: '该商品分类没有可用商品',
            type: 'warning'
          })
        }
      },
      choiceOutGoodsFun(value) {
        this.goodsOutSkuVos = this.goodsOutVos.filter(v => {
          return v.id === value
        })[0].goodsSkuVos
        if (this.goodsOutSkuVos.length <= 0) {
          this.$message({
            message: '该商品分类没有可用规格',
            type: 'warning'
          })
        } else {
          this.goodsOutSkuVos.forEach(v => {
            v.goodName = this.goodsOutVos.filter(v => {
              return v.id === value
            })[0].name
            if(v.sku[0]=='['){
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
            }
          })
          this.chioceSelect.goodsSku = this.goodsOutSkuVos[0].id
          this.choiceOutGoodsSkuFun(this.goodsOutSkuVos[0].id)
        }
      },
      choiceOutGoodsSkuFun(value) {
        let inTotalMoney = 0
        let outTotalMoney = 0
        if (this.choiceOutGoodsSku.findIndex(v => {
          return v.goodsSkuId === value || v.id === value
        }) > -1) {
          this.$message({
            showClose: true,
            message: '重复添加商品规格',
            type: 'info'
          })
          return
        }
        const _data = this.goodsOutSkuVos.filter(v => {
          return v.id == value
        })[0]
        this.choiceOutGoodsSku.push(_data)
        this.choiceOutGoodsSku.forEach(v => {
          let quantity = 1
          if(v.quantity>1) quantity = v.quantity
          this.$set(v, 'type', 1)
          this.$set(v, 'isGift', false)
          this.$set(v, 'goodsSkuId', v.id)
          this.$set(v, 'goodName', v.goodName)
          this.$set(v, 'quantity', quantity)
          this.$set(v, 'money', v.retailPrice)
          this.$set(v, 'discountMoney', 0)
          this.$set(v, 'remark', '')
          this.$set(v, 'totalMoney', quantity*v.retailPrice)
          outTotalMoney+=Number(v.totalMoney)

        })

        this.choiceInGoodsSku.forEach(v=>{
          inTotalMoney+=Number(v.totalMoney)
        })
        this.amountReceivable = inTotalMoney - outTotalMoney
        this.chioceSelect.goodsSku = ''
      },
      choiceWarehose(type) {
        let warehouseId = ''
        if (type == 1) {
          warehouseId = this.chioceSelect.inWarehouseId
        } else {
          warehouseId = this.chioceSelect.outWarehouseId

        }
        const params = {
          storeId: this.storeId,
          warehouseId
        }
        canUse(params).then(res => {
          if (type == 1) {
            this.inUseGood = res.data.data
          } else {
            this.outUseGood = res.data.data
          }
          if (res.data.data.length <= 0) {
            this.$message({
              message: '该仓库没有可用商品',
              type: 'warning'
            })
          }
        })
      },
      comfirm() {
        const data = {}
        data.prodcingWay = 1
        data.userId = this.userId
        data.storeId = this.storeId
        data.outWarehouseId = this.chioceSelect.outWarehouseId
        data.supplierId = this.chioceSelect.supplierId
        data.inWarehouseId = this.chioceSelect.inWarehouseId
        data.remark = this.chioceSelect.remark
        data.totalDiscountMoney = 0
        data.discountMoney = 0
        let totalInMoney = 0
        let totalOutMoney = 0
        data.type = 3
        let inTotalQuantity = 0
        let outTotalQuantity = 0
        const details = []
        this.choiceInGoodsSku.forEach(v => {
          let _detail = {}
          inTotalQuantity +=  Number(v.quantity)
          totalInMoney +=  Number(v.totalMoney)
          _detail = {
            'type': 1,
            'goodsSkuId': v.goodsSkuId,
            'quantity': v.quantity,
            'money': v.totalMoney,
            'discountMoney': v.discountMoney,
            'remark': v.remark
          }
          details.push(_detail)
        })
        this.choiceOutGoodsSku.forEach(v => {
          let _detail2 = {}
          outTotalQuantity +=  Number(v.quantity)
          totalOutMoney +=  Number(v.totalMoney)

          _detail2 = {
            'type': 0,
            'goodsSkuId': v.goodsSkuId,
            'quantity': v.quantity,
            'money': v.totalMoney,
            'discountMoney': v.discountMoney,
            'remark': v.remark
          }
          details.push(_detail2)
        })
        data.outTotalQuantity = outTotalQuantity
        data.inTotalQuantity = inTotalQuantity
        data.totalMoney = totalInMoney- totalOutMoney
        data.orderMoney = totalInMoney- totalOutMoney
        data.details = details
        postOrderApply(data).then(res => {
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
            message: '成功添加换货订单，请在采购换货申请查看',
            type: 'success'
          })
          this.addVisible = false
          this.chioceSelect = {}
          this.choiceInGoodsSku = []
          this.choiceOutGoodsSku = []
        })
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang='scss' scoped>

</style>
