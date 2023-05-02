import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VeeValidate from 'vee-validate';
import Vuex from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Multiselect from 'vue-multiselect';

import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import Constants from "./plugins/Constants.js";
import "vue-multiselect/dist/vue-multiselect.min.css";

Vue.use(Constants);
Vue.use(VueSidebarMenu)
library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);
Vue.config.productionTip = false;
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('multiselect', Multiselect)

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
