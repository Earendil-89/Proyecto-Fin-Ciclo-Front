import Vue from 'vue';
import Router from 'vue-router';
import Constants from "./plugins/Constants.js";

Vue.use(Constants);
Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/usuario',
      component: () => import('./components/Crud.vue'),
      props: { current: 'usuario-dynamic' , 
        mainTableFields: Vue.prototype.$constants().usuarioTableFields,
        type: 'usuario'
      }
    },
  ]
});
