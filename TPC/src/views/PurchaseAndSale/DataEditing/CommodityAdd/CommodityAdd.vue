<template>
  <div>
    <!--<PrintBtn @click="printFun" />-->
    <div class="handle-bar">
      <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addFun">
        添加
      </el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="exportDialog = true">
        导出
      </el-button>
      <form>
        <input id="uploadEventFile" type="file" name="fileup" style="display:none" @change="fileChange($event)">
      </form>
      <el-button
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="importData($event)"
      >
        导入
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="downloadFile('/goods/import/template',{storeId:storeId})"
      >
        导出模版
      </el-button>
      <!--      <el-button type="primary" icon="el-icon-remove-outline" size="mini">
        批量删除
      </el-button>-->
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.id" placeholder="商品货号" size="mini">
        <template slot="prepend">
          商品货号
        </template>
      </el-input>
      <el-input v-model="filterData.barCode" placeholder="商品条码" size="mini">
        <template slot="prepend">
          商品条码
        </template>
      </el-input>
      <div style="width: 20px;">
        <el-button type="primary" size="mini" @click="searchBtn">
          查询
        </el-button>
      </div>
    </div>
    <div class="flex-center">
      <TransverseShrinkBox ref="TransverseShrinkBox">
        <Tree :data="commodityTypeList" @nodeClick="changeType" />
      </TransverseShrinkBox>
      <select-table
        v-model="selectArr"
        :is-select="true"
        :data="commodityList"
        :pagination-data="paginationData"
        @paginationChange="getCommodityDataFun"
      >
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
              @click.native.prevent="editRow(scope.$index,scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="isEdit?'编辑商品':'添加商品'"
    >
      <div style="margin-bottom: 10px">
        <el-select
          v-model="commodityDetail.typeId"
          :disabled="isEdit"
          size="mini"
          filterable placeholder="请选择商品分类"
          @change="changeAddType"
        >
          <el-option
            v-for="item in commodityTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <!--<el-button type="primary" size="mini" @click="unitAdd">批量添加数量</el-button>-->
        <el-button
          v-if="commodityDetail.typeId"
          icon="el-icon-circle-plus-outline"
          style="margin-left: 10px;"
          type="primary"
          round
          size="mini"
          @click="addSpecifications"
        >
          添加规格
        </el-button>
        <el-button
          v-if="isEditStatus"
          icon="el-icon-circle-close-outline"
          style="margin-left: 10px;"
          type="primary"
          round
          size="mini"
          @click="setCurrent"
        >
          取消编辑
        </el-button>
      </div>
      <div class="dialog-content-input">
        <el-input v-model="commodityDetail.name" placeholder="请输入商品名称" size="mini">
          <template slot="prepend">
            商品名称
          </template>
        </el-input>

        <el-input v-model="commodityDetail.barCode" placeholder="请输入条码" size="mini">
          <template slot="prepend">
            条码
          </template>
        </el-input>
        <el-input v-model="commodityDetail.origin" placeholder="请输入原产地" size="mini">
          <template slot="prepend">
            原产地
          </template>
        </el-input>
        <el-select
          v-model="commodityDetail.putaway"
          clearable
          size="mini"
          placeholder="请选择上架状态"
        >
          <el-option
            v-for="item in putawayMap"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="goodsLabels"
          multiple
          filterable
          allow-create
          collapse-tags
          default-first-option
          size="mini"
          placeholder="请选择标签"
        >
          <el-option
            v-for="item in labelsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="commodityDetail.remark" placeholder="请输入备注" size="mini">
          <template slot="prepend">
            备注
          </template>
        </el-input>
      </div>
      <div>
        <p>上传图片</p>
        <el-upload
          :show-file-list="false"
          :action="BASE_URL+'/pps/file/upload?type=1'"
          :on-success="uploadImageSuccess"
          class="dentity-uploader"
        >
          <img v-if="commodityDetail.image" :src="BASE_URL+'/pps'+commodityDetail.image" class="dentity-card">
          <i v-else class="el-icon-plus dentity-uploader-icon" />
        </el-upload>
      </div>
      <el-table
        v-if="specificationsFlag"
        ref="singleTable"
        :data="specifucatuibsList"
        class="tb-edit"
        style="width: 100%"
        highlight-current-row
        @row-click="handleCurrentChange"
      >
        <el-table-column
          type="index"
          fixed
          align="center"
          width="55"
        />
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button
              :disabled="scope.row.isEdit"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="积分" width="180" align="center">

          <template scope="scope">
            <el-input
              v-model="scope.row.integral"
              size="small"
              placeholder="请输入内容"
            />
          </template>
        </el-table-column>
        <el-table-column label="进价" width="180" align="center">
          <template scope="scope">
            <NumberInput :no-slot="false" v-model="scope.row.purchasePrice">
            </NumberInput>
          </template>
        </el-table-column>
        <el-table-column label="零售价" width="180" align="center">
          <template scope="scope">
            <NumberInput :no-slot="false" v-model="scope.row.retailPrice">
            </NumberInput>
          </template>
        </el-table-column>
        <el-table-column label="VIP售价" width="180" align="center">
          <template scope="scope">
            <NumberInput :no-slot="false" v-model="scope.row.vipPrice">
            </NumberInput>
          </template>
        </el-table-column>
        <el-table-column label="店长价" width="180" align="center">
          <template scope="scope">
            <NumberInput :no-slot="false" v-model="scope.row.bossPrice">
            </NumberInput>
          </template>
        </el-table-column>
        <el-table-column v-for="item in choiceProperties" :label="item.name" width="180" align="center">
          <template scope="scope">
            <el-select
              v-model="scope.row.sku[item.name]"
              :disabled="scope.row.isEdit"
              :placeholder="'请选择'+item.name"
              size="mini"
            >
              <el-option
                v-for="v in item.goodsPropertyValues"
                :key="v.id"
                :label="v.name"
                :value="v.name"
              />
            </el-select>
          </template>
        </el-table-column>
        <!--<el-table-column prop="sex" label="性别">-->
        <!--<template scope="scope">-->
        <!--<el-select-->
        <!--v-model="scope.row.sex"-->
        <!--clearable-->
        <!--size="mini"-->
        <!--placeholder="选择性别">-->
        <!--<el-option-->
        <!--v-for="item in putawayMap"-->
        <!--:key="item.id"-->
        <!--:label="item.name"-->
        <!--:value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--<span>{{scope.row.sex}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancleHandle">
          取 消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
      :visible.sync="exportDialog"
      title="导出商品"
      width="80%"
    >
      <div style="margin-bottom: 10px" class="search-bar">
        <el-select
          v-model="exportFilter.typeId"
          clearable
          size="mini"
          filterable placeholder="请选择商品分类"
        >
          <el-option
            v-for="item in commodityTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="exportFilter.putaway"
          clearable
          size="mini"
          placeholder="请选择上下架状态"
        >
          <el-option
            label="未上架"
            value="0"
          />
          <el-option
            label="已上架"
            value="1"
          />
        </el-select>
        <el-input v-model="exportFilter.id" placeholder="商品货号" size="mini">
          <template slot="prepend">
            商品货号
          </template>
        </el-input>
        <el-input v-model="exportFilter.barCode" placeholder="商品条码" size="mini">
          <template slot="prepend">
            商品条码
          </template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="exportFilter = {};exportDialog = false">
          取 消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmHandle2">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!--<el-dialog-->
    <!--title="新增商品分类"-->
    <!--:visible.sync="dialogVisible2"-->
    <!--width="400px">-->
    <!--<div class="dialog-content-input dialog-center">-->
    <!--<el-input v-model="commodityType" placeholder="请输入新增商品分类" size="mini">-->
    <!--<template slot="prepend">分类名称</template>-->
    <!--</el-input>-->
    <!--</div>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="cancleHandle2" size="mini">取 消</el-button>-->
    <!--<el-button type="primary" @click="confirmHandle2" size="mini">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->

    <!--<el-dialog-->
    <!--title="删除商品分类"-->
    <!--:visible.sync="dialogVisible3"-->
    <!--width="400px">-->
    <!--<div class="dialog-content-input dialog-center">-->
    <!--<el-select-->
    <!--v-model="selectDelType.typeId"-->
    <!--clearable-->
    <!--size="mini"-->
    <!--filterable placeholder="请选择商品分类">-->
    <!--<el-option-->
    <!--v-for="item in commodityTypeList"-->
    <!--:key="item.id"-->
    <!--:label="item.name"-->
    <!--:value="item.id">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</div>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="cancleHandle3" size="mini">取 消</el-button>-->
    <!--<el-button type="primary" @click="confirmHandle3" size="mini">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
// import {getCommodityData} from '@/service/PurchaseAndSale/DataEditing/CommodityAdd'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import Tree from '@/components/Tree/Tree' // 树状图组件
import TransverseShrinkBox from '@/components/TransverseShrinkBox/TransverseShrinkBox' // 收缩弹性盒子
import {
  getCommodityData,
  postCommodityData,
  getCommodityTypeData,
  getLabels,
  getProperties,
  postGoodsImport,
  putCommodityData
} from '@/service/PurchaseAndSale/DataEditing/CommodityAdd.js'
import common from '@/mixins/common'
import { BASE_URL } from '@/api/config'
import qs from 'qs'

export default {
  name: 'CommodityAdd',
  components: {
    SelectTable,
    Tree,
    TransverseShrinkBox
  },
  mixins: [common],
  data() {
    return {
      BASE_URL,
      unifiedAdd:'',
      exportFilter: {},
      commodityList: {},
      exportDialog: false,
      commodityType: '',
      selectArr: [],
      goodsLabels: [],
      paginationData: {
        page: 1,
        pageSize: 10
      },
      filterData: {
        vagueFilter: '',
        brandFilter: '',
        openStatusFilter: ''
      },
      isEdit: false,
      dialogVisible: false,
      // dialogVisible2:false,
      // dialogVisible3:false,
      commodityTypeList: [],
      selectDelType: [],
      commodityDetail: {
        storeId: '',
        name: '',
        barCode: '',
        typeId: '',
        putaway: '',
        remark: '',
        image: ''
      },
      commondityBrandList: [],
      unitList: [],
      labelsList: [],
      specificationsFlag: false,
      specifucatuibsList: [],
      propertiesList: [],
      choiceProperties: {},
      selectIndex: '',
      isEditStatus: false,
      file: '',
      disabledList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getCommodityDataFun()
    this.getCommodityTypeDataFun()
    this.getLabelsData()
    this.getPropertiesFun()
  },
  methods: {
    addFun() {
      this.isEdit = false
      this.dialogVisible = true
      this.goodsLabels = []
      this.commodityDetail = {}
      this.specificationsFlag = false
      this.specifucatuibsList = []
    },
    unitAdd(){
      this.$prompt('数量', '批量添加数量', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\+?[1-9][0-9]*$/,
        inputErrorMessage: '请输入非零正整数'
      }).then(({ value }) => {
        this.specifucatuibsList.forEach(v=>{

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    printFun() {
      const data = JSON.parse(JSON.stringify(this.commodityList))
      data.title = [{
        'name': '商品名',
        'key': 'name'
      }, {
        'name': '条码',
        'key': 'barCode'
      }, {
        'name': '分类',
        'key': 'typeName'
      }, {
        'name': '产地',
        'key': 'origin'
      }, {
        'name': '标签',
        'key': 'goodsLabels'
      }, {
        'name': '备注',
        'key': 'remark'
      }]
      window.localStorage.setItem('printData', JSON.stringify(data))
      const routeData = this.$router.resolve({
        name: 'PrintPage',
        query: {
          orderName: '商品表'
        }
      })
      window.open(routeData.href, '_blank')
    },
    searchBtn() {
      this.paginationData.page = 1
      this.getCommodityDataFun()
    },
    importData: function(event) {
      event.preventDefault()
      document.querySelector('#uploadEventFile').click()
    },
    confirmHandle2() {
      const params = {
        storeId: this.storeId,
        ...this.exportFilter
      }

      this.downloadFile('goods/export',params)
    },
    fileChange: function(el) {
      el.preventDefault()// 取消默认行为
      const vm = this
      const uploadEventFile = document.querySelector('#uploadEventFile').value
      this.file = el.target.files[0]
      if (uploadEventFile == '') {
        alert('请择excel,再上传')
      } else if (uploadEventFile.lastIndexOf('.xls') > 0 || uploadEventFile.lastIndexOf('.XLS') > 0) {
        const formData = new FormData()
        // 向 formData 对象中添加文件
        formData.append('file', this.file)
        const config = {
          // 一定要定义头
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        // url为对应的后端接口
        vm.$http.post(BASE_URL + '/pps/goods/import?storeId=' + this.storeId, formData, config).then(function(res) {
          if (res.data.code !== 1001) {
            vm.$message({
              showClose: true,
              message: res.data.message + res.data.detail,
              type: 'error'
            })
          } else {
            vm.$message({
              message: '成功添加',
              type: 'success'
            })
            vm.getCommodityDataFun()
          }
        })
      } else {
        alert('只能上传excel文件')
      }
    },
    selectIndexFun(index) {
      this.selectIndex = index
    },
    changeAddType(key) {
      console.log(key)
      this.choiceProperties = this.propertiesList.filter(v => {
        return v.id === key
      })[0].goodsPropertyKeyVos
    },
    selectProperties(key) {
      console.log(key)
      this.specifucatuibsList[index].sku.push({ id: key })
    },
    addSpecifications() {
      this.specificationsFlag = true
      const _skuKey = {}
      this.choiceProperties.forEach(v => {
        Object.assign(_skuKey, { [v.name]: '' })
      })
      this.specifucatuibsList.push({
        'integral': '',
        'purchasePrice': '',
        'retailPrice': '',
        'sku': _skuKey,
        'vipPrice': '',
        'bossPrice': ''
      })
    },
    handleCurrentChange(row, event, column) {
      this.isEditStatus = true
      console.log(row, event, column, event.currentTarget)
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
      this.isEditStatus = false
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      this.specifucatuibsList.splice(index, 1)
    },
    deleteHandle() {
      console.log('delete')
    },
    editRow(index, row) {
      this.isEdit = true
      this.dialogVisible = true
      this.commodityDetail = row
      this.goodsLabels = []
      this.commodityDetail.goodsLabels.forEach(v => {
        this.goodsLabels.push(v.id)
      })
      this.specifucatuibsList = []
      this.specificationsFlag = true
      this.changeAddType(row.typeId)
      this.commodityDetail.goodsSkuVos.forEach(v => {
        console.log(v)
        const _skuKey = {}
        eval(v.sku).forEach(v2 => {
          Object.assign(_skuKey, { [v2.key]: v2.value })
        })
        this.specifucatuibsList.push({
          'integral': v.integral,
          'purchasePrice': v.purchasePrice,
          'retailPrice': v.retailPrice,
          'bossPrice': v.bossPrice,
          'sku': _skuKey,
          'vipPrice': v.vipPrice,
          'isEdit': true,
          'id': v.id
        })
      })
    },
    getPropertiesFun() {
      const params = {
        storeId: this.storeId
      }
      getProperties(params).then(res => {
        this.propertiesList = res.data.data
      })
    },
    getCommodityDataFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getCommodityData(params).then(res => {
        const data = res.data.data
        this.commodityList = data
        this.paginationData = data.pageVo
      })
    },
    getCommodityTypeDataFun() {
      const params = {
        'storeId': this.storeId
      }
      getCommodityTypeData(params).then(res => {
        this.commodityTypeList = res.data.data
      })
    },
    getLabelsData() {
      const params = {
        'storeId': this.storeId
      }
      getLabels(params).then(res => {
        this.labelsList = res.data.data
      })
    },
    changeType(key) {
      this.filterData.typeId = key
      this.getCommodityDataFun()
    },
    cancleHandle() {
      this.dialogVisible = false
    },
    confirmHandle() {
      const data = {
        ...this.commodityDetail
      }
      data.storeId = this.storeId
      const _goodsLabels = []
      this.goodsLabels.forEach(v => {
        _goodsLabels.push({ id: v })
      })
      data.goodsLabels = _goodsLabels
      let _allSku = []
      const _specifucatuibsList = JSON.parse(JSON.stringify(this.specifucatuibsList))
      _specifucatuibsList.forEach(v => {
        const _sku = []
        for (const i in v.sku) {
          _sku.push({ key: i, value: v.sku[i] })
          _allSku.push({ key: i, value: v.sku[i] })
        }
        v.sku = JSON.stringify(_sku)
      })
      var hash = {}
      _allSku = _allSku.reduce(function(item, next) {
        hash[next.key] ? '' : hash[next.key] = true && item.push(next)
        return item
      }, [])
      data.skus = JSON.stringify(_allSku)
      data.goodsSkuVos = _specifucatuibsList
      if (!this.isEdit) {
        postCommodityData(data).then(res => {
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
            message: '添加成功',
            type: 'success'
          })
          this.getCommodityDataFun()
          this.dialogVisible = false
        })
      } else {
        putCommodityData(data).then(res => {
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
            message: '编辑成功',
            type: 'success'
          })
          this.getCommodityDataFun()
          this.dialogVisible = false
        })
      }

      // this.dialogVisible = false
    },
    uploadImageSuccess(res, file, fileList) {
      if (res.code === 1001) {
        this.commodityDetail.image = res.data
      }
    }
    /* cancleHandle2() {
          this.commodityType = ''
          this.dialogVisible2 = false
        },
        confirmHandle2() {
          let params = {
            "storeId": this.storeId,
            "name": this.commodityType
          }
          postCommodityTypeData(params).then(res => {
            if (res.data.code !== 1001) {
              this.$message({
                showClose: true,
                message: '添加商品分类失败',
                type: 'error'
              });
              this.commodityType = ''
              return
            }
            this.$message({
              showClose: true,
              message: '成功添加商品分类',
              type: 'success'
            });
            this.commodityType = ''
            this.getCommodityTypeDataFun()
            this.dialogVisible2 = false
          })
        },*/
    /* cancleHandle3() {
          this.commodityType = ''
          this.dialogVisible3 = false
        },
        confirmHandle3() {
          if (this.commodityTypeList.length === 1) {
            this.$message({
              showClose: true,
              message: '不能删除最后一个商品分类',
              type: 'error'
            });
            return
          }
          let params = {
            storeId: this.storeId
          }
          let path = this.selectDelType
          delCommodityTypeData(params, path).then(res => {
            if (res.data.code !== 1001) {
              this.$message({
                showClose: true,
                message: '删除商品分类失败',
                type: 'error'
              });
            } else {
              this.$message({
                showClose: true,
                message: '成功删除商品分类',
                type: 'success'
              });
              this.dialogVisible3 = false
              this.getCommodityTypeDataFun()
            }
            this.selectDelType = ''
          })

        }*/
  }
}
</script>

<style lang='scss' scoped>
  .attr-box {
    margin: 0;
  }

  /*.tb-edit .el-input {
    display: none
  }

  .tb-edit .el-select {
    display: none
  }

  .tb-edit .current-row .el-input {
    display: block
  }

  .tb-edit .current-row .el-input + span {
    display: none
  }

  .tb-edit .current-row .el-select {
    display: block
  }

  .tb-edit .current-row .el-select + span {
    display: none
  }*/

  .dentity-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      img {
        width: 100px;
        height: 100px;
      }
    }
  }

  .dentity-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .dentity-uploader-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
