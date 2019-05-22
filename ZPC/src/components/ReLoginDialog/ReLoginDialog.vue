<template>
  <div>
    <el-dialog
      title="账号已自动登出"
      :visible.sync="show"
    >
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickLeftHandle">
          返回登录页
        </el-button>
        <el-button type="primary" @click="clickRightHandle">
          重新登录
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ReLoginDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    clickLeft: {
      type: Function,
      default: _ => {
      }
    },
    clickRight: {
      type: Function,
      default: _ => {
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    clickLeftHandle() {
      const promise = this.clickLeftHandle.apply(this)
      if (promise instanceof Promise) {
        return promise.then(_ => this.$emit('close'))
      }
      this.$emit('close')
    },
    clickRightHandle() {
      const promise = this.clickRightHandle.apply(this)
      if (promise instanceof Promise) {
        return promise.then(_ => this.$emit('close'))
      }
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
