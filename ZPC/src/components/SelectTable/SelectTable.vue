<template>
  <div class="select-table">
    <el-table
      ref="multipleTable"
      :data="data.items"
      :border="true"
      tooltip-effect="dark"
      height="500"
      max-height="500"
      :show-summary="isSummary"
      :summary-method="getSummaries"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <div slot="append" />
      <el-table-column
        type="index"
        fixed
        align="center"
        width="55"
      />
      <el-table-column
        v-if="isSelect"
        type="selection"
        fixed
        align="center"
        width="55"
      />
      <slot name="handle" />
      <el-table-column
        v-for="(item,index) in data.title"
        :key="item.key"
        :fixed="index<1?true:false"
        :show-overflow-tooltip="true"
        :label="item.name"
        resizable
        align="center"
        min-width="100"
      >
        <template slot-scope="scope">
          <p v-if="item.key.split('.').length==2">
            {{ scope.row[item.key.split('.')[0]] && scope.row[item.key.split('.')[0]][item.key.split('.')[1]] }}
          </p>
          <p v-else-if="item.key.split('.').length==3">
            {{ scope.row[item.key.split('.')[0]] && scope.row[item.key.split('.')[0]][item.key.split('.')[1]] &&
              scope.row[item.key.split('.')[0]][item.key.split('.')[1]][item.key.split('.')[2]] }}
          </p>
          <div v-else-if="/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(scope.row[item.key])" class="table-img">
            <img :src="BASE_URL+'/main_store'+scope.row[item.key]" alt="">
          </div>
          <div v-else-if="(typeof scope.row[item.key]) === 'object'">
            <span v-for="(v,i) in scope.row[item.key]">
              {{ v.name }}{{ i!==scope.row[item.key].length-1?'、':'' }}
            </span>
          </div>
          <p v-else>
            {{ scope.row[item.key] }}
          </p>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="paginationData.page"
      :page-sizes="[10, 50, 100, 200]"
      :page-size="paginationData.pageSize"
      :page-count="paginationData.totalPage"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { BASE_URL } from '../../api/config'

export default {
  props: {
    data: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    paginationData: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    isSelect: {
      type: Boolean,
      default: false
    },
    isSummary: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      multipleSelection: [],
      BASE_URL,
      dataC: {},
      summaryText: []
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.data.title.forEach((v, index) => {
          if (v.key == 'name') {
            [this.data.title[0], this.data.title[index]] = [this.data.title[index], this.data.title[0]]
          }
        })
        this.dataC = this.data
        this.summaryText = ['合计']
        if (this.isSelect) {
          this.summaryText.push('')
        }
        if (this.$slots.handle) {
          this.summaryText.push('')
        }
        const filterArr = ['id', 'supplierId', 'supplierName', 'targetPhone', 'account', 'receiverPhone', 'waybillNumber', 'receiverZipcode', 'phone', 'inviterPhone', 'remark', 'resultOrderId', 'barCode', 'image', 'goodsLabels', 'origin', 'putaway', 'prodcingWay', 'pushMoneyStatus', 'discountCouponId']
        const filterArr2 = ['客户电话', '会员卡号']
        for (let i = 0; i < this.dataC.title.length; i++) {
          const column = []
          const v = this.dataC.title[i]
          if (filterArr.some(v4 => v4 == v.key)) {
            this.summaryText.push('')
            continue
          }
          if (filterArr2.some(v4 => v4 == v.name)) {
            this.summaryText.push('')
            continue
          }
          this.dataC.items.map(v2 => {
            if (v.key.split('.').length == 2) {
              column.push(v2[v.key.split('.')[0]] && v2[v.key.split('.')[0]][v.key.split('.')[1]])
            } else if (v.key.split('.').length == 3) {
              column.push(v2[v.key.split('.')[0]] && v2[v.key.split('.')[0]][v.key.split('.')[1]] && v2[v.key.split('.')[0]][v.key.split('.')[1]][v.key.split('.')[2]])
            } else {
              column.push(v2[v.key])
            }
          })
          if (!column.every(item => isNaN(Number(item))) && !column.every(item => item === '' || item === null)) {
            let summary = 0
            column.forEach(v3 => {
              summary += Number(v3)
            })
            if (isNaN(summary)) {
              this.summaryText.push('')
            } else {
              this.summaryText.push(summary.toFixed(2))
            }
          } else {
            this.summaryText.push('')
          }
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    getSummaries(param) {
      return this.summaryText
    },
    tableRowClassName({ row, rowIndex }) {
      console.log(this.data)
      if (row.orderStatus == -1 || row._orderStatus == -1) {
        return 'success-row'
      } else if (row.orderStatus == -2 || row._orderStatus == -2) {
        return 'warning-row'
      }
      return ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('input', this.multipleSelection)
    },
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      this.paginationData.page = 1
      this.$emit('paginationChange')
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.paginationData.page = val
      this.$emit('paginationChange')
      // console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style lang='scss' scoped>
  .select-table {
    flex: auto;
    min-width: 0;
    /deep/ .cell {
      p {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    /deep/ .el-table .warning-row {
      background: #75c1f7;
    }

    /deep/ .el-table .success-row {
      background: #f97681;
    }
    .el-pagination {
      display: flex;
      align-self: center;
      justify-content: center;
      margin-top: 10px;
    }
    .table-img {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 50px;
        height: 50px;
      }
    }
  }

</style>
