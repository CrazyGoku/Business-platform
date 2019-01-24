<template>
  <div>
    <van-field
      v-model="originalDate"
      :required="required"
      :label="label"
      :placeholder="placeholder"
      clearable
      @click="showPickerHandle"
    />
    <transition name="slide">
      <van-datetime-picker
        v-model="currentDate"
        v-show="showPicker"
        class="timePick"
        @change="timeChange"
        @confirm="pickTime"
        @cancel="cancelHandle"
        :type="pickerType"
        :min-date="minDate"
      />
    </transition>
    <div v-if="showPicker" @click="cancelHandle" class="occlusion">

    </div>
  </div>

</template>

<script>
  import util from '@/common/js/utils'
  export default {
    name: 'TimePick',
    props: {
      value: Number,
      pickerType: {
        type: String,
        default: 'date'
      },
      label:String,
      placeholder:String,
      required:{
        type: Boolean,
        default: false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(newValue, oldValue) {
          console.log(newValue, util.date(newValue))
          this.showDate = util.date(newValue)
          this.originalDate = util.date(newValue)
        }
      },
    },
    data() {
      return {
        currentDate: new Date(this.value),
        showDate: '',
        showPicker: false,
        originalDate: '',
        minDate: new Date(1900, 1, 1)
      }
    },
    computed: {},
    methods: {
      pickTime(value) {
        this.$emit('input', Date.parse(value))
        this.showPicker = !this.showPicker
      },
      timeChange(picker) {
        this.showDate = picker.getValues().join('-')
      },
      showPickerHandle() {
        this.showPicker = !this.showPicker
        if (this.showPicker) {
          this.originalDate = util.date(this.currentDate)
        } else {
          this.currentDate = this.originalDate
        }
      },
      cancelHandle() {
        this.currentDate = new Date(this.originalDate)
        this.showPicker = !this.showPicker
      }
    },
    created() {
    },
    mounted(){
      this.originalDate= ''
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/less/mixin.less';

  .timeBox {
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #74828F;
    font-size: 15px;
    background: rgba(251, 251, 251, 1);
  }

  .pickerShow {
    &::after {
      content: '';
      display: inline-block;
      width: 12px;
      height: 12px;
      position: relative;
      top: 1px;
      background: url('../assets/icons/arrow-top@2x.png') no-repeat center;
      background-size: 100%;
    }
  }

  .pickerHide {
    &::after {
      content: '';
      display: inline-block;
      width: 12px;
      height: 12px;
      position: relative;
      top: 1px;
      background: url('../assets/icons/arrow-bottom@2x.png') no-repeat center;
      background-size: 100%;
    }
  }

  .timePick {
    position: fixed;
    bottom: 0;
    z-index: 101;
    width: 100%;
  }

  .slide-enter-active {
    transition: all .3s ease;
  }

  .slide-leave-active {
    transition: all .3s ease;
  }

  .slide-enter, .slide-leave-to {
    transform: translateY(100%)
  }

  .occlusion {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 100;
  }
</style>
