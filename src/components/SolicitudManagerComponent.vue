<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Solicitud</h4>
        <b-row class="mb-3">
          <b-col cols="2">
            <label for="codigo-recipiente" class="form-label">Código del recipiente</label>
            <b-form-input v-model="codigoRecipiente" id="show-data" :disabled="true"></b-form-input>
          </b-col>
          <b-col>
            <label for="link" class="form-label">Usuario</label>
            <b-form-input v-model="fullUserName" id="show-data" :disabled="true"></b-form-input>
          </b-col>
          <b-col>
            <label for="link" class="form-label">Fecha de la solicitud</label>
            <b-form-input v-model="fechaSolicitudForm" id="show-data" :disabled="true"></b-form-input>
          </b-col>
          <b-col>
            <label for="link" class="form-label">Estado de la solicitud</label>
            <b-form-select v-model="estado" :options="listEstados" id="formEstado"></b-form-select>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <label for="descripcion" class="form-label">Descripción de la solicitud</label>
            <b-form-textarea v-model="descripcion" id="show-data" :disabled="true"></b-form-textarea>
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
        //--------------------
        listEstados: [
          { value: 'ESTADO_ESPERA', text: 'Esperando trámite' },
          { value: 'ESTADO_ACEPTADA', text: 'Aceptada' },
          { value: 'ESTADO_DENEGADA', text: 'Denegada' }
        ]
      };
    },
    methods: {
      processForm() {
        if (this.editState == false) {
          this.reset();
          return;
        } else {
          var dataUpdate = {
            id: this.id,
            estado: this.estado,
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
        if( this.usuarioSolicitud == null ) {
          return '';
        }
        return this.usuarioSolicitud.apellidos + ', ' + this.usuarioSolicitud.nombre;
      },
      fechaSolicitudForm() {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
        const date = new Date(this.fechaSolicitud);
        return date.toLocaleDateString('es-ES', options);
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