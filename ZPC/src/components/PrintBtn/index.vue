<template>
  <div class="printBtn" @click="$emit('click')">
    <i class="el-icon-printer" />
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
  .printBtn {
    width: 35px;
    height: 35px;
    position: fixed;
    right: 20px;
    bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    background: #e0e0e0;
    border-radius: 50%;
    cursor: pointer;
  }
</style>
