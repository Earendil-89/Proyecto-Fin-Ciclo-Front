export default {
  install(Vue) {
    Vue.prototype.$constants = () => {
      return {
        VERSION: '1.0.0',
        usuarioTableFields:[
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'nif', label: 'DNI', sortable: true },
          { key: 'action', label: '', thStyle: { width: '120px'} }
        ],
        fraseTableFields:[
          { key: 'codigo', label: 'Codigo', sortable: true },
          { key: 'descripcion', label: 'Descripcion'},
          { key: 'action', label : '', thStyle: { width: '120px'} }
        ]
      };
    };
  }
}