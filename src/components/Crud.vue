<template>
  <div>
    <b-row>
      <b-col>
        <b-button
          variant="primary"
          v-b-toggle:formCollapse
          class="mt-1 actionButton"
          v-show="!formStateCollapse"
        >
          <i class="fas fa-plus-circle"></i> {{ type == 'envaseProp' ? 'Datos de envase' : 'Crear ' + type }} 
        </b-button>
      </b-col>
      <b-col cols="10">
        <b-input-group class="mt-1" v-show="!formStateCollapse">
          <b-form-input
            v-model="filterSearch"
            placeholder="Search..."
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
          <b-form @submit.prevent="getData()">
            <b-button variant="primary" type="submit" class="actionButton"
              ><i class="fas fa-sync"></i
            ></b-button>
          </b-form>
        </b-input-group>
      </b-col>
      <!-- Formulario principal ------------------------------------------------------------>
      <component
        :is="current"
        ref="component"
        @hook:mounted="getData()"
      ></component>
      <!-- Resultados de las consultas a la BBDD -------------------------------------------------------------->
    </b-row>
    <div class="mt-2 overflow-auto" v-show="!formStateCollapse">
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
        <template #cell(image)="row" align="center">
          <img :src='row.item.imgUrl' height="64">
        </template>
        <template #cell(image_inside)="row" align="center">
          <img :src='row.item.compuesto.imgUrl' height="64">
        </template>
        <template #cell(cantidad)="row" align="left">
          {{ row.item.cantidad + ' ' + convertUnidades(row.item.unidades) }}
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
              v-b-toggle:formCollapse
              @click="editComponent(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-edit fa-2x"></i
            ></b-button>
            <b-button
              size="sm"
              variant="outline-danger"
              @click="deleteData(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-trash-alt fa-2x"></i
            ></b-button>
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
import 'vue-json-pretty/lib/styles.css';

export default {
  name: 'Crud',
  props: ['current', 'mainTableFields', 'type'],
  data() {
    return {
      busy: false,
      perPage: 10,
      currentPage: 1,
      formStateCollapse: false,
      filterSearch: '',
      items: [],
      deleteConfirm: '',
      options: ['list', 'of', 'options'],
      value:''
    };
  },
  methods: {
    getData() {
      this.busy = true;

      switch (this.type) {
        case 'estante':
          this.$refs.component.armarios = [];
          ClabtoolService.getData(this.type)
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error)); 

            ClabtoolService.getData('armario')
            .then(data => {
              for( let i = 0; i < data.length; i++ ) {
                this.$refs.component.armarios.push( {
                  value: data[i], text: data[i].nombre
                })
              }
            })
            .catch(error => this.$parent.catchError(error));           
          break;  

        case 'envaseProp':
          ClabtoolService.getData(this.type)
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error)); 

          ClabtoolService.getData('unidad')
            .then(data => {
              this.$refs.component.generateListUnidades(data);
            })
            .catch(error => this.$parent.catchError(error));   
          break;
        /*
        case 'solicitud':
          ClabtoolService.getData('usuario/1/solicitud')
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error)); 
          break;       */
        default:
          ClabtoolService.getData(this.type)
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error));
      }

      this.busy = false;
    },
    saveData(data) {
      this.busy = true;

      switch (this.type) {
        default:
          ClabtoolService.saveData(this.type, data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
      }

      this.busy = false;
    },
    updateData(data) {
      this.busy = true;

      switch (this.type) {
        default:
          ClabtoolService.updateData(this.type, data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
      }

      this.busy = false;
    },
    deleteData(data) {
      this.deleteConfirm = '';
      this.$bvModal
        .msgBoxConfirm('¿Estás seguro?', {
          title: '',
          okVariant: 'danger',
          okTitle: 'SÍ',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          this.deleteConfirm = value;
          if (this.deleteConfirm == true) {
            switch (this.type) {
              default:
                ClabtoolService.deleteData(this.type, data.id)
                  .then(data => {
                    this.showMessage(data.status, data.message);
                    this.getData();
                  })
                  .catch(error => this.$parent.catchError(error));
            }
          }
        });
    },
    showMessage(status, message) {
      const stat = status == 0 ? 'success' : 'danger';
      const title = status == 0? 'Success' : 'Danger';
      this.$parent.showMsgBoxConfirm(message, stat, title, 'sm');
    },
    editComponent(item) {
      this.$refs.component.loadItem(item);
    },
    catchError(error) {
      this.$parent.catchError(error);
    },
    convertUnidades(unidades) {
      switch( unidades ) {
        case 'UNIDAD_MICROLITROS': return 'ul';
        case 'UNIDAD_MILILITROS': return 'ml';
        case 'UNIDAD_LITROS': return 'l';
        case 'UNIDAD_MILIGRAMOS': return 'mg';
        case 'UNIDAD_GRAMOS': return 'k';
        case 'UNIDAD_KILOGRAMOS': return 'kg';
        default: return '';
      }
    },
    editEstantes(item) {
      this.$refs.component.launchModal(item);
    },
  },
  computed: {
    rows() {
      return this.items.length;
    }
  },
  mounted() {
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (collapseId == 'formCollapse') {
        this.formStateCollapse = isJustShown;
      }
    });
  },
  components: {
    "usuario-dynamic": () => import("./UsuarioComponent.vue"),
    "frase-dynamic": () => import("./FraseComponent.vue"),
    "etiqueta-dynamic": () => import("./EtiquetaComponent.vue"),
    "compuesto-dynamic": () => import("./CompuestoComponent.vue"),
    "envase-dynamic": () => import("./EnvasePropComponent.vue"),
    "solicitud-dynamic": () => import("./SolicitudComponent.vue"),
    "solicitudUser-dynamic": () => import("./SolicitudComponent.vue"),
    "armario-dynamic": () => import("./ArmarioComponent.vue"),
    "estante-dynamic": () => import("./EstanteComponent.vue"),
    VueJsonPretty
  }
};
</script>
