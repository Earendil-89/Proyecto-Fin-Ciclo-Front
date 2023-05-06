<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Frases</h4>
        <b-row class="mb-3">
          <b-col cols="2">
              <label for="codigo" class="form-label">Código</label>
              <b-form-input v-model="codigo" id="codigo" :state="validField(codigo)"></b-form-input>
              <b-form-invalid-feedback :state="validField(codigo)">Debe introducir un código</b-form-invalid-feedback>
          </b-col>
          <b-col>
              <label for="descripcion" class="form-label">Descripción</label>
              <b-form-input v-model="descripcion" id="descripcion" :state="validField(descripcion)"></b-form-input>
              <b-form-invalid-feedback :state="validField(descripcion)">Debe introducir un código</b-form-invalid-feedback></b-col>
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
    name: 'Frase',
    data() {
      return {
        codigo: '',
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
            codigo: this.codigo,
            descripcion: this.descripcion
          };
  
          this.$parent.saveData(dataSave);
        } else {
          var dataUpdate = {
            codigo: this.codigo,
            descripcion: this.descripcion
          };
  
          this.$parent.updateData(dataUpdate);
        }
  
        this.reset();
      },
      reset() {
        this.id = '';
        this.Number = '';
        this.txtBtnForm = 'Guardar';
        this.editState = false;
      },
      loadItem(item) {
        this.id = item.id;
        this.Number = item.Number;
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