<template>
  <div class="select-table">
    <el-table
      ref="multipleTable"
      :data="data.items"
      :border="true"
      tooltip-effect="dark"
      height="500"
      max-height="500"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
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
            {{ scope.row[item.key.split('.')[0]][item.key.split('.')[1]] }}
          </p>
          <p v-else-if="item.key.split('.').length==3">
            {{ scope.row[item.key.split('.')[0]][item.key.split('.')[1]][item.key.split('.')[2]] }}
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
