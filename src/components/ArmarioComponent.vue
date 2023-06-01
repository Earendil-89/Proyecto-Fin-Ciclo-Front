<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Armarios</h4>
        <b-row class="mb-3">
          <b-col cols="2">
            <label for="nombre" class="form-label">Código</label>
            <b-form-input v-model="nombre" id="nombre" :state="validField(nombre)"></b-form-input>
            <b-form-invalid-feedback :state="validField(nombre)">Debe introducir un nombre</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="descripcion" class="form-label">Descripción</label>
            <b-form-input v-model="descripcion" id="descripcion" :state="validField(descripcion)"></b-form-input>
            <b-form-invalid-feedback :state="validField(descripcion)">Debe introducir una descripcion</b-form-invalid-feedback>
          </b-col>
        </b-row>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <b-button
            variant="outline-danger"
            class="actionButton"
            v-b-toggle:formCollapse
            @click="reset()"
            ><i class="far fa-times-circle mr-1"></i>Cancelar</b-button>
          <b-button
            variant="outline-success"
            type="submit"
            class="actionButton"
            v-b-toggle:formCollapse
            ><i class="far fa-check-circle mr-1"></i
            >{{ txtBtnForm }}</b-button>
        </div>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
  export default {
    name: 'Armario',
    data() {
      return {
        id: null,
        nombre: '',
        descripcion: '',
        //--------------------
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
            descripcion: this.descripcion
          };
  
          this.$parent.saveData(dataSave);
        } else {
          var dataUpdate = {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion
          };
  
          this.$parent.updateData(dataUpdate);
        }
  
        this.reset();
      },
      reset() {
        this.id = null;
        this.nombre = '';
        this.descripcion = '';

        this.txtBtnForm = 'Guardar';
        this.editState = false;
      },
      loadItem(item) {
        this.id = item.id;
        this.nombre = item.nombre;
        this.descripcion = item.descripcion;

        this.txtBtnForm = 'Actualizar';
        this.editState = true;
      },
      validField(element) {
        return element != null && element.length > 0;
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