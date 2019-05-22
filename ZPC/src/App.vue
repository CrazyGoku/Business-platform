<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default{
  name: 'App',
  data() {
    return {
    }
  },
  mounted() {
    if (window.localStorage.getItem('fallowPriceStatus') === null) {
      window.localStorage.setItem('fallowPriceStatus', false)
    }
  },
  // mixins:[warehouseList],
  methods: {
  }
}
</script>
<style lang="scss">
  .upload-button{
    margin: 0 10px;
    flex: none;
  }
  .el-dialog__footer{
    padding: 10px 20px 40px;
  }
  .search-bar{
    display: flex;
    flex-wrap: wrap;
    .el-input-group{
      width: auto;
    }
    .el-input__inner{
      width: 200px;
      margin: 0;
    }
    /deep/ .el-date-editor{
      width: 340px;
    }
    margin-bottom: 10px;
    >div{
      margin-right: 10px!important;
      margin-bottom: 5px!important;
    }
  }
  .dialog-center{
    justify-content: center!important;
  }
  .dialog-content-input{

    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    .el-input-group{
      width: auto;
    }
    .el-input__inner{
      width: 200px;
      margin: 0;
    }
    >div{
      margin-right: 10px!important;
      margin-bottom: 5px!important;
    }
  }
  .handle-bar{
    display: flex;

    margin-bottom: 10px;
  }
  .warrap{
    padding: 32px;
    background-color: rgb(240, 242, 245);
  }
  .division{
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
  }
  .bottom-handle{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-top: 10px;
    >button{
      margin-right: 10px;
    }
  }
</style>
