<template>
  <div style="padding: 10px">
    <el-button v-if="!printing"
               type="success" size="mini" @click="settingHeight">设置纸张高度
    </el-button>
    <el-button v-if="!printing"
               type="success" size="mini" @click="settingMargin">设置表格间距
    </el-button>
    <el-button
      v-if="!printing"
      size="mini"
      @click="doPrint"
    >
      打印
    </el-button>
    <!--startprint-->
    <div id="printContainerC">
      <div class="printContainer" :style="{'marginBottom':paperBottom+'px'}" v-for="(item1,index1) in splitData"
           :key="index1">
        <p class="order-title">
          {{ storeName }}-{{ orderName }}
        </p>
        <p class="head first">
          <span v-if="orderId">单号：{{orderId}}</span><span>制单日期：{{orderTime}}</span><span>第{{index1+1}}/{{splitData.length}}页</span>
        </p>
        <p class="head" v-if="supplierName">
          <span >供应商：{{ supplierName }}</span><span>电话:{{ supplierPhone }}</span><span :style="{'paddingRight':supplierAddr?'0':'100px'}" >地址：{{supplierAddr}}</span>
        </p>
        <p class="head" v-if="clientName">
          <span >客户：{{ clientName }}</span><span>电话:{{ clientPhone }}</span><span :style="{'paddingRight':clientAddr?'0':'100px'}">地址：{{clientAddr}}</span>
        </p>
        <div class="select-table">
          <el-table
            ref="multipleTable"
            size="mini"
            :data="item1"
            border
            tooltip-effect="dark"
            style="width: 800px"
          >
            <el-table-column
              type="index"
              fixed
              align="center"
              width="40"
            >
              <template slot-scope="scope">
                {{scope.row.indexId+1}}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item2,index2) in data.title"
              :key="item2.key"
              :min-width="index2==2?'230':index2==1?'120':''"
              :label="item2.name"
              align="center"
            >
              <template slot-scope="scope">
                {{scope.row[item2.key]}}
              </template>
            </el-table-column>
          </el-table>
          <div style="font-size: 12px;display: flex;width: 100%;border: 1px solid black;border-top: 0;">
            <span
              style="box-sizing:border-box;padding: 3px 0;width: 557px;text-align: right;padding-right: 4px;">本页小计：</span>
            <span
              style="box-sizing:border-box;padding: 3px 0;width: 80px;text-align: center;border-left: 1px solid black;">{{splitTotalArr[index1].quantityC}}</span>
            <span
              style="box-sizing:border-box;padding: 3px 0;width: 81px;text-align: center;border-left: 1px solid black;border-right: 1px solid black;">{{splitTotalArr[index1].moneyC}}</span>
          </div>
          <div style="font-size: 12px;display: flex;width: 100%;border: 1px solid black;border-top: 0;">
            <span
              style="box-sizing:border-box;padding: 3px 0;width: 195px;text-align: right;padding-right: 4px;border-right: 1px solid;">合计金额（大写）：</span>
            <span style="box-sizing:border-box;padding: 3px 0;width: 362px;text-align: left;padding-right: 4px;">{{NumberToChinese(totalMoney.toFixed(2))}}</span>
            <span style="box-sizing:border-box;padding: 3px 0;flex: 1;text-align: center;border-left: 1px solid black;">{{'¥：'+totalMoney.toFixed(2)+'元'}}</span>
          </div>
        </div>
        <p class="footer">
          <span>制单人：{{ name }}</span><span v-if="settlementType">结算方式:{{settlementType}}</span>
        </p>
        <p class="footer">
          <span>地址：{{ storeAddr }}</span><span>电话:{{ phone }}</span><span>一联：存根</span><span>二联：客户</span><span>三联：结账</span>
        </p>
      </div>
    </div>
    <!--endprint-->
    <div ref="table" class="select-table" style="visibility: hidden">
      <el-table
        ref="multipleTable"
        size="mini"
        :data="splitArr"
        border
        tooltip-effect="dark"
        style="width: 800px"
      >
        <el-table-column
          type="index"
          fixed
          align="center"
          height="40"
        />
        <el-table-column
          v-for="(item,index) in data.title"
          :key="item.key"
          :label="item.name"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row[item.key]}}
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {parseTime} from '@/utils'

  export default {
    props: {
      isSelect: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        paperHeight: '',
        paperBottom: '',
        multipleSelection: [],
        data: JSON.parse(window.localStorage.getItem('printData')),
        storeName: window.localStorage.getItem('storeName'),
        orderName: this.$route.query.orderName,
        printing: false,
        storeAddr: window.localStorage.getItem('storeAddr'),
        orderId: this.$route.query.orderId,
        orderTime: this.$route.query.orderTime,
        supplierName: this.$route.query.supplierName,
        supplierPhone: this.$route.query.supplierPhone,
        supplierAddr: this.$route.query.supplierAddr,
        clientName: this.$route.query.clientName,
        clientPhone: this.$route.query.clientPhone,
        clientAddr: this.$route.query.clientAddr,
        settlementType:this.$route.query.settlementType,
        date: parseTime(new Date, '{y}-{m}-{d}'),
        splitArr: [],
        splitItem: {
          quantityC: 0,
          moneyC: 0,
        },
        splitTotalArr: [],
        totalMoney: 0,
        splitData: [],
        unit: new Array("仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分")
      }
    },
    computed: {
      ...mapGetters(['name', 'phone'])
    },
    mounted() {
      if (window.localStorage.getItem('paperHeight')) {
        this.paperHeight = window.localStorage.getItem('paperHeight')
        this.paperBottom = window.localStorage.getItem('paperBottom')
      } else {
        this.paperHeight = 500
      }
      if (window.localStorage.getItem('paperBottom')) {
        this.paperBottom = window.localStorage.getItem('paperBottom')
      } else {
        this.paperBottom = 100
      }
      this.setPage()
    },
    methods: {
      settingHeight() {
        this.$prompt(`当前数值为${this.paperHeight}像素`, '设置纸张高度', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
          inputErrorMessage: '请输入正数'
        }).then(({value}) => {
          this.paperHeight = value
          window.localStorage.setItem('paperHeight', value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      settingMargin() {
        this.$prompt(`当前数值为${this.paperBottom}像素`, '设置表格间距', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
          inputErrorMessage: '请输入正数'
        }).then(({value}) => {
          this.paperBottom = value
          window.localStorage.setItem('paperBottom', value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      toDx(n) {   //阿拉伯数字转换函数
        switch (n) {
          case "0":
            return "零";
          case "1":
            return "壹";
          case "2":
            return "贰";
          case "3":
            return "叁";
          case "4":
            return "肆";
          case "5":
            return "伍";
          case "6":
            return "陆";
          case "7":
            return "柒";
          case "8":
            return "捌";
          case "9":
            return "玖";
        }
      },
      // 转换算法主函数
      NumberToChinese(m) {
        m *= 100;
        m += "";
        var length = m.length;

        var result = "";
        for (var i = 0; i < length; i++) {
          if (i == 2) {
            result = "元" + result;
          } else if (i == 6) {
            result = "万" + result;
          }
          if (m.charAt(length - i - 1) == 0) {
            if (i != 0 && i != 1) {
              if (result.charAt(0) != '零' && result.charAt(0) != '元' && result.charAt(0) != '万') {
                result = "零" + result;
              }
            }
            continue;
          }
          result = this.toDx(m.charAt(length - i - 1)) + this.unit[this.unit.length - i - 1] + result;
        }
        result += result.charAt(result.length - 1) == '元' ? "整" : "";
        return result
      },
      setPage() {
        let _data = this.data.items
        _data.forEach((v, index) => {
          this.totalMoney += Number(v.money)
          v.indexId = index
          setTimeout(() => {
            this.splitArr.push(v)
            this.splitItem.quantityC += Number(v.quantity)
            this.splitItem.moneyC += Number(v.money)
            this.$nextTick(() => {
              if (this.$refs.table.offsetHeight > this.paperHeight) {
                this.splitData.push(this.splitArr)
                this.splitTotalArr.push(JSON.parse(JSON.stringify(this.splitItem)))
                this.splitArr = []
                this.splitItem.quantityC = 0
                this.splitItem.moneyC = 0
              }
              if (index === _data.length - 1) {
                if (this.splitArr.length > 0) {
                  this.splitData.push(this.splitArr)
                  this.splitTotalArr.push(JSON.parse(JSON.stringify(this.splitItem)))
                  this.splitArr = []
                  this.splitItem.quantityC = 0
                  this.splitItem.moneyC = 0
                }
              }
            })
          })
        })
      },
      doPrint() {
        var newstr = document.getElementById('printContainerC').innerHTML
        var oldstr = document.body.innerHTML
        document.body.innerHTML = newstr
        window.print()
        window.location.reload()
        document.body.innerHTML = oldstr
        return false
      }
    }
  }
</script>

<style lang='scss' scoped>
  #printContainerC {
    width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .printContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      width: 800px;
      margin: 5px 0;
    }
  }

  .select-table {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 800px;
    border-top: 1px solid;
    .total-tabel {
      border-top: none !important;
      /deep/ .el-table__header-wrapper {
        display: none !important;
      }
    }
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
  .first{
    span{
      &:last-child{
        margin-right: 0;
      }
    }
  }
  .head {
    width: 800px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    span {
      margin-right: 40px;
    }
  }

  .footer {
    width: 800px;
    display: flex;
    justify-content: flex-start;
    font-size: 12px;
    span {
      margin-right: 40px;
    }
  }
</style>
