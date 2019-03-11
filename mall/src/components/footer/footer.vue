<template>
  <van-tabbar v-model="active" @change="changeTab">
    <van-tabbar-item>
      <span>商品</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.commodity_selected : icon.commodity_noselected"
      >
    </van-tabbar-item>
    <van-tabbar-item>
      <span>订单</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.plate_selected : icon.plate_noselected"
      >
    </van-tabbar-item>

    <van-tabbar-item>
      <span>积分</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.search_selected : icon.search_noselected"
      >
    </van-tabbar-item>
    <van-tabbar-item>
      <span>我的</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.my_selected : icon.my_noselected"
      >
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
export default {

  name: 'Footer',
  data () {
    return {
      active: this.$store.getters.tabActive,
      /*icon: {
        plate_noselected: require('../../assets/icons/plate-noselected@2x.png'),
        plate_selected: require('../../assets/icons/plate-selected@2x.png'),
        search_noselected: require('../../assets/icons/search-noselected@2x.png'),
        search_selected: require('../../assets/icons/search-selected@2x.png'),
        commodity_noselected: require('../../assets/icons/overview-noselected@2x.png'),
        commodity_selected: require('../../assets/icons/overview-selected@2x.png'),
        my_noselected: require('../../assets/icons/my-noselected.png'),
        my_selected: require('../../assets/icons/my-selected.png')
      }*/
    }
  },
  methods:{
    ...mapMutations({
      set_tabActive: 'SET_TAB_ACTIVE'
    }),
    changeTab(active){
      this.set_tabActive(active)
      if(active===0){
        this.$router.push({name:'Commodity'})
      }else if (active===1){
        this.$router.push({name:'Order'})
      }else if (active===2){
        this.$router.push({name:'Integral'})
      }else{
        this.$router.push({name:'User'})
      }
    }
  },
  mounted(){

  }
}
</script>

<style scoped>

</style>
