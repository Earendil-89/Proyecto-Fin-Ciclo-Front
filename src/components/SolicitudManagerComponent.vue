<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Solicitud</h4>
        <b-row class="mb-3">
          <b-col cols="2">
            <label for="codigo-recipiente" class="form-label">Código del recipiente</label>
            <b-form-input v-model="codigoRecipiente" id="show-data" disabled="true"></b-form-input>
          </b-col>
          <b-col>
            <label for="link" class="form-label">Usuario</label>
            <b-form-input v-model="fullUserName" id="show-data" disabled="true"></b-form-input>
          </b-col>
          <b-col>
            <label for="link" class="form-label">Fecha de la solicitud</label>
            <b-form-datepicker v-model="fechaSolicitud" id="show-data" disabled="true"></b-form-datepicker>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <label for="descripcion" class="form-label">Descripción de la solicitud</label>
            <b-form-textarea v-model="descripcion" id="show-data" disabled="true"></b-form-textarea>
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
    name: 'Solicitud-Manager',
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
        this.id = null;
        this.fechaSolicitud = null;
        this.usuarioSolicitud = null;
        this.fechaTramite = null;
        this.usuarioTramite = null;
        this.estado = null;
        this.codigoRecipiente = '';
        this.descripcion = '';
        this.link = '';
        this.txtBtnForm = 'Guardar';
        this.editState = false;
      },
      loadItem(item) {
        this.id = item.id;
        this.fechaSolicitud = item.fechaSolicitud;
        this.usuarioSolicitud = item.usuarioSolicitud;
        this.fechaTramite = item.fechaTramite;
        this.usuarioTramite = item.usuarioTramite;
        this.estado = item.estado;
        this.codigoRecipiente = item.codigoRecipiente;
        this.descripcion = item.descripcion;
        this.link = item.link;
        this.txtBtnForm = 'Actualizar';
        this.editState = true;
      },
      validField(element) {
        return element != null && element.length > 0;
      }
    },
    computed: {
      fullUserName() {
        return this.usuarioSolicitud.apellidos + ', ' + this.usuarioSolicitud.nombre;
      }
    },
    mounted() {
    },
    components: {
    }
  };
</script>

<style scoped>
#show-data
{
  background-color: rgba(0, 255, 170, 0.281);
}
</style>