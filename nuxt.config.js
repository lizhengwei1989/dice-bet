const pkg = require('./package')
module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { property:'og:url', content:'https://trongame.top'},
      { property:'og:type', content:'website'},
      { property:'og:title', content:pkg.title},
      { property:'og:image', content:'/images/share.png'},
      { property:'og:description', content:pkg.description},
      { name:'twitter:site',content:'https://trongame.top' },
      { name:'twitter:card',content:'summary_large_image' },
      { name:'twitter:image', content:'/images/share.png'},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script:[
      {src:'/js/rem.js'}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,


  router: {
    middleware: 'i18n'
  },

  generate: {
    routes: ['/', '/ch','/en']
  },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/static/css/reset.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/i18n.js',
    '@/plugins/element-ui',
    '@/plugins/filter.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.concat([{
      //     test: /\.sass$/,
      //     loaders: ['style', 'css', 'sass']
      //   }])
      // }
        // const sassResourcesLoader = {
        //     loader: 'sass-resources-loader',
        //     options: {
        //         resources: [
        //             'assets/css/variable.scss'
        //         ]
        //     }
        // }
        // // 遍历nuxt定义的loader配置，向里面添加新的配置。
        // config.module.rules.forEach((rule) => {
        //     if (rule.test.toString() === '/\\.vue$/') {
        //         // rule.options={};
        //         // rule.options.loaders={};
        //         // rule.options.loaders.sass = [];
        //         // rule.options.loaders.scss = [];
        //         // rule.options.loaders.sass.push(sassResourcesLoader)
        //         // rule.options.loaders.scss.push(sassResourcesLoader)
        //     }
        //     if (['/\\.sass$/', '/\\.scss$/'].indexOf(rule.test.toString()) !== -1) {
        //         rule.use=[];
        //         rule.use.push(sassResourcesLoader)
        //     }
        // })
    }
  }
}
