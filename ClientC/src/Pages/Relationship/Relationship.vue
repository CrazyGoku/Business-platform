<template>
  <div>
    <van-collapse
      v-model="activeName"
      accordion>
      <div
        v-for="(item,index) in relationArr"
        :key="index">
        <van-collapse-item :title="relationList[item][0].clientName" :name="item">
          <van-cell v-for="(item2,index) in relationList[item] " :key="index" :title="item2.storeName" :value="item2.totalPushMoney" />
          <div class="check-btn-box">
            <van-button size="small" class="check-btn" @click="$router.push({name:'PushMoneyDetails',query:{clientId:item}})">查看明细</van-button>
          </div>
        </van-collapse-item>

      </div>

    </van-collapse>
    <div v-if="lostData" class="lost-data">
      <img src="@/assets/icons/data-lost.png" alt="">
    </div>
    <!--<van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      @load="onLoad"
    >
      <van-cell
        v-for="item in relationList"
        :key="item.id"
        :title="item.clientName"
      />
    </van-list>-->
  </div>
</template>

<script>
  import {getClientsStores, getClientsSubordinate,getClientsSubordinateDetail} from '@/api/api'
  import {mapGetters} from 'vuex'

  export default {
    name: "relationship",
    data() {
      return {
        relationList: {},
        activeName: '',
        relationArr: [],
        loading: false,
        finished: false,
        error: false,
        lostData:false,
        dataPage: {
          page: 1,
          pageSize: 20
        }
      }
    },
    computed: {
      ...mapGetters(['id'])
    },
    mounted() {
      this.onLoad()
    },
    methods: {
      onLoad() {
        let params = {
          id: this.id
        }
        getClientsSubordinate(params).then(res => {
          res.data.forEach(v => {
            if (this.relationArr.indexOf(v.clientId) > -1) {
            }else{
              this.relationArr.push(v.clientId)
            }
          })
          this.relationArr.forEach(v => {
            this.relationList[v] = []
          })
          res.data.forEach(v => {
            this.relationList[v.clientId].push(v)
          })
          this.lostData =this.relationArr.length === 0
          /*console.log(res)
          this.loading = false;
          let data = res.data
          this.relationList.push.apply(this.relationList,data.items);
          this.dataPage = data.pageVo
          if(this.dataPage.page === this.dataPage.totalPage){
            this.finished = true
            return
          }
          this.dataPage.page++*/
        })
        // 异步更新数据
        /*setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            this.list.push(this.list.length + 1);
          }
          // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.list.length >= 40) {
            this.finished = true;
          }
        }, 500);*/
      }
    }
  }
</script>

<style lang='less' scoped>
  @import '../../common/less/mixin';
  .check-btn-box{
    display: flex;
    margin-top: 10px;
    justify-content: flex-end;
    .check-btn{
    }
  }

</style>
