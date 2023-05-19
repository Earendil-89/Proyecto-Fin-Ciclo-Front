<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Datos envase</h4>
        <b-row class="mb-1">
          <b-col cols="2">
            <label for="codigo" class="form-label">Código</label>
            <b-form-input v-model="codigo" id="codigo" :state="validField(codigo)"></b-form-input>
            <b-form-invalid-feedback :state="validField(codigo)">Debe introducir un código</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="nombre" class="form-label">Nombre</label>
            <b-form-input v-model="nombre" id="nombre" :state="validField(nombre)"></b-form-input>
            <b-form-invalid-feedback :state="validField(nombre)">Debe indicar el nombre del envase </b-form-invalid-feedback>
          </b-col>
          <b-col cols="2">
            <label for="pureza" class="form-label">Pureza (%)</label>
              <b-form-input v-model="pureza" id="pureza" type="number" min="0.0" max="100.0" step="any"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="2">
            <label for="capacidad" class="form-label">Capacidad</label>
            <b-form-input v-model="capacidad" id="Email" type="number" min="0.0" :state="validField(capacidad)"></b-form-input>
            <b-form-invalid-feedback :state="validField(capacidad)">Debde introducir la capacidad de producto</b-form-invalid-feedback>
          </b-col>
          <b-col cols="2">
            <label for="unidades" class="form-label">Unidades</label>
            <b-form-select v-model="unidades" :options="listUnidades" id="unidades" :state="unidades != null"></b-form-select>
            <b-form-invalid-feedback :state="unidades != null">Debde especificar las unidades</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="compuesto-nombre" class="form-label">Compuesto químico</label>
            <b-row>
              <b-col>
                <b-alert show :variant="alertVariant" class="py-2"> {{ compuesto.cas + ' ---- ' + compuesto.nombre }}</b-alert>
                <b-form-invalid-feedback :state="compuesto != null">Debde especificar el compuesto químico</b-form-invalid-feedback>
              </b-col>
              <b-col cols="1">
                <b-button
                  variant="primary"
                  v-if="!selectCompuestoState"
                  @click="showSelectionCompuesto"
                >
                  <i class="fas fa-search"></i>
                </b-button>
              </b-col>
              <b-col cols="2"></b-col>
            </b-row>
          </b-col>         
        </b-row>
        <b-row>
          <b-col cols="3">
            <b-button
              variant="outline-primary"
              class="actionButton"
              @click="modalEtiquetas"
            >
            <i class="fas fa-exclamation-circle"></i> Etiquetado de seguridad
            </b-button>
          </b-col>
          <b-col cols="3">
            <b-button
              variant="outline-primary"
              class="actionButton"
              @click="modalFrases"
            >
            <i class="fas fa-exclamation-circle"></i> Frases de seguridad
            </b-button>
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
            :disabled="!validField(codigo) || !validField(nombre) || !validField(capacidad) || unidades == null || alertVariant === 'danger'"
            ><i class="far fa-check-circle mr-1"></i
            >{{ txtBtnForm }}</b-button
          >
        </div>
      </b-form>
    </b-collapse>
    <b-card style="background-color: beige;" class="mt-3" v-if="selectCompuestoState">
     <h5>Elija compuesto químico</h5>
     <div>
        <b-input-group class="mt-1">
          <b-form-input
            v-model="filterSearchCompuesto"
            placeholder="Search..."
            class="ml-1 mr-1 shadow-sm"
            type="search"
          ></b-form-input>
          <b-pagination
            class="ml-2 mr-2 shadow-sm"
            v-model="currentPageCompuesto"
            :total-rows="rows"
            :per-page="perPageCompuesto"
            aria-controls="compuestoTable"
          ></b-pagination>
          <b-form @submit.prevent="getCompuestos()">
            <b-button variant="primary" type="submit" class="actionButton"
              ><i class="fas fa-sync"></i
            ></b-button>
          </b-form>
        </b-input-group>
      </div>
      <!-- Results -------------------------------------------------------------->
      <b-table
        class="shadow-sm"
        style="font-size:85%;"
        responsive
        id="mainTable"
        :busy="busy"
        :filter="filterSearchCompuesto"
        :total-rows="rows"
        :fields="compuestoTableFields"
        :items="compuestoItems"
        :per-page="perPage"
        :current-page="currentPage"
        hover
        small
      >
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>
        <template #cell(image)="row" align="center">
          <img :src='row.item.imgUrl' height="64">
        </template>
        <template #cell(action)="row" align="center" style="padding: 0px 0px 0px 0px; margin:0px 0px 0px 0px" >
          <b-button-group align="center" size="lg" style="padding: 0px 0px 0px 0px; margin:0px 0px 0px 0px" >
            <b-button
              size="lg"
              variant="outline-info"
              @click="row.toggleDetails"
              class="actionButton ml-1"
              ><i class="fas fa-info"></i>
              {{ row.detailsShowing ? '' : '' }}
            </b-button>
            <b-button
              size="lg"
              variant="outline-info"
              @click="sendCompuesto(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-check"></i>
            </b-button>
          </b-button-group>
        </template>
        <template #row-details="row">
          <b-card>
            <vue-json-pretty
              :showDoubleQuotes="false"
              :showIcon="true"
              :data="row.item"
            />
          </b-card>
        </template>
      </b-table>
    </b-card>
    <b-modal
      id="modal-frases"
      title="Frases de seguridad"
      size="lg"
    >
      <SeguridadModal
        type="frase"
        :tableFields="fraseTableFields"
        v-model="frases"
      ></SeguridadModal>
    </b-modal>
    <b-modal
      id="modal-etiquetas"
      title="Frases de seguridad"
      size="lg"
    >
      <SeguridadModal
        type="etiqueta"
        :tableFields="etiquetaTableFields"
        v-model="etiquetas"
      ></SeguridadModal>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import VueJsonPretty from 'vue-json-pretty';
