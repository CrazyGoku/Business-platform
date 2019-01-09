<template>
  <div class="tree">
    <p>
      <span>商品分类</span>
      <i v-if="add" class="iconfont" @click="addHandle">
        &#xe642;
      </i>
      <i v-if="deleteC" class="iconfont" @click="deleteHandle">
        &#xe641;
      </i>
    </p>
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      node-key="id"
      accordion
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
export default {
  props: {
    add: {
      type: Boolean,
      default: false
    },
    deleteC: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    handleNodeClick: function(data) {
      console.log(this.$refs.tree.getCurrentKey())
      const key = this.$refs.tree.getCurrentKey()
      this.$emit('nodeClick', key)
    },
    addHandle() {
      this.$emit('addHandle')
    },
    deleteHandle() {
      this.$emit('deleteHandle')
    }
  }
}
</script>
<style lang='scss' scoped>
  .tree {
    flex: none;
    height: 500px;
    margin-right: 10px;
    overflow-y: auto;
    border: 1px solid;
    border-color: #e6e9f2;
    border-radius: 5px;
    width: 200px;
    p {
      font-size: 15px;
      color: #212121;
      vertical-align: middle;
      margin: 0;
      padding: 10px 5px;
      border-bottom: 1px solid #e6e9f2;
    }
    .iconfont {
      float: right;
      margin-right: 10px;
      margin-left: 20px;
      cursor: pointer;
      user-select: none;
      &:last-child {
        margin-left: 0px;
      }
    }
  }
</style>
