<template>
  <div class="select-table">
    <el-table
      ref="multipleTable"
      :data="data.items"
      :border="true"
      tooltip-effect="dark"
      height="500"
      max-height="500"
      show-summary
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <div slot="append">

      </div>
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
            {{scope.row[item.key.split('.')[0]] && scope.row[item.key.split('.')[0]][item.key.split('.')[1]] }}
          </p>
          <p v-else-if="item.key.split('.').length==3">
            {{ scope.row[item.key.split('.')[0]] && scope.row[item.key.split('.')[0]][item.key.split('.')[1]] && scope.row[item.key.split('.')[0]][item.key.split('.')[1]][item.key.split('.')[2]] }}
          </p>
          <div v-else-if="/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(scope.row[item.key])" class="table-img" >
            <img :src="BASE_URL+'/pps'+scope.row[item.key]" alt="">
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
  import {BASE_URL} from "../../api/config";

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
    }
  },
  data() {
    return {
      multipleSelection: [],
      BASE_URL
    }
  },
  methods: {
    getSummaries(param) {
      const { columns } = param;
      let data = this.data.items

      console.log(data)
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += '';
        } else {
          sums[index] = 'N/A';
        }
      });

      return sums;
    },
    tableRowClassName({row, rowIndex}) {
      if (row.orderStatus==-1) {
        return 'success-row';
      }else if (row.orderStatus == -2) {
        return 'warning-row';
      }
      return '';
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
  .select-table{
    flex: auto;
    min-width: 0;
    /deep/ .cell{
      p{
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
    .el-pagination{
      display: flex;
      align-self: center;
      justify-content: center;
      margin-top: 10px;
    }
    .table-img {
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 50px;
        height: 50px;
      }
    }
  }

</style>
