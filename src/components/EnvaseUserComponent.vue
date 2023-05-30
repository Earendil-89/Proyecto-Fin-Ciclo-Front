<template>
  <div>
    <b-modal
      id="modal-search"
      title="Buscar reactivos"
      size="xl"
    ><EnvaseSearch
      @onError="(error) => catchError(error)"
      @onSelect="(id) => showExtraction(id)"></EnvaseSearch></b-modal>
    <b-modal
      id="modal-extraccion"
      title="Retirar envase"
      size="lg"
      @ok="sendExtraction"
      @cancel="reset"
      @close="reset"
    >
      <b-form-textarea
        id="extraccion-textarea"
        v-model="razonUso"
        placeholder="(Opcional) Indique motivo de uso"
        rows="3"
        maxRows="10"
      ></b-form-textarea>
  </b-modal>
  <b-modal
      id="modal-devolucion"
      title="Devolver envase"
      size="lg"
      @ok="sendReturn"
      @cancel="reset"
      @close="reset"
      :ok-disabled="okDisabled"
    >
      <b-form-textarea
        class="mb-3"
        id="extraccion-textarea"
        v-model="razonUso"
        placeholder="(Opcional) Indique comentarios"
        rows="3"
        maxRows="10"
      ></b-form-textarea>
      <b-row>
        <b-col cols="4">
          <label for="cantidadUsada" class="form-label">Cantidad</label>
          <b-form-input type="number" min="0.0" step="any" :state="validateCantidad" v-model="cantidadUsada"></b-form-input>
          <b-form-invalid-feedBack :state="validateCantidad">Introduzca cantidad usada</b-form-invalid-feedBack>
        </b-col>
        <b-col >
          <label for="unidades" class="form-label">Unidades</label>
          <b-form-select v-model="unidades" :options="listUnidades" id="unidades" :state="validateUnidades"></b-form-select>
          <b-form-invalid-feedback :state="validateUnidades">Debde especificar las unidades</b-form-invalid-feedback>
        </b-col>
        <b-form-checkbox class="mx-3 my-3" v-model="agotado">Reactivo agotado</b-form-checkbox>
      </b-row>
      
  </b-modal>
  <b-modal
    id="modal-seguridad-info"
    title="Etiquetado y frases de seguridad"
    size="xl"
  >
    <SeguridadInfoModal
      :etiquetas="item.etiquetas"
      :frases="item.frases"></SeguridadInfoModal>
  </b-modal>
  </div>
</template>
  
<script>
  import EnvaseSearch from './EnvaseSearchModal.vue';
  import SeguridadInfoModal from './SeguridadInfoModal.vue'
  import ClabtoolService from '../services/clabtool.service';
  export default {
    name: 'Frase',
    data() {
      return {
        id: null,
        razonUso: '',
        comentarios: '',
        cantidadUsada: '',
        usoEnvase: [],
        listUnidades: [],
        unidades: null,
        agotado: false,
        item: {
          frases: [],
          etiquetas: []
        },
      };
    },
    methods: {
      reset() {
        this.id = null;
        this.razonUso = '';
      },
      showExtraction(id) {
        this.id = id;
        this.razonUso = '';
        this.$root.$emit('bv::show::modal', 'modal-extraccion');  
      },
      showReturn(usoEnvase) {
        this.usoEnvase = usoEnvase;

        ClabtoolService.getData('unidad')
        .then(data => {
          this.generateListUnidades(data);
        })
        .catch(error => this.$parent.catchError(error));   

        this.$root.$emit('bv::show::modal', 'modal-devolucion');
      },
      launchSearchModal() {
        this.$root.$emit('bv::show::modal', 'modal-search');
      },
      catchError(error) {
        this.$parent.catchError(error);
      },
      sendExtraction() {
        const data = {
          id: this.id,
          razonUso: this.razonUso
        };
        this.$parent.saveData(data);
      },
      sendReturn() {
        const baseUso = this.getUnitScale(this.unidades.unidad);
        const baseCantidad = this.getUnitScale(this.usoEnvase.envase.propiedades.unidades.unidad);
        this.usoEnvase.cantidadUsada = Number.parseFloat(this.cantidadUsada) * baseUso / baseCantidad;
        this.usoEnvase.comentarios = this.comentarios;
        this.usoEnvase.agotado = this.agotado;
        this.$parent.updateData(this.usoEnvase);
        this.usoEnvase = null;
      },
      showSecurity(item) {
        this.item = item;
        this.$root.$emit('bv::show::modal', 'modal-seguridad-info');
      },
      generateListUnidades(data) {
        this.listUnidades = [ { value: null, text: 'Elija una opción' } ];
        for( let i = 0; i < data.length; i++ ) {
          if( data[i].tipo != this.usoEnvase.envase.propiedades.unidades.tipo ) {
            continue;
          }
          this.listUnidades.push(
            { value: data[i], text: data[i].nombre }
          );
        }
      },
      getUnitScale(factor) {
        switch( factor ) {
          case 'UNIDAD_MICROLITROS': return 1;
          case 'UNIDAD_MILIGRAMOS': return 1;
          case 'UNIDAD_MILILITROS': return 1000;
          case 'UNIDAD_GRAMOS': return 1000;
          case 'UNIDAD_LITROS': return 1000000;
          case 'UNIDAD_KILOGRAMOS': return 1000000;
        }
      }
    },
    computed: {
      validateCantidad() {
        if( this.cantidadUsada.length == 0 ) {
          return false;
        }
        const number = Number.parseFloat(this.cantidadUsada);
        return number >= 0.0;
      },
      validateUnidades() {
        return this.unidades != null;
      },
      okDisabled() {
        if( this.unidades == null ) {
          return true;
        }
        if( this.cantidadUsada.length == 0 ) {
          return true;
        }
        const number = Number.parseFloat(this.cantidadUsada);
        return number < 0.0;
      }
    },
    mounted() {
    },
    components: {
      EnvaseSearch,
      SeguridadInfoModal
    }
  };
</script>