<template>
  <div><h4>Bienvenido {{ valor }}</h4></div>
</template>

<script>
import ClabtoolService from '../services/clabtool.service';
export default {
  name: 'Home',
  data() {
    return {
      valor: ''
    };
  },
  methods: {
    getData() {
      let name = this.$store.state.auth.user.username;
      if( name == null ) {
        return;
      }
      ClabtoolService.getData('usuario/nombre?nombreUsuario=' + name)
            .then(data => {
              if( data != null && data != '' ) {
                this.valor = data;
              }  
            })
            .catch(error => this.$parent.catchError(error)); 

    }
  },
  computed: {
  },
  mounted() {
    this.getData();
  },
  components: {
  }
};
</script>
