<template>
    <div :id="btnId">
        <van-button
          @click="EmitClick"
          size="large"
          :text="checkText"
          class=""
          :disabled="dis"
        >
        </van-button>
    </div>
</template>
<script>
// import Hub from '@/Hub'
export default {
  name: 'FixedBtn',
  props: {
    text: {
      type: String,
      default: '确认'
    },
    disabled: {
      type: Boolean,
      default: true
    },
    isCountDown: {
      type: Boolean,
      default: false
    },
    btnId: {
      type: String,
      default: 'FixedBtn'
    }
  },
  data () {
    return {
      btnText: this.text,
      disable: this.disabled,
      CountDown: this.isCountDown,
      countDownNum: 4,
      checkText: this.text,
      timer: 0
    }
  },
  watch: {
    text: {
      handler: function(newValue, oldValue) {
        this.btnText = newValue
        this.checkText = newValue
      }
    },
    disabled: {
      handler: function(newValue, oldValue) {
        this.disable = newValue
      }
    },
    isCountDown: {
      immediate: true,
      handler: function (newValue, oldValue) {
        console.log('newValue', newValue)
        if (newValue) {
          this.checkText = `${this.btnText} (${this.countDownNum + 1})`
        }
        this.CountDown = newValue
        this.countDownHandle()
      }
    }
  },
  computed: {
    dis() {
      return this.disable
    }
  },
  methods: {
    EmitClick () {
      this.$emit('click')
    },
    countDownHandle () {
      if (!this.CountDown) {
        return
      }
      this.disable = true
      this.timer = setInterval(() => {
        if (this.countDownNum === 0) {
          this.checkText = `${this.btnText}`
          this.disable = false
          clearInterval(this.timer)
          this.$emit('change', this.disable)
          console.log(this.disable)
        } else {
          this.checkText = `${this.btnText} (${this.countDownNum})`
        }
        this.countDownNum -= 1
      }, 1000)
    }
  },
  mounted () {
    // Hub.$on('valueChange', function(value) {
    //   this.$nextTick(() => {
    //     this.disable = value
    //   })
    // })
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.timer)
  },
  components: {}
}
</script>
<style lang="less" scoped>
  #FixedBtn{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .van-button{
      background: #f75555;
      color: white;
    }
  }

</style>
