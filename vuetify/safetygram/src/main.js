import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'
import vuetify from './plugins/vuetify'
import VueTelInput from 'vue-tel-input'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  vuetify,
  render: h => h(App)
})
.$mount('#app')

const moment = require('moment')
moment.locale('en')
moment.updateLocale('en', {
  calendar : {
      lastDay : '[Yesterday at] HH:mm',
      sameDay : '[Today at] HH:mm',
      nextDay : '[Tomorrow at] HH:mm',
      lastWeek : '[last] dddd [at] HH:mm',
      nextWeek : 'dddd [at] HH:mm',
      sameElse : 'DD.MM.YYYY HH:mm'
  }
})

Vue.use(require('vue-moment'), {
    moment
})
Vue.use(VueTelInput)