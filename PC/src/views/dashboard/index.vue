<template>
  <div class="warrap">
    <el-row :gutter="12">
      <el-col :span="4">
        <el-card shadow="hover">
          本月销售笔数
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          本月销售收入
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          本月收款金额
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          本月应收余额
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          本月总利润
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          本月库存余量
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
