<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    iconfont: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, iconfont } = context.props
    const vnodes = []
    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }
    if (iconfont) {
      vnodes.push(h(
        'i',
        {
          class: {
            iconfont: true
          },
          style: {
            marginRight: '16px'
          },
          domProps: {
            innerHTML: iconfont
          }
        }
      ))
    }
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
