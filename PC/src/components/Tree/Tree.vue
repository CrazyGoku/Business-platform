<template>
  <div class="tree">
    <p><span>商品分类</span>
      <i v-if="add" class="iconfont" @click="addHandle">&#xe642;</i>
      <i v-if="deleteC" class="iconfont" @click="deleteHandle">&#xe641;</i>
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
    }
  },
  data() {
    return {
      data: [{
        label: '一级 1',
        id: 1,
        children: [{
          label: '二级 1-1',
          id: 2,
          children: [{
            label: '三级 1-1-1',
            id: 3
          }]
        }]
      }, {
        label: '一级 2',
        id: 4,
        children: [{
          label: '二级 2-1',
          id: 5,
          children: [{
            label: '三级 2-1-1',
            id: 6
          }]
        }, {
          label: '二级 2-2',
          id: 7,
          children: [{
            label: '三级 2-2-1',
            id: 8
          }]
        }]
      }, {
        label: '一级 3',
        id: 9,
        children: [{
          label: '二级 3-1', id: 10,
          children: [{
            label: '三级 3-1-1',
            id: 11
          }]
        }, {
          label: '二级 3-2',
          id: 12,
          children: [{
            label: '三级 3-2-1',
            id: 13
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(this.$refs.tree.getCurrentKey())
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
