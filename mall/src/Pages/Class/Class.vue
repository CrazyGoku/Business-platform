<template>
  <div id="Class">
    <div class="class-l">
      <van-badge-group :active-key="activeKey" @change="onChange">
        <van-badge title="标签名称" />
        <van-badge title="标签名称" info="8" />
        <van-badge title="标签名称" info="99" />
        <van-badge title="标签名称" info="99+" />
      </van-badge-group>
    </div>
    <div class="class-r">
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        :thumb="imageURL"
      />
    </div>
  </div>
</template>

<script>
    import Page from '@/components/page/page'

    export default {
        name: "Class",
        mixins: [],
        data() {
            return {
                title: '',
              activeKey: 0,
              imageURL:''
            }
        },
        methods: {
          onChange(key) {
            this.activeKey = key;
          }
        },
        computed: {},
        watch: {},
        mounted() {
        },
        components: {
            Page
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin';
    #Class{
      display: flex;
      .class-l{
        width: 200px;
      }
      .class-r{
        flex: 1;
      }
    }

</style>
