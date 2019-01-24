<template>
  <div>
    <div class="handle-bar">
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
            <!--<el-button-->
            <!--type="text"-->
            <!--size="small"-->
            <!--@click.native.prevent="deleteRow(scope.$index,scope.row,false)"-->
            <!--&gt;-->
            <!--删除-->
            <!--</el-button>-->
            <el-button
              type="text"
              size="small"
              @click.native.prevent="postMsg(scope.$index,scope.row)"
            >
              发送
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
    <el-dialog :close-on-click-modal="false" title="发送短信" width="80%" :visible.sync="dialogVisible2">
      <p style="margin-bottom: 10px;">提示：{}内替换为联系人名称</p>
      <el-input
        type="textarea"
        style="margin-bottom: 10px;"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入短信内容"
        v-model="postContent">
      </el-input>

      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="postClients"
        filterable
        :titles="['待发送客户', '发送客户']"
        :button-texts="['到左边', '到右边']"
        :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
        :data="data">
        <span slot-scope="{ option }"> {{ option.label }} - {{ option.key }} </span>
      </el-transfer>
      <div style="margin-top: 10px;">
        <el-button style="float: right" size="mini" type="primary" @click="postConfirm">
          发送
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
  import common from '@/mixins/common'
  import {getSmsTemplate,getSmsHistory,postSmsHistory} from '@/service/PurchaseAndSale/Marketing/Message.js'
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
        postClients:[]
      }
    },
    mounted() {
      this.getSmsTemplateFun()
    },
    methods: {
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
