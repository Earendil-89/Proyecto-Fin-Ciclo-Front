<template>
    <div>
      <b-collapse id="formCollapse">
        <b-form @submit.prevent="processForm">
          <h4 class="mt-4 mb-3">Envase</h4>
          <b-row class="mb-1">
            <b-col cols="3" class="mr-5">
              <label for="compuesto-nombre" class="form-label">Código envase</label>
              <b-row>
                <b-col>
                  <b-alert show :variant="alertVariant" class="py-2"> {{ showCodigo }}</b-alert>
                </b-col>
                <b-col cols="1">
                  <b-button
                    variant="primary"
                    v-if="!selectPropState"
                    @click="showEnvaseProps"
                  >
                    <i class="fas fa-search"></i>
                  </b-button>
                </b-col>
              </b-row>
            </b-col>  
            <b-col>
              <label for="nombre" class="form-label">Cantidad</label>
              <b-form-input v-model="cantidad" id="cantidad" :state="validNumber(cantidad)" type="number" min="0.0" step="any" :max="getMax"></b-form-input>
              <b-form-invalid-feedback :state="validNumber(cantidad)">Debe indicar un valor válido </b-form-invalid-feedback>
            </b-col>
            <b-col>
              <label for="armario" class="form-label">Armario</label>
              <b-form-select
              id="armario"
              v-model="armario"
              :options="listArmarios"
              @input="findEstantes"
              ></b-form-select>
            </b-col>
            <b-col>
              <label for="estante" class="form-label">Estante</label>
              <b-form-select
                id="estante"
                v-model="estante"
                :options="listEstantes"
                :state="validObj(estante)"
              />
              <b-form-invalid-feedback :state="validObj(estante)">Debe especificar un almacenamiento</b-form-invalid-feedback>
            </b-col>
            <b-col>
              <label for="pedido" class="form-label">Pedido</label>
              <b-form-select
                id="pedido"
                v-model="pedido"
                :options="listPedidos"
              />
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <label class="form-label">Capacidad</label>
              <b-form-input v-model="showCapacidad" id="show-data" :disabled="true"></b-form-input>
            </b-col>
            <b-col>
              <label class="form-label">Unidades</label>
              <b-form-input v-model="showUnidades" :options="listUnidades" id="show-data" :disabled="true"></b-form-input>
            </b-col>
            <b-col>
              <label class="form-label">Pureza (%)</label>
                <b-form-input v-model="showPureza" id="show-data" :disabled="true"></b-form-input>
            </b-col>
            <b-col>
              <label class="form-label">Cas compuesto</label>
                <b-form-input v-model="showCas" id="show-data" :disabled="true"></b-form-input>
            </b-col>   
            <b-col>
              <label class="form-label">Nombre compuesto</label>
                <b-form-input v-model="showNombre" id="show-data" :disabled="true"></b-form-input>
            </b-col>   
            <b-col cols="3">
              <label>Seguridad</label>
              <b-row>
                <b-col>
                  <b-button
                    variant="outline-success"
                    class="actionButton"
                    @click="modalEtiquetas"
                  >
                  <i class="fas fa-search"></i> Ver etiquetas
                  </b-button>
                  </b-col>
                  <b-col>
                    <b-button
                      variant="outline-success"
                      class="actionButton"
                      @click="modalFrases"
                    >
                    <i class="fas fa-search"></i> Ver frases
                    </b-button>
                  </b-col>
                </b-row>   
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
              :disabled="!validObj(estante) || !validNumber(cantidad) || !validObj(propiedades)"
              ><i class="far fa-check-circle mr-1"></i
              >{{ txtBtnForm }}</b-button
            >
          </div>
        </b-form>
      </b-collapse>
      <b-card style="background-color: beige;" class="mt-3" v-if="selectPropState">
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
          :fields="envasePropTableFields"
          :items="envasePropItems"
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
                @click="sendProp(row.item)"
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
          :showOnly="true"
          v-model="getFrases"
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
          :showOnly="true"
          v-model="getEtiquetas"
        ></SeguridadModal>
      </b-modal>
    </div>
  </template>
  
  <script>
  import VueJsonPretty from 'vue-json-pretty';
  import SeguridadModal from './SeguridadModal.vue';
  import ClabtoolService from '../services/clabtool.service';
  
  export default {
    name: 'EnvaseProp',
    data() {
      return {
        // -- 
        id: null,
        cantidad: '',
        disponible: false,
        armario: null,
        estante: null,
        propiedades: null,
        pedido: null,
        // -- Campos del componente
        perPage: 10,
        currentPage: 1,
        txtBtnForm: 'Guardar',
        editState: false,
        // -- Lista de unidades
        listUnidades: [ 
          { value: null, text: 'Elija una opción' },
          { value: 'UNIDAD_MICROLITROS', text: 'Microlitros'},
          { value: 'UNIDAD_MILILITROS', text: 'Mililitros'},
          { value: 'UNIDAD_LITROS', text: 'Litros'},
          { value: 'UNIDAD_MILIGRAMOS', text: 'Miligramos'},
          { value: 'UNIDAD_GRAMOS', text: 'Gramos'},
          { value: 'UNIDAD_KILOGRAMOS', text: 'Kilogramos'},
        ],
        // -- Seccion de la seleccion del compuesto quimico
        filterSearchCompuesto: '',
        envasePropTableFields: [
          { key: 'codigo', label: 'Código', thStyle: { width: '120px' } },
          { key: 'nombre', label: 'Nombre envase', sortable: true},
          { key: 'compuesto.cas', label: 'Número CAS', sortable: true, thStyle: { width: '120px' } },
          { key: 'compuesto.nombre', label: 'Nombre compuesto', sortable: true},
          { key: 'image_inside', label: 'Imagen compuesto', thStyle: { width: '96px' } },
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
        selectPropState: false,
        envasePropItems: [],
        listArmarios: [],
        listEstantes: [],
        listPedidos: [],
        perPageCompuesto: 5,
        currentPageCompuesto: 1,
        busy: false
      };
    },
    methods: {
      processForm() {
        if (this.editState == false) {
          var dataSave = {
            cantidad: this.cantidad,
            disponible: this.disponible,
            estante: this.estante,
            propiedades: this.propiedades,
            pedido: this.pedido
          };
  
          this.$parent.saveData(dataSave);
        } else {
          var dataUpdate = {
            id: this.id,
            cantidad: this.cantidad,
            disponible: this.disponible,
            estante: this.estante,
            propiedades: this.propiedades,
            pedido: this.pedido
          };
  
          this.$parent.updateData(dataUpdate);
        }
  
        this.reset();
      },
      reset() {
        this.id = null;
        this.cantidad = '',
        this.disponible = true,
        this.estante = null;
        this.armario = null;
        this.propiedades = null;
        this.frases = null;
        this.etiquetas = null;
        this.pedido = null;
        this.selectPropState = false;
  
        this.txtBtnForm = 'Guardar';
        this.editState = false;
      },
      loadItem(item) {
        this.id = item.id;
        this.cantidad = item.cantidad,
        this.disponible = item.disponible,
        this.propiedades = item.propiedades;
        this.armario = item.estante.armario,
        this.estante = item.estante,
        this.frases = item.frases;
        this.etiquetas = item.etiquetas;
        this.pedido = item.pedido;
        this.selectPropState = false;
  
        this.txtBtnForm = 'Actualizar';
        this.editState = true;
      },
      validNumber(field) {
        if( field.length == 0 ) {
          return false;
        }
        if( this.propiedades == null ) {
          return false;
        }
        const num = Number.parseFloat(field);
        return num >= 0.0 && num <= this.propiedades.capacidad;
      },
      validObj(field) {
        if( field == null ) {
          return false;
        }
        return field.id != null;
      },
      showEnvaseProps() {
        this.selectPropState = true;
        this.getEnvaseProps();
      },
      getEnvaseProps() {
        ClabtoolService.getData('envaseProp')
          .then(data => {
            this.envasePropItems = data;
          })
          .catch(error => this.$parent.catchError(error)); 
      },
      sendProp(prop) {
        this.propiedades = prop;
        this.cantidad = prop.capacidad;
        this.envasePropItems = [];
        this.selectPropState = false;
      },
      modalFrases(button) {
        this.$root.$emit('bv::show::modal', 'modal-frases', button);
      },
      modalEtiquetas(button) {
        this.$root.$emit('bv::show::modal', 'modal-etiquetas', button);     
      },
      setArmarios(data) {
        this.listArmarios = [ { value: null, text: 'Elija un armario' } ];
        for( let i = 0; i < data.length; i++ ) {
          this.listArmarios.push({
            value: data[i],
            text: data[i].nombre
          });
        }
      },
      setPedidos(data) {
        this.listPedidos = [ { value: null, text: 'Elija un pedido' } ];
        for( let i = 0; i < data.length; i++ ) {
          this.listPedidos.push({
            value: data[i],
            text: data[i].factura
          });
        }
      },
      findEstantes() {
        this.listEstantes = [{ value: null, text: 'Elija un estante' } ];
        const bufferEstante = this.estante;
        this.estante = null;
        if( this.armario == null ) {
          return;
        }
        ClabtoolService.getData('estante?armarioId=' + this.armario.id)
          .then(data => {
            for( let i = 0; i < data.length; i++ ) {
              this.listEstantes.push({
                value: data[i],
                text: data[i].nombre
              });
            }
          })
        if( bufferEstante.armario.id == this.armario.id ) {
          this.estante = bufferEstante;
        }
      }
    },
    computed: {
      rows() {
        return this.envasePropItems.length;
      },
      alertVariant() {
        return this.propiedades == null ? 'danger' : 'success';
      },
      getMax() {
        return this.propiedades == null ? 0.0 : this.propiedades.capacidad;
      },
      showCodigo() {
        return this.propiedades == null ? 'Elija un código' : this.propiedades.codigo;
      },
      showNombre() {
        return this.propiedades == null ? '' : this.propiedades.compuesto.nombre;
      },
      showCas() {
        return this.propiedades == null ? '' : this.propiedades.compuesto.cas;
      },
      showPureza() {
        return this.propiedades == null ? '' : this.propiedades.pureza;
      },
      showCapacidad() {
        return this.propiedades == null ? '' : this.propiedades.capacidad;
      },
      showUnidades() {
        return this.propiedades == null ? '' : this.propiedades.unidades.nombre;
      },
      getFrases() {
        return this.propiedades == null ? [] : this.propiedades.frases;
      },
      getEtiquetas() {
        return this.propiedades == null ? [] : this.propiedades.etiquetas;
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
  