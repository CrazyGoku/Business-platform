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
          </template>
        </el-table-column>
      </select-table>
    </div>
    <el-dialog :title="isEdit?'编辑优惠券':'添加优惠券'" :visible.sync="addDialog">
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
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="addCoupon.money"
          :disabled="!addCoupon.type"
          :placeholder="addCoupon.type==1?'请输入优惠金额':addCoupon.type==2?'请输入打折率':addCoupon.type==3?'请输入购满金额':'请选择优惠券类型'"
          size="mini"
        >
          <template slot="prepend">
            {{ addCoupon.type==3?'购满金额':'优惠折扣' }}
          </template>
        </el-input>
        <el-input
          v-if="addCoupon.type==3"
          v-model="addCoupon.discountMoney"
          placeholder="请输入优惠金额"
          size="mini"
        >
          <template slot="prepend">
            优惠折扣
          </template>
        </el-input>
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
  </div>
</template>

<script>
import common from '@/mixins/common'
import {
  getDiscountCoupon,
  postDiscountCoupon,
  invalidDiscountCoupon,
  putDiscountCoupon
} from '@/service/PurchaseAndSale/Marketing/Coupon.js'
import SelectTable from '@/components/SelectTable/SelectTable'// 列表组件
import { parseTime } from '@/utils'

export default {
  name: 'Coupon',
  components: { SelectTable },
  mixins: [common],
  data() {
    return {
      filterData: {},
      discountCouponList: [],
      addDialog: false,
      addCoupon: {
        name: '',
        type: '',
        money: '',
        quantity: '',
        time: '',
        discountMoney: ''
      },
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
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getDiscountCouponFun()
  },
  methods: {
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
        useOffline: 1,
        useOnline: 0,
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
