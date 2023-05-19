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
      props: { current: 'usuario-dynamic', 
        mainTableFields: Vue.prototype.$constants().usuarioTableFields,
        type: 'usuario'
      }
    },
    {
      path: '/frase',
      component: () => import('./components/Crud.vue'),
      props: { current: "frase-dynamic",
        mainTableFields: Vue.prototype.$constants().fraseTableFields,
        type: 'frase'
      }
    },
    {
      path: '/etiqueta',
      component: () => import('./components/Crud.vue'),
      props: { current: 'etiqueta-dynamic',
        mainTableFields: Vue.prototype.$constants().etiquetaTableFields,
        type: 'etiqueta'
      }
    },
    {
      path: '/armario',
      component: () => import('./components/Crud.vue'),
      props: { current: "armario-dynamic",
        mainTableFields: Vue.prototype.$constants().armarioTableFields,
        type: 'armario',
      }
    },
    {
      path: '/estante',
      component: () => import('./components/Crud.vue'),
      props: { current: "estante-dynamic",
        mainTableFields: Vue.prototype.$constants().estanteTableFields,
        type: 'estante',
      }
    },
    {
      path: '/compuesto',
      component: () => import('./components/Crud.vue'),
      props: { current: "compuesto-dynamic",
        mainTableFields: Vue.prototype.$constants().compuestoTableFields,
        type: 'compuesto'
      }
    },
    {
      path: '/envaseProp',
      component: () => import('./components/Crud.vue'),
      props: { current: "envase-dynamic",
        mainTableFields: Vue.prototype.$constants().envaseTableFields,
        type: 'envaseProp'
      }
    },
    {
      path: '/solicitud',
      component: () => import('./components/Crud.vue'),
      props: { current: "solicitud-dynamic",
        mainTableFields: Vue.prototype.$constants().solicitudTableFields,
        type: 'solicitud'
      }
    },
    {
      path: '/usuario/solicitud',
      component: () => import ('./components/Crud.vue'),
      props: { current: "solicitud-dynamic",
        mainTableFields: Vue.prototype.$constants().solicitudUsuarioTableFields,
        type: 'solicitud'
      }
    }
  ]
});
