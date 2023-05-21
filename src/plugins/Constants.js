export default {
  install(Vue) {
    Vue.prototype.$constants = () => {
      return {
        VERSION: '1.0.0',
        usuarioTableFields: [
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'apellidos', label: 'Apellidos', sortable: true },
          { key: 'email', label: 'Email' },
          { key: 'action', label: '', thStyle: { width: '120px'} }
        ],
        fraseTableFields: [
          { key: 'codigo', label: 'Codigo', sortable: true },
          { key: 'descripcion', label: 'Descripcion'},
          { key: 'action', label : '', thStyle: { width: '120px'} }
        ],
        armarioTableFields: [
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'descripcion', label: 'Descripcion', sortable: true },
          { key: 'action', label: '', thStyle: { width: '180px'} }
        ],
        estanteTableFields: [
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'descripcion', label: 'Descripcion', sortable: true },
          { key: 'armario.nombre', label: 'Armario', sortable: true },
          { key: 'action', label: '', thStyle: { width: '120px' }  }
        ],
        etiquetaTableFields: [
          { key: 'codigo', label: 'Código', sortable: true },
          { key: 'descripcion', label: 'Descripción', sortable: true },
          { key: 'image', label: 'Imagen', thStyle: { width: '100px'} },
          { key: 'action', label: '', thStyle: { width: '120px'} }
        ],
        compuestoTableFields: [
          { key: 'cas', label: 'Nº CAS', sortable: true, thStyle: { width: '120px'} },
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'image', label: 'Imagen', thStyle: { width: '100px'} },
          { key: 'action', label: '', thStyle: { width: '120px'} }
        ],
        envaseTableFields: [
          { key: 'codigo', label: 'Código envase', thStyle: { width: '140px'} },
          { key: 'nombre', label: 'Nombre', sortable: true },
          { key: 'pureza', label: 'Pureza', thStyle: { width: '140px'} },
          { key: 'cantidad', label: 'Cantidad', thStyle: { width: '140px'} },
          { key: 'image_inside', label: '', thStyle: { width: '100px' } },
          { key: 'action', label: '', thStyle: { width: '120px' } }
        ],
        solicitudUsuarioTableFields: [
          { key: 'fechaSolicitud', label: 'Fecha', sortable: true, thStyle: { width: '120px'} },
          { key: 'estado', label: 'Estado', sortable: true, thStyle: { width: '150px'} },
          { key: 'codigoRecipiente', label: 'Recipiente'},
          { key: 'descripcion', label: 'descripcion', thStyle: { minWidth: '220px'} },
          { key: 'usuarioTramite', label: 'tramitado por', thStyle: { minWidth: '140px' } },
          { key: 'action', label: '', thStyle: { width: '120px'} },
        ],
        solicitudTableFields: [
          { key: 'codigoRecipiente', label: 'Recipiente', thStyle: { width: '120px' } },
          { key: 'fechaSolicitud', label: 'Fecha Sol.' },
          { key: 'userFullName', label: 'Usuario' },
          { key: 'link', label: 'Link' },
          { key: 'estado', labe: 'estado', sortable: true, thStyle: { width: '150px' } },
          { key: 'action', label: '', thStyle: { width: '120px' } }
        ],
        sidebarMenuUser: {
          title: 'Área de usuarios',
          icon: 'fas fa-user',
          child:[
            {
              href: '/usuario/solicitud', title: 'Mis solicitudes', icon: 'fas fa-plus-square'
            },
            { 
              href: '/usuario/compuesto', title: 'Uso compuestos químicos', icon: 'fas fa-flask'
            }
          ]
        },
        sidebarMenuManager: {
          title: 'Área de responsables',
          icon: 'fas fa-user-cog',
          child: [
            { href: '/envaseProp', title: 'Base de Datos de envases', icon: 'fas fa-database' },
            { href: '/manager/envase', title: 'Gestión de envases', icon: 'fas fa-flask' },
            { 
              href: '', title: 'Almacenamiento', icon: 'fas fa-warehouse',
              child: [ 
                { href: '/armario', title: 'Armarios', icon: 'fas fa-box' },
                { href: '/estante', title: 'Estantes', icon: 'fas fa-pallet' }
            ]
            },
            { href: '/frase', title: 'Frases seguridad', icon: 'fas fa-exclamation-triangle' },
            { href: '/etiqueta', title: 'Etiquetado seguridad', icon: 'fas fa-exclamation-triangle'},
            { href: '/compuesto', title: 'Compuestos químicos', icon :'fas fa-atom' },
            { href: '/solicitud', title: 'Gestión solicitudes', icon: 'fas fa-cogs' },
          ]
        },
        sidebarMenuAdmin: {
          title: 'Área de administración',
          icon: 'fas fa-user-shield',
          child: [
          { href: '/usuario', title: 'Gestión usuarios', icon: 'fas fa-user' }
          ]
        }
      };
    };
  }
}