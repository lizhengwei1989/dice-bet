import Vue from 'vue'


import '../node_modules/element-ui/lib/theme-chalk/index.css'

import '../static/css/reset.css'


import _6f6c098b from '../layouts/default.vue'

const layouts = { "_default": _6f6c098b }



export default {
  head: {"title":"DiceBet","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, user-scalable=no ,initial-scale=1"},{"hid":"description","name":"description","content":"DiceBet was developed based on TRON blockchain technology, aiming to build a fair, just, and open blockchain lottery gaming platform."},{"property":"og:url","content":"https:\u002F\u002Ftrongame.top"},{"property":"og:type","content":"website"},{"property":"og:title","content":"DiceBet"},{"property":"og:image","content":"\u002Fimages\u002Fshare.png"},{"property":"og:description","content":"DiceBet was developed based on TRON blockchain technology, aiming to build a fair, just, and open blockchain lottery gaming platform."},{"name":"twitter:site","content":"https:\u002F\u002Ftrongame.top"},{"name":"twitter:card","content":"summary_large_image"},{"name":"twitter:image","content":"\u002Fimages\u002Flogo.png"}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon.ico"},{"rel":"stylesheet","href":"\u002F\u002Fat.alicdn.com\u002Ft\u002Ffont_887145_dm8t046ghmo.css"},{"rel":"stylesheet","href":"\u002F\u002Fat.alicdn.com\u002Ft\u002Ffont_905800_0qi6hlgu8tz.css"}],"script":[{"src":"\u002Fjs\u002Frem.js"}],"style":[]},
  render(h, props) {
    
    const layoutEl = h(this.layout || 'nuxt')
    const templateEl = h('div', {
      domProps: {
        id: '__layout'
      },
      key: this.layoutName
    }, [ layoutEl ])

    const transitionEl = h('transition', {
      props: {
        name: 'layout',
        mode: 'out-in'
      }
    }, [ templateEl ])

    return h('div',{
      domProps: {
        id: '__nuxt'
      }
    }, [
      
      transitionEl
    ])
  },
  data: () => ({
    layout: null,
    layoutName: ''
  }),
  beforeCreate () {
    Vue.util.defineReactive(this, 'nuxt', this.$options.nuxt)
  },
  created () {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (typeof window !== 'undefined') {
      window.$nuxt = this
      
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
  },
  
  methods: {
    
    
    setLayout(layout) {
      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      this.layoutName = layout
      this.layout = layouts['_' + layout]
      return this.layout
    },
    loadLayout(layout) {
      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      return Promise.resolve(layouts['_' + layout])
    }
    
  },
  components: {
    
  }
}
