<template>
  <div class="CommodityAuxiliary">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品分类</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addType">
          添加分类
        </el-button>
      </div>
      <div
        v-for="item in types"
        :key="item.id"
        :class="chioceType===item.id?'active':''"
        class="text item"
        @click="getPropertiesKeyFun(item.id)"
      >
        <span class="name">
          {{ item.name }}
        </span>
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="putCommodityTypesFun(item)"
          />
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="delCommodityTypesFun(item.id)"
          />
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品属性名</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="postPropertiesKeyFun">
          添加属性名
        </el-button>
      </div>
      <div
        v-for="item in propertiesKeys"
        :key="item.id"
        :class="chiocePropertiesKey===item.id?'active':''"
        class="text item"
        @click="getPropertiesValueFun(item.id)"
      >
        <span class="name">
          {{ item.name }}
        </span>
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="putPropertiesKeyFun(item)"
          />
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="delPropertiesKeyFun(item.id)"
          />
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品属性值</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="postPropertiesValueFun">
          添加属性值
        </el-button>
      </div>
      <div
        v-for="item in propertiesValues"
        :key="item.id"
        class="text item"
      >
        <span class="name">
          {{ item.name }}
        </span>
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="putPropertiesValueFun(item)"
          />
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="delPropertiesValueFun(item.id)"
          />
        </div>
      </div>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      :title="isEdit?'编辑分类':'添加分类'"
      :visible.sync="addTypeDialog"
      width="50%"
    >
      <el-input v-model="typeDetail.name" placeholder="请输入商品名称" size="mini">
        <template slot="prepend">
          商品名称
        </template>
      </el-input>

      <div>
        <p>上传图片</p>
        <el-upload
          :show-file-list="false"
          :action="BASE_URL+'/main_store/file/upload?type=1'"
          :headers="{
            token:getToken()
          }"
          :on-success="uploadImageSuccess"
          class="dentity-uploader"
        >
          <img v-if="typeDetail.image" :src="BASE_URL+'/main_store'+typeDetail.image" class="dentity-card">
          <i v-else class="el-icon-plus dentity-uploader-icon" />
        </el-upload>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addTypeDialog = false">
          取 消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCommodityTypes,
  postCommodityTypes,
  delCommodityTypes,
  putCommodityTypes,
  getPropertiesKey,
  postPropertiesKey,
  getPropertiesAll,
  putPropertiesKey,
  putPropertiesValue,
  postPropertiesValue,
  delPropertiesKey,
  delPropertiesValue
} from '@/service/PurchaseAndSale/DataEditing/CommodityAuxiliary.js'
import common from '@/mixins/common'
import { BASE_URL } from '@/api/config'

