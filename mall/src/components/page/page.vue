<template>
  <div class="page-container">
    <div class="my-header">
      <my-header :title="title" :showBack="showBack" :showRight="showRight">
        <slot slot="rightIcon" name="rightIcon"></slot>
      </my-header>
    </div>
    <div class="wrapper" ref="wrapper">
      <div class="loading"
           @touchmove.prevent.stop
           v-show="ifLoading">
        <div class="middle">
          <van-loading color="white" size="40px"/>
        </div>
      </div>
      <div class="content" ref="content">
        <slot>
        </slot>
      </div>
    </div>
    <slot name="fixedItem"></slot>
    <my-footer v-if="showFooter"></my-footer>
  </div>
</template>

<script>
  import {sessionStorageService} from '@/common/js/storage'
  import {mapGetters} from 'vuex'
  import Header from '@/components/header/header.vue'
  import Footer from '@/components/footer/footer.vue'

  export default {
    name: 'Page',
    data() {
      return {
        showLoading: true
      }
    },
    props: {
      title: {
        type: String,
        default: 'PK'
      },
      pageName: {
        type: String,
        required: false
      },
      showBack: {
        type: Boolean,
        default: true
      },
      showFooter: {
        type: Boolean,
        default: false
      },
      showRight: {
        type: Boolean,
        default: false
      }
    },
    created: function () {
      // sessionStorageService.remove(this.pageName + 'ScrollTop', '0');
    },
    activated: function () {
      this.showLoading = true
      this.$refs.wrapper.scrollTop = sessionStorageService.get(this.pageName + 'ScrollTop') || '0'
    },
    deactivated: function () {
      this.showLoading = false
      sessionStorageService.set(this.pageName + 'ScrollTop', this.$refs.wrapper.scrollTop)
    },
    beforeDestroy: function () {
      sessionStorageService.remove(this.pageName + 'ScrollTop', '0')
    },
    computed: {
      ifLoading() {
        return this.loading.length > 0 && this.showLoading
      },
      ...mapGetters(['loading'])
    },
    components: {
      'my-header': Header,
      'my-footer': Footer
    }
  }
</script>

<style rel="stylesheet/less" lang='less'>
  @import '../../common/less/variable';
  @import '../../common/less/mixin';
  .page-container {
    display: flex;
    flex-direction: column;
    font-size: @font-size-15;
    color: @color-mainbody-text;
    height: 100%;
    width: 100%;
    position: fixed;
    // @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    //   & .my-header {
    //     & .van-nav-bar {
    //       padding-top: 44px!important;
    //     }
    //   }
    // }
    & .my-header {
      & .van-nav-bar {
        // padding-top: 20px;
        height: 44Px;
      }
      & .icon-back {
        font-size: 22Px;
        color: #424242;
        vertical-align: middle;
      }
      & .title {
        color: #424242;
        font-size: 18Px;
      }
      & .title span {
        font-weight: 700;
      }
    }
    & .wrapper {
      background-color: @color-bg;
      flex: 1;
      overflow-x: hidden;
      overflow-y: scroll;
      position: relative;
      & .loading {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 2;
        & .middle {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%)
        }
        & .van-loading--white {
          padding: 20Px;
          border-radius: 3Px;
          background-color: rgba(0, 0, 0, .5);
        }
      }
      & .content {
        // .mb(20);
        height: 100%;
        & .flex-item {
          &.border-bottom-1px {
            .border-bottom-1px(@color-divide-line);
          }
        }
        > div {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
