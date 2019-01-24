<template>
  <div v-show="show">
    <div class="loading-mask">
      <div class="loading-toast">
        <div>
          <Loading type="spinner" color="white" />
          <p class="m-t-sm">{{text || '正在上传'}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Loading
} from 'vant';
export default {
  components: {
    Loading
  },
  name: 'loading',
  props: {
    show: Boolean,
    text: String,
  }
}

</script>
<style lang="less">
.loading-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-toast {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7.6em;
  min-height: 7.6em;
  background: hsla(0, 0%, 7%, 0.7);
  text-align: center;
  border-radius: 5px;
  margin: 0 auto;
  max-height: 7.6em;

  .van-loading {
    margin: 0 auto;
  }

  p {
    margin: 10px 0 0;
    color: #fff;
  }
}

</style>