export default {
  name: 'CommodityAuxiliary',
  mixins: [common],
  data() {
    return {
      types: [],
      propertiesKeys: [],
      propertiesValues: [],
      propertiesAll: {
        'goodsPropertyKeyVos': [
          {
            'goodsPropertyValues': [
              {
                'id': 0,
                'name': 'string',
                'propertyKeyId': 0
              }
            ],
            'id': 0,
            'name': 'string',
            'storeId': 0,
            'typeId': 0,
            'typeName': 'string'
          }
        ],
        'id': 0,
        'name': 'string',
        'storeId': 0
      },
      chioceType: -1,
      chiocePropertiesKey: 0,
      midType: 0,
      midPropertiesKey: 0,
      addTypeDialog: false,
      isEdit: false,
      typeDetail: {},
      BASE_URL
    }
  },
  computed: {},
  watch: {
    propertiesAll: {
      immediate: false,
      deep: true,
      handler(newVal, oldVal) {
        if (this.chioceType !== -1) {
          this.propertiesKeys = newVal.filter(v => {
            return v.id === this.chioceType
          })[0].goodsPropertyKeyVos

          this.propertiesValues = this.propertiesKeys.filter(v => {
            return v.id === this.midPropertiesKey
          })[0].goodsPropertyValues
          this.chiocePropertiesKey = this.midPropertiesKey
        }
      }
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {

    uploadImageSuccess(res, file, fileList) {
      if (res.code === 1001) {
        this.typeDetail.image = res.data
      }
    },
    async initPage() {
      await this.getPropertiesAllFun()
      await this.getCommodityTypesData()
    },
    getPropertiesAllFun() {
      console.log(1)
      const params = {
        storeId: this.storeId
      }
      getPropertiesAll(params).then(res => {
        this.propertiesAll = res.data.data
        this.propertiesKeys = this.propertiesAll[0] && this.propertiesAll[0].goodsPropertyKeyVos
        this.chiocePropertiesKey = this.propertiesKeys && this.propertiesKeys[0].id
        this.propertiesValues = this.propertiesKeys[0] && this.propertiesKeys[0].goodsPropertyValues
      })
    },
    getCommodityTypesData() {
      console.log(2)
      const params = {
        storeId: this.storeId
      }
      getCommodityTypes(params).then(res => {
        this.types = res.data.data
        this.chioceType = this.types[0].id
      })
    },
    confirmHandle() {
      const params = {
        storeId: this.storeId,
        ...this.typeDetail
      }
      console.log(this.typeDetail)
      const func = this.isEdit ? putCommodityTypes : postCommodityTypes
      const msg = this.isEdit ? '修改分类成功' : '添加分类成功'
      func(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message.error('服务器返回错误')
          return
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.getCommodityTypesData()
      })
      this.addTypeDialog = false
    },
    addType() {
      this.addTypeDialog = true
      this.isEdit = false
      this.typeDetail = {
        name: '',
        image: ''
      }
    },
    delCommodityTypesFun(typeId) {
      const params = {
        storeId: this.storeId,
        ids: typeId
      }
      delCommodityTypes(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message.error(res.data.message)
          return
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getCommodityTypesData()
      })
    },
    putCommodityTypesFun(item) {
      this.isEdit = true
      this.addTypeDialog = true
      this.typeDetail = item
    },
    // 获取商品属性名
    getPropertiesKeyFun(typeId) {
      console.log(typeId)
      this.chioceType = typeId
      this.propertiesKeys = []
      this.propertiesValues = []
      this.propertiesKeys = this.propertiesAll.filter(v => {
        return v.id === this.chioceType
      })[0].goodsPropertyKeyVos
      this.propertiesValues = this.propertiesKeys[0].goodsPropertyValues
      this.chiocePropertiesKey = this.propertiesKeys[0].id
      this.midPropertiesKey = this.chiocePropertiesKey
    },
    // 获取商品属性值
    getPropertiesValueFun(keyId) {
      this.chiocePropertiesKey = keyId
      this.midPropertiesKey = this.chiocePropertiesKey
      this.propertiesValues = []
      this.propertiesValues = this.propertiesKeys.filter(v => {
        return v.id === this.chiocePropertiesKey
      })[0].goodsPropertyValues
    },
    postPropertiesKeyFun() {
      this.$prompt('请输入商品属性名', '添加商品属性名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const params = {
          storeId: this.storeId,
          name: value,
          typeId: this.chioceType
        }
        postPropertiesKey(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message.error('添加出错')
            return
          }
          this.$message({
            type: 'success',
            message: '添加属性名成功'
          })
          this.getPropertiesAllFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    postPropertiesValueFun() {
      this.$prompt('请输入商品属性值', '添加商品属性值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const params = {
          storeId: this.storeId,
          name: value,
          propertyKeyId: this.chiocePropertiesKey
        }
        postPropertiesValue(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message.error('添加出错')
            return
          }
          this.$message({
            type: 'success',
            message: '添加属性值成功'
          })
          this.getPropertiesAllFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    putPropertiesKeyFun(item) {
      this.$prompt('请输入商品属性名', '修改商品属性名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: item.name
      }).then(({ value }) => {
        const params = {
          storeId: this.storeId,
          name: value.join(','),
          id: item.id,
          typeId: this.chioceType
        }
        putPropertiesKey(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message.error('修改出错')
            return
          }
          this.$message({
            type: 'success',
            message: '修改属性名成功'
          })
          this.getPropertiesAllFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    putPropertiesValueFun(item) {
      this.$prompt('请输入商品属性值', '修改商品属性值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: item.name
      }).then(({ value }) => {
        const params = {
          storeId: this.storeId,
          name: value,
          id: item.id,
          propertyKeyId: this.chiocePropertiesKey
        }
        putPropertiesValue(params).then(res => {
          if (res.data.code !== 1001) {
            this.$message.error('修改出错')
            return
          }
          this.$message({
            type: 'success',
            message: '修改属性值成功'
          })
          this.getPropertiesAllFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    delPropertiesKeyFun(id) {
      const params = {
        storeId: this.storeId,
        ids: id
      }
      delPropertiesKey(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message.error(res.data.message)
          return
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.midPropertiesKey = this.propertiesKeys.filter(item => {
          return item.id !== id
        })[0] && this.propertiesKeys.filter(item => {
          return item.id !== id
        })[0].id
        this.getPropertiesAllFun()
      })
    },
    delPropertiesValueFun(id) {
      const params = {
        storeId: this.storeId,
        ids: id
      }
      delPropertiesValue(params).then(res => {
        if (res.data.code !== 1001) {
          this.$message.error(res.data.message)
          return
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getPropertiesAllFun()
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .CommodityAuxiliary {
    display: flex;

    .box-card {
      width: 33%;
      margin-right: 1%;
      height: 400px;
      overflow-y: auto;
    }

    .text {
      font-size: 14px;
    }

    .item {
      padding: 10px 10px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        cursor: pointer;
      }

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #fefbe0;
        border-radius: 10px;
      }
    }

    .active {
      background: #dbefec;
      border-radius: 10px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }
  }

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
