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
      component: () => import('./components/CrudNested.vue'),
      props: { parent: "armario-dynamic",
        children: "estante-dynamic",
        mainTableFields: Vue.prototype.$constants().armarioTableFields,
        childTableFields: Vue.prototype.$constants().estanteTableFields,
        type: 'armario',
        childType: 'estante'
      }
    },
    {
      path: '/compuesto',
      component: () => import('./components/Crud.vue'),
      props: { current: "compuesto-dynamic",
        mainTableFields: Vue.prototype.$constants().compuestoTableFields,
        type: 'compuesto'
      }
    }
  ]
});
