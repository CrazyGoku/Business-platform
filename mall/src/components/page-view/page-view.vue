<template>
  <div>
    <transition :name="transitionName">
      <keep-alive :include="path">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'PageView',
    data: function () {
      return {
        includeCompss: this.includeComps,
        transitionName: ''
      }
    },
    watch: {
      '$route'(to, from) {
        console.log(1)
        let _path = this.path.slice(0)
        let index = _path.indexOf(to.name);
        if (index < 0) {
          this.transitionName = 'vux-pop-in'
          _path.push(to.name)
        } else {
          this.transitionName = 'vux-pop-out'
          _path.splice(index+1,_path.length)
        }
        if (to.meta.homepage && from.meta.homepage) {
          this.transitionName = ''
        }
        this.set_path(_path)
      }
    },
    computed: {
      ...mapGetters(['includeComps', 'path'])
    },
    updated: function () {
      this.includeCompss = this.includeComps
    },
    methods: {
      ...mapMutations({
        set_path: 'SET_PATH',
      })
    }
  }
</script>

<style rel="stylesheet/less" lang='less'>
  .child-view {
    width: 100%;
    height: 100%;
  }

  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 250ms;
    height: 100%;
    top: 0;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }

  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
</style>
