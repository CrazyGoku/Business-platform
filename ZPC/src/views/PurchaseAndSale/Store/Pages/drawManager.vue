<template>
  <div>
    <div class="search-bar">
      <NumberInput v-model="costIntegral" placeholder="请输入抽奖消耗积分" size="mini">
        <template slot="prepend">
          抽奖消耗积分
        </template>
      </NumberInput>
    </div>

    <el-row :gutter="20">
      <el-col v-for="(item,index) in itemList" :key="index" class="el-con" style="margin-bottom: 20px;" :span="8">
        <div
          @click="beforeUploadFun(index)"
        >
          <el-input v-model="item.name" placeholder="请输入奖品名称" size="mini">
            <template slot="prepend">
              奖品名称
            </template>
          </el-input>
          <NumberInput v-model="item.probability" max="1" step="0.1">
            <template slot="prepend">
              抽奖概率
            </template>
          </NumberInput>
          <div style="margin-bottom: 10px;">
            <el-switch
              v-model="item.isPrize"
              active-text="中奖"
              inactive-text="未中奖"
              @change="changeSwitch"
            />
          </div>
          <el-upload
            :show-file-list="false"
            :action="BASE_URL+'/main_store/file/upload?type=1'"
            :headers="{
              token:getToken()
            }"
            :on-success="uploadImageSuccess"
            class="dentity-uploader"
          >
            <img v-if="item.image" :src="item.image" class="dentity-card">
            <i v-else class="el-icon-plus dentity-uploader-icon" />
          </el-upload>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-button @click="submit">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import common from '@/mixins/common'
import { putSystem, getSystem } from '@/service/common.js'
import { BASE_URL } from '@/api/config'

export default {
  name: 'DrawManager',
  mixins: [common],
  data() {
    return {
      BASE_URL,
      banners: [],
      costIntegral: 0,
      itemList: new Array(8).fill({
        name: '',
        image: '',
        probability: 0,
        isPrize: 0
      }),
      datas: {},
      checkIndex: 0
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getSystem().then(res => {
        if (res.data.data.integralDraw) {
          const data = JSON.parse(res.data.data.integralDraw)
          this.itemList = data.itemList
          this.costIntegral = data.costIntegral
          const item = {
            name: '',
            image: '',
            probability: 0,
            isPrize: 0
          }
          if (this.itemList.length < 8) {
            this.itemList.fill(item, this.itemList.length, 8)
          }
        }
        this.datas = res.data.data
      })
    },
    beforeUploadFun(index) {
      console.log(index)
      this.checkIndex = index
    },
    deleteImg(item) {
      this.banners = this.banners.filter(v => {
        return v !== item
      })
      const data = this.datas
      data.banner = this.banners.join(',')
      putSystem(data).then(res => {

      })
    },
    uploadImageSuccess(res, file, fileList) {
      if (res.code === 1001) {
        this.itemList[this.checkIndex].image = BASE_URL + '/main_store' + res.data
      }
    },
    submit() {
      const data = this.datas
      data.integralDraw = JSON.stringify({
        costIntegral: this.costIntegral,
        itemList: this.itemList
      })
      putSystem(data).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: '修改失败，请重试',
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .dentity-uploader {
    height: 100px;
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

  /deep/ .el-con {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 100%;
    }
  }
</style>