import SeguridadModal from './SeguridadModal.vue';

export default {
  name: 'EnvaseProp',
  data() {
    return {
      // -- 
      id: null,
      codigo: '',
      nombre: '',
      pureza: '',
      capacidad: '',
      unidades: null,
      compuesto: {
        cas: '',
        nombre: 'Debe elegir un compuesto químico'
      },
      frases: [],
      etiquetas: [],
      // -- Campos del componente
      perPage: 10,
      currentPage: 1,
      txtBtnForm: 'Guardar',
      editState: false,
      // -- Lista de unidades
      listUnidades: null,
      // -- Seccion de la seleccion del compuesto quimico
      filterSearchCompuesto: '',
      compuestoTableFields: [
        { key: 'cas', label: 'Número CAS', sortable: true, thStyle: { width: '120px' } },
        { key: 'nombre', label: 'Nombre', sortable: true},
        { key: 'image', label: 'Imagen', thStyle: { width: '96px' } },
        { key: 'action', label: '', thStyle: { width: '80px' } }
      ],
      fraseTableFields: [
        { key: 'codigo', label: 'Código', sortable: true, thStyle: { width: '100px' } },
        { key: 'descripcion', label: 'Descripción', sortable: true }
      ],
      etiquetaTableFields: [
        { key: 'codigo', label: 'Código', sortable: true },
        { key: 'descripcion', label: 'Descripción', sortable: true },
        { key: 'image', label: 'Imagen', thStyle: { width: '100px'} },      
      ],
      selectCompuestoState: false,
      compuestoItems: [],
      perPageCompuesto: 5,
      currentPageCompuesto: 1,
      busy: false
    };
  },
  methods: {
    processForm() {
      if (this.editState == false) {
        var dataSave = {
          codigo: this.codigo,
          nombre: this.nombre,
          pureza: this.pureza,
          capacidad: this.capacidad,
          unidades: this.unidades,
          compuesto: this.compuesto,
          frases: this.frases,
          etiquetas: this.etiquetas
        };

        this.$parent.saveData(dataSave);
      } else {
        var dataUpdate = {
          id: this.id,
          codigo: this.codigo,
          nombre: this.nombre,
          pureza: this.pureza,
          capacidad: this.capacidad,
          unidades: this.unidades,
          compuesto: this.compuesto,
          frases: this.frases,
          etiquetas: this.etiquetas
        };

        this.$parent.updateData(dataUpdate);
      }

      this.reset();
    },
    reset() {
      this.id = null;
      this.codigo = '';
      this.nombre = '';
      this.pureza = '';
      this.capacidad = '';
      this.unidades = null;
      this.compuesto = { cas: '', nombre: 'Debe elegir un compuesto químico' };
      this.selectCompuestoState = false;
      this.frases = [];
      this.etiquetas = [];

      this.txtBtnForm = 'Guardar';
      this.editState = false;
    },
    loadItem(item) {
      this.id = item.id;
      this.codigo = item.codigo;
      this.nombre = item.nombre;
      this.pureza = item.pureza;
      this.capacidad = item.capacidad;
      this.unidades = item.unidades;
      this.compuesto = item.compuesto;
      this.frases = item.frases;
      this.etiquetas = item.etiquetas;
      this.selectCompuestoState = false;

      this.txtBtnForm = 'Actualizar';
      this.editState = true;
    },
    validField(field) {
      if( field === null )
        return false;

      if( typeof field == 'number' )
        return true;

      return field.length > 0;
    },
    showSelectionCompuesto() {
      this.selectCompuestoState = true;
      this.getCompuestos();
    },
    getCompuestos() {
    return axios
      .get('http://localhost:9099/api/clabtool/' + 'compuesto', {
      }).then(response => {
        this.compuestoItems = response.data;
      }).catch(error => this.$parent.catchError(error));
    },
    sendCompuesto(compuesto) {
      this.compuesto = compuesto;
      this.compuestoItems = [];
      this.selectCompuestoState = false;
    },
    modalFrases(button) {
      this.$root.$emit('bv::show::modal', 'modal-frases', button);
    },
    modalEtiquetas(button) {
      this.$root.$emit('bv::show::modal', 'modal-etiquetas', button);     
    },
    generateListUnidades(data) {
      this.listUnidades = [ { value: null, text: 'Elija una opción' } ];
      for( let i = 0; i < data.length; i++ ) {
        this.listUnidades.push(
          { value: data[i], text: data[i].nombre }
        );
      }
    }
  },
  computed: {
    rows() {
      return this.compuestoItems.length;
    },
    alertVariant() {
      return this.compuesto.id == null ? 'danger' : 'success';
    }
  },
  mounted() {
  },
  components: {
    SeguridadModal,
    VueJsonPretty
  }
};
</script>
