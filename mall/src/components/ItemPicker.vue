<template>
  <div>
    <van-field
      v-model="oraginData"
      :required="required"
      :label="label"
      :placeholder="placeholder"
      clearable
      @click="showPickerHandle"
    />
    <transition name="slide">
      <van-picker class="picker"  show-toolbar :columns="columns" @cancel="cancelHandle"
                  @confirm="onConfirm" v-show="showPicker"/>
    </transition>
    <div v-if="showPicker" @click="cancelHandle" class="occlusion">

    </div>
  </div>
</template>

<script>
  export default {
    name: "ItemPicker",
    props: {
      columns: Array,
      label: String,
      value: {

      },
      placeholder: String,
      required: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        oraginData: "",
        showPicker: false
      }
    },
    methods: {
      showPickerHandle() {
        this.showPicker = !this.showPicker
      },
      cancelHandle() {
        this.showPicker = !this.showPicker
      },
      onConfirm(value,index) {
        this.oraginData = value
        this.$emit('input', index)
        this.showPicker = !this.showPicker
      }
    }
  }
</script>

<style lang="less" scoped>
  .picker {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 102;
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
    z-index: 101;
  }
</style>
