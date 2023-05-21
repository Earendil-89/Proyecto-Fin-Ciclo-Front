import Vue from 'vue';
import Router from 'vue-router';
import Constants from "./plugins/Constants.js";
import Login from './views/Login.vue';

Vue.use(Constants);
Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login,
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: () => import("./views/Home.vue")
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
        type: 'solicitud-manager'
      }
    },
    {
      path: '/usuario/solicitud',
      component: () => import ('./components/Crud.vue'),
      props: { current: "solicitudUser-dynamic",
        mainTableFields: Vue.prototype.$constants().solicitudUsuarioTableFields,
        type: 'solicitud-user'
      }
    },
    {
      path: '/manager/envase',
      component: () => import('./components/Crud.vue'),
      props: { current: "envase-dynamic",
        mainTableFields: Vue.prototype.$constants().envaseManagerTableFields,
        type: 'envase'
      }
    }
  ]
});
