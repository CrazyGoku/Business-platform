<template>
  <div style="padding: 10px">
    <el-button
      v-if="!printing"
      size="mini"
      @click="doPrint"
    >
      打印
    </el-button>
    <!--startprint-->
    <div id="printContainer">
      <p class="order-title">
        {{ storeName }}--{{ orderName }}
      </p>
      <div class="select-table">
        <el-table
          ref="multipleTable"
          size="mini"
          :data="data.items"
          border
          tooltip-effect="dark"
          style="width: 800px"
        >
          <el-table-column
            type="index"
            fixed
            align="center"
            width="55"
          />
          <el-table-column
            v-for="(item,index) in data.title"
            :key="item.key"
            :fixed="index<1?true:false"
            :label="item.name"
            align="center"
          >
            <template slot-scope="scope">
              <p v-if="item.key.split('.').length==2">
                {{ scope.row[item.key.split('.')[0]][item.key.split('.')[1]] }}
              </p>
              <p v-else-if="item.key.split('.').length==3">
                {{ scope.row[item.key.split('.')[0]][item.key.split('.')[1]][item.key.split('.')[2]] }}
              </p>
              <div v-else-if="item.key==='img'" class="table-img" />
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
      </div>
      <p class="footer">
        <span>制单人：{{ name }}</span><span>业务员:</span>
      </p>
      <p class="footer">
        <span>地址：{{ storeAddr }}</span><span>电话:{{ phone }}</span><span>一联：存根</span><span>二联：客户</span><span>三联：结账</span>
      </p>
    </div>
    <!--endprint-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multipleSelection: [],
      data: JSON.parse(window.localStorage.getItem('printData')),
      storeName: window.localStorage.getItem('storeName'),
      orderName: this.$route.query.orderName,
      printing: false,
      storeAddr: window.localStorage.getItem('storeAddr')
    }
  },
  computed: {
    ...mapGetters(['name', 'phone'])
  },
  mounted() {
    console.log(1232131, this.$route)
  },
  methods: {

    doPrint() {
      var newstr = document.getElementById('printContainer').innerHTML
      var oldstr = document.body.innerHTML
      document.body.innerHTML = newstr
      window.print()
      window.location.reload()
      document.body.innerHTML = oldstr
      return function() {

      }
    }
  }
}
</script>

<style lang='scss' scoped>
  #printContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .select-table {
    display: flex;
    justify-content: center;
    /deep/ .el-table {
      flex: none;
      border: 1px solid black;
    }
    /deep/ .el-table th.is-leaf {
      border-color: black;
    }
    /deep/ .el-table--medium th {
      padding: 0 !important;
      border-color: black;
    }
    /deep/ .el-table__row td {
      padding: 0 !important;
      border-color: black;
    }
    flex: none;
    min-width: 0;
    /deep/ .cell {
      font-size: 12px !important;
      color: black;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
      }
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

  .order-title {
    font-size: 20px;
    text-align: center;
  }
  .footer{
    width: 800px;
    display: flex;
    justify-content: flex-start;
    font-size: 12px;
    margin: 5px;
    margin-left: 50px;
    span{
      margin-right: 40px;
    }
  }
</style>
