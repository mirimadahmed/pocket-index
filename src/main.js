import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Moralis from 'moralis'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false
const serverUrl = process.env.VUE_APP_MORALIS_SERVER_URL
const appId = process.env.VUE_APP_MORALIS_APP_ID
Moralis.start({ serverUrl, appId })
const web3 = new Moralis.Web3();

Vue.prototype.$moralis = Moralis
Vue.prototype.$web3 = web3

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


