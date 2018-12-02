<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App'
}
</script>
<style lang="scss">
  .search-bar{
    display: flex;
    .el-input-group{
      width: auto;
    }
    .el-input__inner{
      width: 200px;
      margin: 0;
    }
    margin-bottom: 10px;
    >div{
      margin-right: 10px;
    }
  }
  .warrap{
    padding: 32px;
    background-color: rgb(240, 242, 245);
  }
</style>
