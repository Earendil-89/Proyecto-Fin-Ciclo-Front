export default {
  install(Vue) {
    Vue.prototype.$constants = () => {
      return {
        VERSION: '1.0.0',
        pruebaTableFields:[
          { key: 'Number', label: 'Number', sortable: true },
          { key: 'action', label: '', thStyle: { width: '120px'} }
        ],
      };
    };
  }
}