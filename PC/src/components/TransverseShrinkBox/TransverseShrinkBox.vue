<template>
  <div ref="TransverseShrinkBox">
    <transition name="slide-fade2">
      <slot v-if="show"/>
    </transition>
    <transition name="slide-fade">
      <div v-if="show2" class="tab-bar" @click="test2"><span>展</span><span>开</span></div>
    </transition>
  </div>
</template>

<script>
// 收缩盒子
export default {
  name: 'TransverseShrinkBox',
  data() {
    return {
      show: true,
      show2: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
  },
  methods: {
    test() {
      this.show = false
      setTimeout(_ => {
        this.show2 = true
      }, 500)
    },
    test2() {
      this.show2 = false
      setTimeout(_ => {
        this.show = true
      }, 500)
    }
  }
}
</script>

<style lang='scss' scoped>
  .slide-fade-enter-active {
    animation: bounce-in .5s;
  }
  .slide-fade-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      width: 0;
      opacity: 0;
    }
    10%{
      width: 3px;
      opacity: .1;
    }
    20%{
      width: 6px;
      opacity: .2;
    }
    30%{
      width: 9px;
      opacity: .3;
    }
    40%{
      width: 12px;
      opacity: .4;
    }
    50% {
      width: 15px;
      opacity: .5;
    }
    60% {
      width: 18px;
      opacity: .6;
    }
    70% {
      width: 21px;
      opacity: .7;
    }
    80% {
      width: 24px;
      opacity: .8;
    }
    90% {
      width: 27px;
      opacity: .9;
    }
    100% {
      width: 30px;
      opacity: 1;
    }
  }
  .slide-fade2-enter-active {
    animation: bounce-in2 .5s;
  }
  .slide-fade2-leave-active {
    animation: bounce-in2 .5s reverse;
  }
  @keyframes bounce-in2 {
    0% {
      width: 0;
      opacity: 0;
    }
    10%{
      width: 21px;
      opacity: .1;
    }
    20%{
      width: 42px;
      opacity: .2;
    }
    30%{
      width: 63px;
      opacity: .3;
    }
    40%{
      width: 84px;
      opacity: .4;
    }
    50% {
      width: 105px;
      opacity: .5;
    }
    60% {
      width: 126px;
      opacity: .6;
    }
    70% {
      width: 147px;
      opacity: .7;
    }
    80% {
      width: 168px;
      opacity: .8;
    }
    90% {
      width: 189px;
      opacity: .9;
    }
    100% {
      width: 210px;
      opacity: 1;
    }
  }
  .tab-bar{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;
    flex: none;
    height: 500px;
    width: 30px;
    border: 1px solid;
    border-color: #e6e9f2;
    border-radius: 5px;
    font-size: 14px;
    color: #5a5e66;
  }
</style>
