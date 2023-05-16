<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Solicitud</h4>
        <b-row class="mb-3">
          <b-col cols="2">
            <label for="codigo-recipiente" class="form-label">Código del recipiente</label>
            <b-form-input v-model="codigoRecipiente" id="codigo-recipiente" :state="validField(codigoRecipiente)"></b-form-input>
            <b-form-invalid-feedback :state="validField(codigoRecipiente)">Debe introducir un código</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="link" class="form-label">Link al envase</label>
            <b-form-input v-model="link" id="link"></b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <label for="descripcion" class="form-label">Descripción de la solicitud</label>
            <b-form-textarea v-model="descripcion" id="descripcion" :state="validField(descripcion)"></b-form-textarea>
            <b-form-invalid-feedback :state="validField(descripcion)">Especifique una descripción</b-form-invalid-feedback>
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
    name: 'Solicitud',
    data() {
      return {
        id: null,
        fechaSolicitud: null,
        usuarioSolicitud: '',
        fechaTramite: null,
        usuarioTramite: null,
        estado: '',
        descripcion: '',
        codigoRecipiente: '',
        link: '',
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
            fechaSolicitud: new Date(),
            usuarioSolicitud: 1,
            fechaTramite: null,
            usuarioTramite: null,
            estado: 'ESTADO_ESPERA',
            descripcion: this.descripcion,
            codigoRecipiente: this.codigoRecipiente,
            link: this.link
          };
  
          this.$parent.saveData(dataSave);
        } else {
          var dataUpdate = {
            id: this.id,
            fechaSolicitud: this.fechaSolicitud,
            usuarioSolicitud: this.usuarioSolicitud,
            fechaTramite: null,
            usuarioTramite: null,
            estado: 'ESTADO_ESPERA',
            descripcion: this.descripcion,
            codigoRecipiente: this.codigoRecipiente,
            link: this.link
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