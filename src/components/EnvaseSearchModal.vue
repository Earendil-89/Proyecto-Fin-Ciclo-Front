<template>
  <div>
    <b-row class="mx-3 mb-3">
      <b-col>
        <label for="descripcion" class="form-label">Nombre del reactivo</label>
        <b-form-input v-model="nombre" id="descripcion" :state="validateAllFields"></b-form-input>
        <b-form-invalid-feedback :state="validateAllFields">Rellene un campo del formulario</b-form-invalid-feedback>
      </b-col>
      <b-col cols="3">
        <label for="codigo" class="form-label">Código del envase</label>
        <b-form-input v-model="codigo" id="codigo" :state="validateAllFields"></b-form-input>
        <b-form-invalid-feedback :state="validateAllFields">Rellene un campo del formulario</b-form-invalid-feedback>
      </b-col>
    </b-row>
    <b-row class="mx-3 mb-2">
      <b-col class="mr-4">
        <label for="compuesto-nombre" class="form-label">Compuesto químico</label>
        <b-row>
          <b-col>
            <b-alert show :variant="alertVariant" class="py-2"> {{ compuesto.cas + ' ---- ' + compuesto.nombre }}</b-alert>
            <b-form-invalid-feedback :state="compuesto != null">Debe especificar el compuesto químico</b-form-invalid-feedback>
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
            <b-col cols="1">
            <b-button
              variant="danger"
              v-if="!selectCompuestoState"
              @click="resetCompuesto"
            >
              <i class="fas fa-times"></i>
            </b-button>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="3">
        <label for="descripcion" class="form-label">Pureza mínima</label>
        <b-form-input v-model="pureza" id="descripcion" type="number" min="0.0" max="100.0" step="any"></b-form-input>            
      </b-col>
    </b-row>
    <b-row class="mx-1">
      <b-col>
        <b-button
          variant="primary"
          class="mt-1 actionButton"
          @click="searchAction"
          :disabled="!validateAllFields"
        >
          <i class="fas fa-search"></i>
          Buscar reactivo
        </b-button>
      </b-col>
      <b-col cols="10">
        <b-input-group class="mt-1">
          <b-form-input
            v-model="filterSearch"
            placeholder="Buscar..."
            class="ml-1 mr-1 shadow-sm"
            type="search"
          ></b-form-input>
          <b-pagination
            class="ml-2 mr-2 shadow-sm"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="mainTable"
          ></b-pagination>
        </b-input-group>
      </b-col>
    </b-row>
    <!-- Tabla de búsqueda de compuestos químicos -->
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
      <div class="mt-2 overflow-auto">
      <b-table
        class="shadow-sm"
        style="font-size:90%;"
        responsive
        id="mainTable"
        :busy="busy"
        :filter="filterSearch"
        :total-rows="rows"
        :fields="mainTableFields"
        :items="items"
        :per-page="perPage"
        :current-page="currentPage"
        hover
        small
      >
        <!-- Table templates ---------------------------------------------------->
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>
        <template #cell(containerCapacity)="row" align="center">
          {{ row.item.propiedades.capacidad + ' ' + convertUnidades(row.item.propiedades.unidades) }}
        </template>
        <template #cell(containerAmount)="row" align="center">
          <p class="text-center mr-3">{{ row.item.cantidad + ' ' + convertUnidades(row.item.propiedades.unidades) }}</p>
          <b-progress
          class="mr-3"
            :value="row.item.cantidad"
            :max="row.item.propiedades.capacidad"
            :variant="getPBarVariant(row.item.cantidad, row.item.propiedades.capacidad)"
          >
          </b-progress>
        </template>
        <template #cell(image_envaseProp)="row" align="center">
          <img :src='row.item.propiedades.compuesto.imgUrl' height="64">
        </template>
        <template #cell(capacidad)="row" align="left">
          {{ row.item.capacidad + ' ' + convertUnidades(row.item.unidades) }}
        </template>
        <template #cell(pureza)="row" align="center">
          {{ row.item.pureza }}%
        </template>
        <template #cell(action)="row" align="center" style="padding: 0px 0px 0px 0px; margin:0px 0px 0px 0px" >
          <b-button-group align="center" size="sm" style="padding: 0px 0px 0px 0px; margin:0px 0px 0px 0px" >
            <b-button
              size="sm"
              variant="outline-info"
              @click="row.toggleDetails"
              class="actionButton ml-1"
              ><i class="fas fa-info"></i>
              {{ row.detailsShowing ? '' : '' }}
            </b-button>
            <b-button
              size="sm"
              variant="outline-success"
              @click="sendExtraction(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-upload fa-2x"></i></b-button>
            <b-button
              size="sm"
              variant="outline-warning"
              @click="showSecurity(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-exclamation-triangle fa-2x"></i></b-button>
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
    </div>
  </div>
