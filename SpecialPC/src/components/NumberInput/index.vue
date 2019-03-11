<template>
  <div class="input">
    <div v-if="noSlot" class="prepend">
      <slot name="prepend" />
    </div>
    <el-input-number
      v-model="num"
      :min="Number(min)"
      :step="Number(step)"
      :max="Number(max)"
      class="number"
      controls-position="right"
      size="mini"
      @change="handleChange"
    />
  </div>
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    min: {
      type: [String, Number],
      default: 0
    },
    max: {
      type: [String, Number],
      default: 100000000000000000
    },
    step: {
      type: [String, Number],
      default: 1
    },
    value: [Number, String],
    noSlot: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      num: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.num = Number(val)
      }
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }

}
</script>

<style lang="scss" scoped>
  .input {
    flex: none;
    justify-content: flex-start;
    display: flex;
    align-items: center;
    width: auto;
    font-size: 12px;
    .prepend {
      line-height: 26px;
      background-color: #f5f7fa;
      color: #909399;
      border: 1px solid #dcdfe6;
      border-radius: 4px 0 0 4px;
      padding: 0 20px;
      white-space: nowrap;
      float: left;
    }
    .number {
      width: auto;
      border-radius: 0 4px 4px 0;
    }
  }

</style>
