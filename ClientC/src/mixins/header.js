import {mapGetters, mapMutations} from 'vuex'

export default {
  data() {
    return {
      title: ''
    }
  },
  computed: {
    ...mapGetters(['path'])
  },
  mounted() {

  },
  methods: {
    clickLeft() {
      if (this.path.length > 1) {
        this.$router.back()
      }
    }
  }
}
