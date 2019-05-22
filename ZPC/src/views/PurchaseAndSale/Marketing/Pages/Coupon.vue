<template>
  <div>
    <div class="handle-bar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addBtn"
      >
        添加
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="searchDialog = true;searchClient = ''"
      >
        查询客户优惠券
      </el-button>
    </div>
    <div class="search-bar">
      <el-input v-model="filterData.name" placeholder="优惠券名" size="mini">
        <template slot="prepend">
          优惠券名
        </template>
      </el-input>
      <el-select
        v-model="filterData.type"
        clearable
        size="mini"
        placeholder="请选择优惠券类型"
      >
        <el-option
          label="现金券"
          value="1"
        />
        <el-option
          label="现金券"
          value="2"
        />
        <el-option
          label="满减券"
          value="3"
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
        :data="discountCouponList"
        :pagination-data="paginationData"
        @paginationChange="getDiscountCouponFun"
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
              @click.native.prevent="editRow(scope.$index,scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="distoryRow(scope.$index,scope.row)"
            >
              作废
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="!!!(scope.row.quantity - scope.row.givenQuantity)||scope.row.status==0"
              @click.native.prevent="sendBtn(scope.$index,scope.row)"
            >
              发放
            </el-button>
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :close-on-click-modal="false" width="80%" :title="isEdit?'编辑优惠券':'添加优惠券'" :visible.sync="addDialog">
      <div class="dialog-content-input">
        <el-input v-model="addCoupon.name" placeholder="请输入优惠券名称" size="mini">
          <template slot="prepend">
            优惠券名称
          </template>
        </el-input>
        <el-select v-model="addCoupon.type" size="mini" placeholder="请选择优惠券类型">
          <el-option
            v-for="item in couponType"
            :key="item.value"
            :label="item.label"
            :value="Number(item.value)"
          />
        </el-select>

        <el-select v-model="addCoupon.useOffline" size="mini" placeholder="请选择是否线上使用">
          <el-option
            label="是"
            :value="1"
          />
          <el-option
            label="否"
            :value="0"
          />
        </el-select>
        <el-select v-model="addCoupon.useOnline" size="mini" placeholder="请选择是否线下使用">
          <el-option
            label="是"
            :value="1"
          />
          <el-option
            label="否"
            :value="0"
          />
        </el-select>
        <NumberInput
          v-model="addCoupon.money"
          :disabled="!addCoupon.type"
          :max="addCoupon.type==2?1:1000000000000"
        >
          <template slot="prepend">
            {{ addCoupon.type==1?'请输入优惠金额':addCoupon.type==2?'请输入打折率':addCoupon.type==3?'请输入购满金额':'请选择优惠券类型' }}
          </template>
        </NumberInput>

        <NumberInput
          v-if="addCoupon.type==3"
          v-model="addCoupon.discountMoney"
        >
          <template slot="prepend">
            优惠折扣
          </template>
        </NumberInput>
        <el-input v-model="addCoupon.quantity" placeholder="请输入数量" size="mini">
          <template slot="prepend">
            数量
          </template>
        </el-input>
        <el-date-picker
          v-model="addCoupon.time"
          style="width: 330px"
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancleHandle">
          取 消
        </el-button>
        <el-button size="mini" type="primary" @click="confirmHandle">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="80%" title="发放优惠券" :visible.sync="sendDialog">
      <p>剩余未发：{{ sendRow.quantity - sendRow.givenQuantity }}</p>
      <div class="dialog-content-input">
        <NumberInput
          v-model="allsendData"
        >
          <template slot="prepend">
            批量设置
          </template>
        </NumberInput>
      </div>
      <div class="dialog-content-input">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
          全选
        </el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="checkedLevels" @change="handleCheckedLevelsChange">
          <el-checkbox v-for="(level,index) in levels" :key="level.id" :label="level.id">
            {{ level.name }}
          </el-checkbox>
        </el-checkbox-group>
        <el-select
          v-model="clientIdS"
          clearable
          multiple
          :disabled="totalSend>=(sendRow.quantity - sendRow.givenQuantity)"
          collapse-tags
          size="mini"
          filterable
          placeholder="请选择客户"
        >
          <el-option
            v-for="item in clientsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="dialog-content-input">
        <NumberInput v-for="(item,index) in sendDetail" :key="index" v-model="item.quantity" @input="totalChange">
          <template slot="prepend">
            {{ item.name }}
          </template>
        </NumberInput>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancleHandle2">
          取 消
        </el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="totalSend>=(sendRow.quantity - sendRow.givenQuantity)"
          @click="confirmHandle2"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="80%" title="查询客户优惠券" :visible.sync="searchDialog">
      <div class="search-bar">
        <el-select
          v-model="searchClient"
          clearable
          collapse-tags
          size="mini"
          filterable
          placeholder="请选择客户"
          @change="search"
        >
          <el-option
            v-for="item in clientsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <select-table
        :data="clientCouponList"
        :pagination-data="paginationData2"
        @paginationChange="search"
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          @click="searchDialog = false"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/mixins/common'
import {
  getDiscountCoupon,
  postDiscountCoupon,
  invalidDiscountCoupon,
  putDiscountCoupon,
  giveDiscountCoupon,
  getDiscountCouponByClient
} from '@/service/PurchaseAndSale/Marketing/Coupon.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { parseTime } from '@/utils'
import clientsList from '@/mixins/clientsList.js'
import { getClientsLevels } from '@/service/PurchaseAndSale/DataEditing/ClientsLevels.js'
export default {
  name: 'Coupon',
  components: { SelectTable },
  mixins: [common, clientsList],
  data() {
    return {
      radio: 0,
      filterData: {},
      allsendData: 0,
      discountCouponList: [],
      sendDetail: [{ quantity: 0 }],
      clientIdS: [],
      addDialog: false,
      sendDialog: false,
      addCoupon: {
        name: '',
        type: '',
        money: '',
        quantity: '',
        time: '',
        discountMoney: ''
      },
      clientCouponList: [],
      couponType: [
        {
          label: '现金券',
          value: '1'
        },
        {
          label: '折扣券',
          value: '2'
        },
        {
          label: '满减券',
          value: '3'
        }
      ],
      isEdit: false,
      sendRow: {},
      totalSend: 0,
      searchClient: '',
      searchDialog: false,
      paginationData2: {
        page: 1,
        pageSize: 10
      },
      checkAll: false,
      checkedLevels: [],
      levels: [],
      isIndeterminate: true
    }
  },
  computed: {
  },
  watch: {
    clientIdS(newValue, oldValue) {
      this.sendDetail = []
      newValue.forEach(v1 => {
        this.clientsList.forEach(v2 => {
          if (v2.id === v1) {
            v2.quantity = 1
            this.sendDetail.push(v2)
          }
        })
      })
    },
    allsendData() {
      this.sendDetail.map(v => {
        v.quantity = this.allsendData
      })
    }
  },
  mounted() {
    this.getDiscountCouponFun()
  },
  methods: {
    handleCheckAllChange(val) {
      const levels = []
      this.levels.forEach(v => {
        levels.push(v.id)
      })
      this.checkedLevels = val ? levels : []
      this.clientIdS = []
      this.checkedLevels.forEach(v => {
        this.clientsList.filter(v2 => {
          if (v2.levelId === v) {
            this.clientIdS.push(v2.id)
          }
        })
      })
      this.isIndeterminate = false
    },
    handleCheckedLevelsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.levels.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.levels.length
      this.clientIdS = []
      this.checkedLevels.forEach(v => {
        this.clientsList.filter(v2 => {
          if (v2.levelId === v) {
            this.clientIdS.push(v2.id)
          }
        })
      })
      this.$nextTick(_ => {
        this.totalChange()
      })
    },
    search() {
      const params = {
        storeId: this.storeId,
        clientId: this.searchClient,
        page: this.paginationData2.page,
        pageSize: this.paginationData2.pageSize
      }
      getDiscountCouponByClient(params).then(res => {
        this.clientCouponList = res.data.data
        this.paginationData2 = res.data.data.pageVo
      })
    },
    totalChange() {
      this.totalSend = 0
      this.sendDetail.forEach(v => {
        this.totalSend += v.quantity
      })
      if (this.totalSend >= (this.sendRow.quantity - this.sendRow.givenQuantity)) {
        this.$message('发送总数大于剩余未发')
      }
    },
    sendBtn(index, row) {
      this.totalSend = 0
      this.clientIdS = []
      this.sendRow = row
      this.sendDialog = true
    },
    cancleHandle2() {
      this.sendDialog = false
      this.checkedLevels = []
      this.checkAll = false
      this.isIndeterminate = true
    },
    confirmHandle2() {
      this.$message('优惠券发放中')
      let sendNum = 0
      const failSend = []
      this.sendDetail.forEach(v => {
        const data = {
          storeId: this.storeId,
          clientId: v.id,
          discountCouponId: this.sendRow.id,
          quantity: v.quantity
        }
        giveDiscountCoupon(data).then(res => {
          sendNum += 1
          if (res.data.code !== 1001) {
            failSend.push(v.name)
            this.$message({
              showClose: true,
              message: v.name + '发送失败',
              type: 'error'
            })
            return
          }
          if (sendNum === this.sendDetail.length) {
            let failMsg = ''
            if (failSend.length > 0) {
              failMsg = ',' + failSend.join(',') + '发放失败'
            }
            this.$message({
              duration: 0,
              showClose: true,
              message: '优惠券发放完成' + failMsg,
              type: 'success'
            })
            this.sendDialog = false
            this.getDiscountCouponFun()
          }
        })
      })
    },
    searchBtn() {
      this.paginationData.page = 1
      this.getDiscountCouponFun()
    },
    addBtn() {
      this.isEdit = false
      this.addCoupon = {
        name: '',
        type: '',
        money: '',
        quantity: '',
        time: '',
        discountMoney: '',
        startTime: '',
        endTime: ''
      }
      this.addDialog = true
    },
    getDiscountCouponFun() {
      const params = {
        storeId: this.storeId,
        page: this.paginationData.page,
        pageSize: this.paginationData.pageSize,
        ...this.filterData
      }
      getDiscountCoupon(params).then(res => {
        const data = res.data.data
        this.discountCouponList = data
        this.paginationData = data.pageVo
      })
      const params2 = {
        page: 1,
        pageSize: 10000
      }
      getClientsLevels(params2).then(res => {
        this.levels = res.data.data.items
      })
    },
    editRow(index, row) {
      this.isEdit = true
      this.addCoupon = {
        time: [row.startTime, row.endTime],
        ...row
      }
      this.addDialog = true
    },
    distoryRow(index, row) {
      const data = {
        storeId: this.storeId,
        id: row.id
      }
      this.$confirm('此操作将永久作废该优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        invalidDiscountCoupon(data).then(res => {
          if (res.data.code !== 1001) {
            this.$message({
              showClose: true,
              message: '作废失败',
              type: 'error'
            })
            return
          }
          this.$message({
            showClose: true,
            message: '作废成功',
            type: 'success'
          })
          this.getDiscountCouponFun()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    cancleHandle() {
      this.addDialog = false
      this.addCoupon = {
        name: '',
        type: '',
        money: '',
        quantity: '',
        time: '',
        discountMoney: ''
      }
    },
    confirmHandle: function() {
      if (this.addCoupon.type == '2' && (this.addCoupon.money < 0 || this.addCoupon.money > 10)) {
        this.$message({
          message: '警告哦，打折率为0-10～',
          type: 'warning'
        })
        return
      }
      if (this.addCoupon.name == '') {
        this.$message({
          message: '警告哦，请输入优惠券名称',
          type: 'warning'
        })
        return
      }
      if (this.addCoupon.type == '') {
        this.$message({
          message: '警告哦，请输入优惠券类型',
          type: 'warning'
        })
        return
      }
      if (this.addCoupon.type == '3' && (this.addCoupon.discountMoney == '' || this.addCoupon.money == '')) {
        this.$message({
          message: '警告哦，请输入优惠券满减金额',
          type: 'warning'
        })
        return
      }
      if (this.addCoupon.type == '1' && this.addCoupon.money == '') {
        this.$message({
          message: '警告哦，请输入优惠金额',
          type: 'warning'
        })
        return
      }
      if (this.addCoupon.type == '2' && this.addCoupon.money == '') {
        this.$message({
          message: '警告哦，请输入优惠折扣',
          type: 'warning'
        })
        return
      }
      if (this.addCoupon.quantity == '') {
        this.$message({
          message: '警告哦，请输入优惠券数量',
          type: 'warning'
        })
        return
      }
      if (this.addCoupon.time == '') {
        this.$message({
          message: '警告哦，请输入优惠券使用时间',
          type: 'warning'
        })
        return
      }
      this.addCoupon.discountMoney = this.addCoupon.discountMoney ? this.addCoupon.discountMoney : '0'
      const func = this.isEdit ? putDiscountCoupon : postDiscountCoupon
      const magSuccess = this.isEdit ? '成功编辑优惠券' : '添加优惠券成功'
      const failSuccess = this.isEdit ? '编辑优惠券失败' : '添加优惠券失败'
      const data = {
        storeId: this.storeId,
        useOffline: this.addCoupon.useOffline,
        useOnline: this.addCoupon.useOnline,
        startTime: parseTime(this.addCoupon.time[0]),
        endTime: parseTime(this.addCoupon.time[1]),
        name: this.addCoupon.name,
        type: this.addCoupon.type,
        money: this.addCoupon.money,
        quantity: this.addCoupon.quantity,
        discountMoney: this.addCoupon.discountMoney,
        id: this.addCoupon.id
      }
      func(data).then(res => {
        if (res.data.code !== 1001) {
          this.$message({
            showClose: true,
            message: failSuccess,
            type: 'error'
          })
          return
        }
        this.$message({
          showClose: true,
          message: magSuccess,
          type: 'success'
        })
        this.getDiscountCouponFun()
        this.addDialog = false
      })
      console.log(data)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
