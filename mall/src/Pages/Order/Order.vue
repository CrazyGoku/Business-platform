<template>
    <page class="Order" :title="title" @clickLeft="clickLeft" pageName="Order">
      <img src="@/assets/icons/icon_share@2x.png" alt="" slot="rightIcon">
        <div id="Order">
        </div>
    </page>
</template>

<script>
    import Page from '@/components/page/page'
    import header from '@/mixins/header'

    export default {
        name: "Order",
        mixins: [header],
        data() {
            return {
                title: ''
            }
        },
        methods: {},
        computed: {},
        watch: {},
        mounted() {
        },
        components: {
            Page
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin';
</style>
