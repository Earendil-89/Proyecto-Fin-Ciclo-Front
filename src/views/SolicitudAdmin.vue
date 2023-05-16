<template>
  <div>
    <b-row class="mb-4">
      <b-col>
        <b-button
          variant="outline-primary"
          class="mt-1 actionButton"
          @click="switchShowMode"
        >
        {{ txtButton }}
        </b-button>
      </b-col>
      <b-col cols="10">
        <b-input-group class="mt-1" v-show="!formStateCollapse">
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
          <b-form @submit.prevent="getData()">
            <b-button variant="primary" type="submit" class="actionButton"
              ><i class="fas fa-sync"></i
            ></b-button>
          </b-form>
        </b-input-group>
      </b-col>
    </b-row>
    <!-- Results -------------------------------------------------------------->
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
</template>

<script>
import ClabtoolService from '../services/clabtool.service';
export default {
  data() {
    return {
      formStateCollapse: true,
      busy: false,
      perPage: 10,
      currentPage: 1,
      filterSearch: '',
      showType: 0,
      txtButton: 'Mostrar: Activas',
      items: [],
      mainTableFields: [
          { key: 'userName', label: 'Usuario', sortable: true },
          { key: 'fechaSolicitud', label: 'Fecha de solicitud' },
          { key: 'estado', label: 'Estado de la solicitud' },
          { key: 'fechaTramite', label: 'Fecha de tramitación' },
          { key: 'usuarioTramite', label: 'Tramitado por' },
          { key: 'descripcion', label: 'Descripción de la solicitud' },
          { key: 'idRecipiente', label: 'Recipiente id' },
          { key: 'link', label: 'Link' },
          { key: 'action', label: '' }
        ]
    }
  },
  methods: {
    switchShowMode() {
      switch( this.showType ) {
        case 0:
        this.showType = 1;
          this.txtButton = 'Mostrar: Cerradas';
          break;
        case 1:
        this.showType = 2;
          this.txtButton = 'Mostrar: Todas';
          break;
        case 2:
          this.showType = 0;
          this.txtButton = 'Mostrar: Activas';
          break;
        default: return;
      }
    },
    getData() {
      this.busy = true;
        switch( this.showType ) {
          case 0:
            ClabtoolService.getData('solicitud?activa=true')
              .then(data => {
                this.items = data;
              })
              .catch(error => this.$parent.catchError(error));
            break;
          case 1:
            ClabtoolService.getData('solicitud?activa=false')
              .then(data => {
                this.items = data;
              })
              .catch(error => this.$parent.catchError(error));
            break;
          case 2:
            ClabtoolService.getData('solicitud')
              .then(data => {
                this.items = data;
              })
              .catch(error => this.$parent.catchError(error));
            break;
          default: break;
        }
        this.busy = false;
    }
  },
  computed: {
    rows() {
      return this.items.length;
    }
  },
  mounted() {
    this.getData();
  },
}
</script>