<template>
  <div>
    <b-collapse id="childFormCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Armarios</h4>
        <b-col class="mb-3">
          <b-row>
            <label for="nombre" class="form-label">Código</label>
            <b-form-input v-model="nombre" id="nombre" :state="validField(nombre)"></b-form-input>
            <b-form-invalid-feedback :state="validField(nombre)">Debe introducir un nombre</b-form-invalid-feedback>
          </b-row>
          <b-row class="mt-4">
            <label for="descripcion" class="form-label">Descripción</label>
            <b-form-input v-model="descripcion" id="descripcion" :state="validField(descripcion)"></b-form-input>
            <b-form-invalid-feedback :state="validField(descripcion)">Debe introducir una descripcion</b-form-invalid-feedback>
          </b-row>
        </b-col>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <b-button
            variant="outline-danger"
            class="actionButton"
            v-b-toggle:childFormCollapse
            @click="reset()"
            ><i class="far fa-times-circle mr-1"></i>Cancelar</b-button
          >
          <b-button
            variant="outline-success"
            type="submit"
            class="actionButton"
            v-b-toggle:childFormCollapse
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
    name: 'Estante',
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
            nomre: this.nombre,
            descripcion: this.descripcion
          };
  
          this.$parent.saveChildData(dataSave);
        } else {
          var dataUpdate = {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion
          };
  
          this.$parent.updateChildData(dataUpdate);
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
      }
    },
    computed: {
    },
    mounted() {
    },
    components: {
    }
  };
</script>