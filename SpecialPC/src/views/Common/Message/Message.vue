<template>
  <div style="padding: 20px">
    <div class="handle-bar">
      <el-button
        type="primary"
        size="mini"
        @click="addFun"
      >
        新增
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="checkHistory"
      >
        查看历史
      </el-button>
    </div>
    <div class="flex-center">
      <select-table
        :data="msgTmpList"
        :pagination-data="paginationData"
        @paginationChange="getSmsTemplateFun"
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
            @click.native.prevent="deleteRow(scope.$index,scope.row)"
            >
            删除
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="edit(scope.$index,scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false" width="80%" title="查看短信历史" :visible.sync="dialogVisible1">
      <div class="search-bar">
        <el-input v-model="filterData.clientId" placeholder="请输入客户编号" size="mini">
          <template slot="prepend">
            客户编号
          </template>
        </el-input>
        <el-input v-model="filterData.clientName" placeholder="请输入客户名称" size="mini">
          <template slot="prepend">
            客户名称
          </template>
        </el-input>
        <el-input v-model="filterData.clientPhone" placeholder="请输入客户手机号" size="mini">
          <template slot="prepend">
            客户手机号
          </template>
        </el-input>
        <div style="width: 20px;">
          <el-button type="primary" size="mini" @click="searchBtn">
            查询
          </el-button>
        </div>
          <select-table
            :data="historyList"
            :pagination-data="paginationData"
            @paginationChange="getSmsHistoryFun"
          >
          </select-table>

      </div>

    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="isEdit?'编辑':'添加'" width="80%" :visible.sync="dialogVisible2">
      <div class="search-bar">
        <el-input v-model="msgDetail.title" placeholder="请输入标题" size="mini">
          <template slot="prepend">
            标题
          </template>
        </el-input>
        <el-input v-model="msgDetail.content" placeholder="请输入内容" size="mini">
          <template slot="prepend">
            内容({}括号内发送时自动替换为客户名)
          </template>
        </el-input>
        <el-select
          v-model="msgDetail.typeName"
          size="mini"
          placeholder="请选择短信类型"
          @change="msgDetail.type = msgDetail.typeName "
        >
          <el-option
            label="通知类短信"
            value="1"
          />
          <el-option
            label="营销类短信"
            value="2"
          />
        </el-select>
      </div>
      <div style="margin-top: 10px;">
        <el-button style="float: right" size="mini" type="primary" @click="confirm">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import common from '@/mixins/common'
  import {getSmsTemplate,getSmsHistory,postSmsHistory,delSmsTemplate,postSmsTemplate,putSmsTemplate} from '@/service/PurchaseAndSale/Marketing/Message.js'
  import clientsList from '@/mixins/clientsList.js'
  import { getClients } from '@/service/PurchaseAndSale/common.js'

  export default {
    name: "Message",
    mixins: [common,clientsList],
    components: {SelectTable},
    data() {
      return {
        dialogVisible1:false,
        dialogVisible2:false,
        filterData:{},
        msgTmpList: [],
        paginationData2:{
          page:1,
          pageSize:10
        },
        data: [],
        postContent:'',
        historyList:[],
        postClients:[],
        isEdit:false,
        msgDetail:{},
      }
    },
    mounted() {
      this.getSmsTemplateFun()
    },
    methods: {
      addFun(){
        this.isEdit = false
        this.msgDetail = {}
        this.dialogVisible2 = true
      },
      edit(index,row){
        this.isEdit = true
        this.msgDetail = row
        this.dialogVisible2 = true
      },
      confirm(){
        const func = this.isEdit ? putSmsTemplate : postSmsTemplate
        const magSuccess = this.isEdit ? '成功编辑' : '添加成功'
        let data = {
          title:this.msgDetail.title,
          content:this.msgDetail.content,
          type:this.msgDetail.type
        }
        if(this.isEdit){
          data.id = this.msgDetail.id
        }
        func(data,this.userId).then(res=>{
          if(res.data.code!==1001){
            this.$message({
              showClose: true,
              message: res.data.detail,
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: magSuccess,
            type: 'success'
          })
          this.getSmsTemplateFun()
          this.dialogVisible2 = false
        })
      },
      deleteRow(index,row){
        let params = {
          ids: row.id
        }
        this.$confirm('此操作将删除改模版, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSmsTemplate(params,this.userId).then(res=>{
            if(res.data.code!==1001){
              this.$message({
                showClose: true,
                message: res.data.detail,
                type: 'error'
              })
              return
            }
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.getSmsTemplateFun()

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      postConfirm(){
        let storeId = this.storeId
        let userId = this.userId
        let postData= []
        this.postClients.forEach(v=>{
          let clientInfo = this.data.filter(v2=>{
            return v2.key === v
          })[0]
          let data = this.postContent.replace(/\{.*?\}/g,clientInfo.label)
          postData.push({
            storeId,
            userId,
            clientId:v,
            content:data
          })
        })
        postSmsHistory(postData).then(res=>{
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: res.data.detail,
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '发送成功',
            type: 'success'
          })
          this.dialogVisible2 = false
        })
      },
      getClientsFun() {
        const params = {
          storeId: this.storeId,
          disabled:0
        }
        getClients(params).then(res => {
          this.clientsList = res.data.data
          this.clientsList.forEach(v=>{
            this.data.push({
              key:v.id,
              label:v.name
            })
          })
        })
      },
      searchBtn() {
        this.paginationData2.page = 1
        this.getSmsHistoryFun()
      },
      postMsg(index,row) {
        if(row){
          this.postContent = row.content
        }
        this.dialogVisible2 = true
      },
      checkHistory(){
        this.getSmsHistoryFun()
        this.dialogVisible1 = true
      },
      getSmsHistoryFun(){
        let params = {
          storeId:this.storeId,
          page: this.paginationData2.page,
          pageSize: this.paginationData2.pageSize,
          ...this.filterData
        }
        getSmsHistory(params).then(res=>{
          const data = res.data.data
          this.historyList = data
          this.paginationData2 = data.pageVo
        })
      },
      getSmsTemplateFun() {
        let params = {
          page: this.paginationData.page,
          pageSize: this.paginationData.pageSize
        }
        getSmsTemplate(params).then(res => {
          const data = res.data.data
          this.msgTmpList = data
          this.paginationData = data.pageVo
        })
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang='scss' scoped>
  /deep/ .el-transfer{
    width:100%;
    .el-transfer-panel{
      width: 40%;
    }
  }
</style>
