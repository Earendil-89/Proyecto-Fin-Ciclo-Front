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
        ],
        armarioTableFields:[
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'descripcion', label: 'Descripcion', sortable: true },
          { key: 'action', label: '', thStyle: { width: '180px'} }
        ],
        estanteTableFields:[
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'descripcion', label: 'Descripcion', sortable: true },
          { key: 'childAction', label: '', thStyle: { width: '120px'} }          
        ],
        etiquetaTableFields:[
          { key: 'codigo', label: 'Código', sortable: true },
          { key: 'descripcion', label: 'Descripción', sortable: true },
          { key: 'image', label: 'Imagen', thStyle: { width: '100px'} },
          { key: 'action', label: '', thStyle: { width: '120px'} }
        ],
        compuestoTableFields:[
          { key: 'cas', label: 'Nº CAS', sortable: true, thStyle: { width: '120px'} },
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'image', label: 'Imagen', thStyle: { width: '100px'} },
          { key: 'action', label: '', thStyle: { width: '120px'} }
        ]
      };
    };
  }
}