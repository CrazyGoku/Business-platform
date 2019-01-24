<template>
    <div id='BusinessTitle'>
      <p class="title">{{title}}</p>
    </div>
</template>
<script>
export default {
  name: 'BusinessTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  methods: {},
  mounted () {},
  components: {}
}
</script>
<style lang="less" scoped>
    .title{
      color: #74828F;
      /*line-height: 2.5;*/
      padding:.4rem  0  .3rem .3rem;
      font-size: 14px;
    }
</style>
