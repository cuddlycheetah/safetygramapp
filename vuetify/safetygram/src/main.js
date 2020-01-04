import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'
import vuetify from './plugins/vuetify'
import VueTelInput from 'vue-tel-input'

import moment from 'vue-moment'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  vuetify,
  render: h => h(App)
})
.$mount('#app')

Vue.use(moment)
Vue.use(VueTelInput)