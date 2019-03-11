<template>
    <div>
      <div class="search-bar">
        <el-select
          v-model="filterData.status"
          clearable
          size="mini"
          filterable placeholder="请选择状态"
        >
          <el-option
            label="待审核"
            value="0"
          />
          <el-option
            label="审核通过"
            value="1"
          />
          <el-option
            label="审核未通过"
            value="2"
          />
        </el-select>
        <div style="width: 20px;">
          <el-button type="primary" size="mini" @click="searchBtn">
            查询
          </el-button>
        </div>
      </div>
      <div class="flex-center">
        <select-table
          :data="orderList"
          :pagination-data="paginationData"
          @paginationChange="getClientsStoresDetailFun"
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
                :disabled="scope.row.status===1||scope.row.status===2"
                @click.native.prevent="oneHandle(scope.$index,scope.row,false)"
              >
                审核
              </el-button>
              <!--<el-button
                type="text"
                size="small"
                @click.native.prevent="oneHandle(scope.$index,scope.row,false)"
              >
                审核
              </el-button>-->
            </template>
          </el-table-column>
        </select-table>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        title="审核订单"
        width="80%"
      >
        <div class="search-bar">
          <el-select
            v-model="addDetail.status"
            clearable
            size="mini"
            filterable placeholder="请选择状态"
          >
            <el-option
              label="审核通过"
              value="1"
            />
            <el-option
              label="审核不通过"
              value="2"
            />
          </el-select>

          <el-select
            v-model="addDetail.bankAccountId"
            v-if="addDetail.status==1"
            size="mini"
            filterable
            placeholder="请选择账户"
          >
            <el-option
              v-for="item in bankAccountList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        <el-input v-model="addDetail.remark" placeholder="请输入备注" size="mini">
          <template slot="prepend">
            备注
          </template>
        </el-input>
        </div>

        <div>
          <el-button  style="float: right" size="mini" type="primary" @click="confirm">
            确认
          </el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import common from '@/mixins/common'
    import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
    import {putClientsWithdrawAudit,getClientsStoresDetail} from '@/service/PurchaseAndSale/Fund/WithdrawalOrder.js'
    import bankAccountList from '@/mixins/bankAccountList.js'
    export default {
        name: "WithdrawalOrder",
        mixins: [common,bankAccountList],
      components: {SelectTable},
      data() {
            return {

              filterData: {
              },
              orderList:[],
              dialogVisible:false,
              addDetail:{},
              chioceRow:{}
            }
        },
        mounted() {
          this.getClientsStoresDetailFun()
        },
        methods: {
          oneHandle(index,row){
            this.chioceRow = row
            this.dialogVisible = true
          },
          searchBtn() {
            this.paginationData.page = 1
            this.getClientsStoresDetailFun()
          },
          getClientsStoresDetailFun(){
            let params = {
              storeId: this.storeId,
              page: this.paginationData.page,
              pageSize: this.paginationData.pageSize,
              type:4,
              ...this.filterData,
            }
            getClientsStoresDetail(params).then(res=>{
              let data = res.data.data
              this.orderList = data
              this.paginationData = data.pageVo
            })
          },
          confirm(){

            if(!this.addDetail.status){
              this.$message('请选择审核状态～')
              return
            }
            if(this.addDetail.status=='1'&&!this.addDetail.bankAccountId){
              this.$message('请选择账户～')
              return
            }
            if(this.addDetail.status=='2'&&!this.addDetail.remark){
              this.$message('审核不通过需要填写不通过原因～')
              return
            }
            console.log(this.addDetail)
            let data = {
              id:this.chioceRow.id,
              userId:this.userId,
              ...this.addDetail
            }
            putClientsWithdrawAudit(data).then(res=>{
              if (res.data.code !== 1001) {
                this.$message({
                  showClose: true,
                  message: res.data.message + res.data.detail,
                  type: 'error'
                })
                return
              }
              this.$message({
                showClose: true,
                message: '审核成功',
                type: 'success'
              })
              this.getClientsStoresDetailFun()
              this.dialogVisible = false
            })
          }
        },
        computed: {},
        watch: {}
    }
</script>

<style lang='scss' scoped>

</style>
