<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Búsqueda de reactivos</h4>
        <b-row class="mb-3">
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
          <b-col cols="3">
              <label for="codigo" class="form-label">Código del envase</label>
              <b-form-input v-model="codigo" id="codigo" :state="validateAllFields"></b-form-input>
              <b-form-invalid-feedback :state="validateAllFields">Rellene un campo del formulario</b-form-invalid-feedback>
          </b-col>
          <b-col cols=3>
              <label for="descripcion" class="form-label">Nombre del reactivo</label>
              <b-form-input v-model="nombre" id="descripcion" :state="validateAllFields"></b-form-input>
              <b-form-invalid-feedback :state="validateAllFields">Rellene un campo del formulario</b-form-invalid-feedback>
            </b-col>
            <b-col cols="2">
              <label for="descripcion" class="form-label">Pureza mínima</label>
              <b-form-input v-model="pureza" id="descripcion" type="number" min="0.0" max="100.0" step="any"></b-form-input>            
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
            ><i class="fas fa-search mr-1"></i
            >Buscar</b-button
          >
        </div>
      </b-form>
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
    </b-collapse>
    <b-modal
      id="modal-extraccion"
      title="Retirar envase"
      size="lg"
    >
      <b-form-textarea
        id="extraccion-textarea"
        v-model=razonUso
        placeholder="(Opcional) Indique motivo de uso"
        rows="3"
        maxRows="10"
        @ok="sendExtraction"
        @cancel="reset"
        @close="reset"></b-form-textarea>
  </b-modal>
  </div>
</template>
  
<script>
  import axios from 'axios';
  export default {
    name: 'Frase',
    data() {
      return {
        id: null,
        codigo: '',
        nombre: '',
        pureza: '',
        compuesto: {
          cas: '',
          nombre: 'Elija un compuesto químico'
        },
        // -- Seccion de la seleccion del compuesto quimico
        filterSearchCompuesto: '',
        compuestoItems: null,
        compuestoTableFields: [
          { key: 'cas', label: 'Número CAS', sortable: true, thStyle: { width: '120px' } },
          { key: 'nombre', label: 'Nombre', sortable: true},
          { key: 'image', label: 'Imagen', thStyle: { width: '96px' } },
          { key: 'action', label: '', thStyle: { width: '80px' } }
        ],
        selectCompuestoState: false,
        //--------------------
        perPage: 10,
        currentPage: 1,
        //---------------------
        razonUso: ''
      };
    },
    methods: {
      processForm() {
        var dataSearch = {
          compuesto: this.compuesto.id == null ? 0 : this.compuesto.id,
          codigo: this.codigo,
          nombre: this.nombre,
          pureza: this.pureza
        };
        this.$parent.searchCompuestos(dataSearch);
        this.reset();
      },
      reset() {
        this.id = null;
        this.codigo = '',
        this.nombre = '';
        this.pureza = '',
        this.compuesto = {
          cas: '',
          nombre: 'Debe elegir un compuesto químico'
        };

        this.selectCompuestoState = false;
      },
      validField(element) {
        return element != null && element.length > 0;
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
      showExtraction(id) {
        this.id = id;
        this.razonUso = '';
        this.$root.$emit('bv::show::modal', 'modal-extraccion');  
      }
    },
    computed: {
      alertVariant() {
        return this.validateAllFields ? 'success' : 'danger';
      },
      validateAllFields() {
        return this.compuesto.cas != '' || this.codigo != '' || this.nombre != '';
      }
    },
    mounted() {
    },
    components: {
    }
  };
</script>