</template>

<script>
import ClabtoolService from '../services/clabtool.service';
import VueJsonPretty from 'vue-json-pretty';
import Vue from 'vue';
import Constants from '../plugins/Constants';
Vue.use(Constants);

export default {
  data() {
    return {
      id: null,
      codigo: '',
      nombre: '',
      pureza: '',
      razonUso: '',
      compuesto: {
        id: 0,
        cas: '',
        nombre: 'Elija un compuesto químico'
      },
      // -- Variables de los resultados de la búsqueda de envases
      items: [],
      mainTableFields: [
        { key: 'propiedades.codigo', label: 'Codigo' },
        { key: 'propiedades.nombre', label: 'Nombre' },
        { key: 'propiedades.pureza', label: 'Pureza' },
        { key: 'containerAmount', label: 'Cantidad', thStyle: { width: '180px' } },
        { key: 'image_envaseProp', label: 'Imagen', thStyle: { width: '100px'} },
        { key: 'action', label: '', 'thStyle': { width: '120px' } }
      ],
      // -- Variables de la búsqueda de compuestos químicos
      selectCompuestoState: false,
      compuestoItems: null,
      compuestoTableFields: [
        { key: 'cas', label: 'Número CAS', sortable: true, thStyle: { width: '120px' } },
        { key: 'nombre', label: 'Nombre', sortable: true},
        { key: 'image', label: 'Imagen', thStyle: { width: '96px' } },
        { key: 'action', label: '', thStyle: { width: '80px' } }
      ],
      // -- Paginación y búsqueda
      busy: false,
      filterSearch: '',
      filterSearchCompuesto: '',
      perPage: 10,
      perPageCompuesto: 10,
      currentPage: 1,
      currentPageCompuesto: 1
    }
  },
  methods: {
    showSelectionCompuesto() {
      this.selectCompuestoState = true;
      this.getCompuestos();
    },
    getCompuestos() {
    ClabtoolService.getData('compuesto')
      .then(data => {
        this.compuestoItems = data;
      })
      .catch(error =>this.$emit('onError', error));
    },
    sendCompuesto(compuesto) {
      this.compuesto = compuesto;
      this.compuestoItems = [];
      this.selectCompuestoState = false;
    },
    searchAction() {
      let query = '';
      let symbol = '?';
      if( this.compuesto.id != 0 ) {
        query = symbol + 'compuestoId=' + this.compuesto.id;
        symbol = '&';
      } if( this.codigo != '' ) {
        query += symbol + 'codigo=' + this.codigo;
        symbol = '&';
      } if( this.nombre != '' ) {
        query += symbol + 'nombre=' + this.nombre;
        symbol = '&';
      } if( this.pureza != '' ) {
        query += symbol + 'pureza=' + this.pureza
      }

      ClabtoolService.getData('user/envase' + query)
        .then(data => {
          this.items = data;
        })
        .catch(error =>this.$emit('onError', error));
    },
    resetCompuesto() {
      this.compuesto = {
        id: 0,
        cas: '',
        nombre: ''
      };
    },
    convertUnidades(unidades) {
      switch( unidades.unidad ) {
        case 'UNIDAD_MICROLITROS': return 'ul';
        case 'UNIDAD_MILILITROS': return 'ml';
        case 'UNIDAD_LITROS': return 'l';
        case 'UNIDAD_MILIGRAMOS': return 'mg';
        case 'UNIDAD_GRAMOS': return 'g';
        case 'UNIDAD_KILOGRAMOS': return 'kg';
        default: return '';
      }
    },
    getPBarVariant(cantidad, capacidad) {
      if( cantidad == capacidad ) {
        return null;
      }
      if( cantidad > capacidad / 2 ) {
        return 'success';
      }
      if( cantidad > capacidad / 4 ) {
        return 'warning';
      }
      return 'danger';
    },
    sendExtraction(element) {
      this.$emit('onSelect', element.id);
    },
  },
  computed: {
    validateAllFields() {
      return this.compuesto.cas != '' || this.codigo != '' || this.nombre != '';
    },
    alertVariant() {
      return this.validateAllFields ? 'success' : 'danger';
    },
    rows() {
      return this.items.length;
    },
  },
  mounted() {

  },
  components: {
    VueJsonPretty
  }
}
</script>