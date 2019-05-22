<template>
  <div>
    <div class="handle-bar">
      <el-tag type="success">
        当前邮费：{{ postage }}
      </el-tag><el-button size="mini" @click="setPostMoney">
        设置邮费
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-col v-for="(item,index) in banners" :key="index" class="el-con" :span="6">
        <img :src="item" alt="">
        <el-button size="mini" @click="deleteImg(item)">
          删除
        </el-button>
      </el-col>
    </el-row>
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
        <i class="el-icon-plus dentity-uploader-icon" />
      </el-upload>
    </div>
  </div>
</template>

<script>
import common from '@/mixins/common'
import { putSystem, getSystem } from '@/service/common.js'
import { BASE_URL } from '@/api/config'
export default {
  name: 'RegionManager',
  mixins: [common],
  data() {
    return {
      BASE_URL,
      banners: [],
      datas: {},
      postage: 0
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSystemData()
  },
  methods: {
    getSystemData() {
      getSystem().then(res => {
        this.banners = res.data.data.banner ? res.data.data.banner.split(',') : []
        this.postage = res.data.data.postage
        this.datas = res.data.data
      })
    },
    setPostMoney() {
      this.$prompt('请输入邮费', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d/,
        inputErrorMessage: '请输入数字'
      }).then(({ value }) => {
        const data = this.datas
        data.postage = value
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
          this.getSystemData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
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
        const data = this.datas
        data.banner = this.banners.push(this.BASE_URL + '/main_store' + res.data)
        data.banner = this.banners.join(',')
        putSystem(data).then(res => {

        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
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

  /deep/ .el-con{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img{
      width: 100%;
      margin-bottom: 10px;
    }
  }
</style>
