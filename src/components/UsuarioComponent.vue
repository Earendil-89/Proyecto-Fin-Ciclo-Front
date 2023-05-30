<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Usuario</h4>
        <b-row class="mb-1">
          <b-col>
            <label for="nombreUsuario" class="form-label">Nombre de usuario</label>
            <b-form-input v-model="nombreUsuario" id="nombreUsuario" :state="validField(nombreUsuario)"></b-form-input>
            <b-form-invalid-feedback :state="validField(apellidos)">Debe ingresar un nombre de usuario</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="Email" class="form-label">Email</label>
            <b-form-input v-model="email" id="Email" :state="validField(email)"></b-form-input>
            <b-form-invalid-feedback :state="validField(email)">Debde introducir una dirección de correo electrónico</b-form-invalid-feedback>
          </b-col>
          <b-col cols="3">
            <label for="password" class="form-label">Contraseña</label>
            <div class="d-md-flex">
                <b-form-input v-model="password" id="Password" :state="validField(password)"></b-form-input>
              <b-button class="ml-2" variant="outline-primary" @click="copyPassword"><i class="fas fa-clipboard-list"></i></b-button>
            </div>
            <b-form-invalid-feedback :state="validField(password)">El campo contraseña no puede estar vacio</b-form-invalid-feedback>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <label for="Nombre" class="form-label">Nombre</label>
            <b-form-input v-model="nombre" id="Nombre" :state="validField(nombre)"></b-form-input>
            <b-form-invalid-feedback :state="validField(nombre)">Debe introducir un nombre</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="Apellidos" class="form-label">Apellidos</label>
            <b-form-input v-model="apellidos" id="Apellidos" :state="validField(apellidos)"></b-form-input>
            <b-form-invalid-feedback :state="validField(apellidos)">Debe introducir apellidos</b-form-invalid-feedback>
          </b-col>
        </b-row>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <b-button
            variant="outline-danger"
            class="actionButton"
            v-b-toggle:formCollapse
            @click="reset()"
            ><i class="far fa-times-circle mr-1"></i>Cancelar</b-button
          >
          <b-button
            variant="outline-success"
            type="submit"
            class="actionButton"
            v-b-toggle:formCollapse
            :disabled="!validField(nombre) || !validField(apellidos) || !validField(password) || !validField(email)"
            ><i class="far fa-check-circle mr-1"></i
            >{{ txtBtnForm }}</b-button
          >
        </div>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>

export default {
  name: 'Usuario',
  data() {
    return {
      // -- Campos del usuario
      id: null,
      nombre: '',
      apellidos: '',
      email: '',
      password: '',
      nombreUsuario: '',
      roles: [{id:1, name:'ROLE_USER' },{id:2,name:'ROLE_INSPECTOR'},{id:3,name:'ROLE_ADMIN'}],
      //--------------------
      // -- Campos del componente
      perPage: 10,
      currentPage: 1,
      txtBtnForm: 'Guardar',
      editState: false,
    };
  },
  methods: {
    processForm() {
      if (this.editState == false) {
        var dataSave = {
          nombre: this.nombre,
          apellidos: this.apellidos,
          email: this.email,
          password: this.password,
          nombreUsuario: this.nombreUsuario,
          roles: this.roles
        };

        this.$parent.saveData(dataSave);
      } else {
        var dataUpdate = {
          id: this.id,
          nombre: this.nombre,
          apellidos: this.apellidos,
          email: this.email,
          password: this.password,
          nombreUsuario: this.nombreUsuario,
          roles: this.roles
        };

        this.$parent.updateData(dataUpdate);
      }

      this.reset();
    },
    reset() {
      this.id = null;
      this.nombre = '';
      this.apellidos = '';
      this.password = '';
      this.email = '';
      this.nombreUsuario = '';
      this.txtBtnForm = 'Guardar';
      this.editState = false;
    },
    loadItem(item) {
      this.id = item.id;
      this.nombre = item.nombre;
      this.apellidos = item.apellidos;
      this.email = item.email;
      this.roles = item.roles;
      this.nombreUsuario = item.nombreUsuario;
      this.txtBtnForm = 'Actualizar';
      this.editState = true;
    },
    validField(field) {
      if( field == null )
        return false;

      return field.length > 0;
    },
    copyPassword() {
      navigator.clipboard.writeText(this.password);
      alert('Contraseña copiada al portapapeles.');
    },
  },
  computed: {
  },
  mounted() {
  },
  components: {
  }
};
</script>
