<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Armarios</h4>
        <b-row class="mb-3">
          <b-col cols="2">
            <label for="factura" class="form-label">Factura</label>
            <b-form-input v-model="factura" id="factura" :state="validField(factura)"></b-form-input>
            <b-form-invalid-feedback :state="validField(factura)">Debe introducir un código</b-form-invalid-feedback>
          </b-col>
          <b-col cols="2">
            <label for="importe" class="form-label">Importe</label>
            <b-form-input v-model="importe" id="importe" :state="validField(importe, true)" type="number" min="0.0" step="any"/>
            <b-form-invalid-feedback :state="validField(importe, true)">Debe introducir un importe</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="fecha-pedido" class="form-label">Fecha del pedido</label>
            <div class="d-flex">
              <b-form-datepicker v-model="fechaPedido" id="fecha-pedido"/>
              <b-button
                class="ml-3"
                variant="danger"
                @click="fechaPedido = null"
              >
                <i class="fas fa-times"></i>
              </b-button>
            </div>
          </b-col>
          <b-col>
            <label for="fecha-entrega" class="form-label">Fecha de entrega</label>
            <div class="d-flex">
              <b-form-datepicker v-model="fechaEntrega" id="fecha-entrega"/>
              <b-button
                class="ml-3"
                variant="danger"
                @click="fechaEntrega = null"
              >
                <i class="fas fa-times"></i>
              </b-button>
            </div>
          </b-col>
        </b-row>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <b-button
            variant="outline-danger"
            class="actionButton"
            v-b-toggle:formCollapse
            @click="reset()"
          >
            <i class="far fa-times-circle mr-1"></i>Cancelar</b-button>
          <b-button
            variant="outline-success"
            type="submit"
            class="actionButton"
            v-b-toggle:formCollapse
            ><i class="far fa-check-circle mr-1"></i>{{ txtBtnForm }}</b-button>
        </div>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
  export default {
    name: 'Armario',
    data() {
      return {
        id: null,
        factura: '',
        importe: '',
        fechaPedido: null,
        fechaEntrega: null,
        usuario: null,
        //--------------------
        perPage: 10,
        currentPage: 1,
        txtBtnForm: 'Guardar',
        editState: false,
      };
    },
    methods: {
      processForm() {
        const name = this.$store.state.auth.user.username;
        if (this.editState == false) {
          var dataSave = {
            userName: name,
            pedido: {
              factura: this.factura,
              importe: this.importe,
              fechaPedido: this.fechaPedido,
              fechaEntrega: this.fechaEntrega
            },
          };
  
          this.$parent.saveData(dataSave);
        } else {
          var dataUpdate = {
            id: this.id,
            factura: this.factura,
            importe: this.importe,
            fechaPedido: this.fechaPedido,
            fechaEntrega: this.fechaEntrega,
            usuario: this.usuario,
          };
  
          this.$parent.updateData(dataUpdate);
        }
  
        this.reset();
      },
      reset() {
        this.id = null;
        this.factura = '';
        this.importe = '';
        this.fechaPedido = null;
        this.fechaEntrega = null;
        this.usuario = null;

        this.txtBtnForm = 'Guardar';
        this.editState = false;
      },
      loadItem(item) {
        this.id = item.id;
        this.factura = item.factura;
        this.importe = item.importe;
        this.fechaPedido = item.fechaPedido;
        this.fechaEntrega = item.fechaEntrega;
        this.usuario = item.usuario;

        this.txtBtnForm = 'Actualizar';
        this.editState = true;
      },
      validField(element, isNumber = false) {
        if( element == null || element.length < 1 ) {
          return false;
        }
        if( isNumber ) {
          const num = Number.parseFloat(element);
          if( isNaN(num) ) {
            return false;
          }
          return num >= 0.0;
        }
        return true;
      },
    },
    computed: {
    },
    mounted() {
    },
    components: {
    }
  };
</script>