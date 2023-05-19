<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Compuesto</h4>
        <b-row class="mb-1">
          <b-col cols="2">
            <label for="cas" class="form-label">Número CAS</label>
            <b-form-input v-model="cas" id="cas" :state="validField(cas)"></b-form-input>
            <b-form-invalid-feedback :state="validField(cas)">Debe introducir apellidos</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="nombre" class="form-label">Nombre</label>
            <b-form-input v-model="nombre" id="nombre" :state="validField(nombre)"></b-form-input>
            <b-form-invalid-feedback :state="validField(nombre)">Debe introducir un nombre</b-form-invalid-feedback>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <label for="formula" class="form-label">Fórmula empírica</label>
            <b-form-input v-model="formula" id="formula"></b-form-input>
          </b-col>
          <b-col>
            <label for="peso-molecular" class="form-label">Peso molecular</label>
            <b-form-input v-model="pesoMolecular" id="peso-molecular" type="number" min="0.0" step="any"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <label for="img-url" class="form-label">Url de la imagen</label>
            <b-form-input v-model="imgUrl" id="img-url"></b-form-input>
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
            :disabled="!validField(cas) || !validField(nombre)"
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
  name: 'Compuesto',
  data() {
    return {
      // -- Campos del usuario
      id: null,
      cas: '',
      nombre: '',
      formula: '',
      pesoMolecular: '',
      imgUrl: '',
      //--------------------
      // -- Campos del componente
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
          cas: this.cas,
          nombre: this.nombre,
          formula: this.formula,
          pesoMolecular: this.pesoMolecular,
          imgUrl: this.imgUrl
        };

        this.$parent.saveData(dataSave);
      } else {
        var dataUpdate = {
          id: this.id,
          cas: this.cas,
          nombre: this.nombre,
          formula: this.formula,
          pesoMolecular: this.pesoMolecular,
          imgUrl: this.imgUrl
        };

        this.$parent.updateData(dataUpdate);
      }

      this.reset();
    },
    reset() {
      this.id = null;
      this.cas = '';
      this.nombre = '';
      this.formula = '';
      this.pesoMolecular = '';
      this.imgUrl = '';

      this.txtBtnForm = 'Guardar';
      this.editState = false;
    },
    loadItem(item) {
      this.id = item.id;
      this.cas = item.cas;
      this.nombre = item.nombre;
      this.formula = item.formula;
      this.pesoMolecular = item.pesoMolecular;
      this.imgUrl = item.imgUrl;
      this.txtBtnForm = 'Actualizar';
      this.editState = true;
    },
    validField(field) {
      if( field == null )
        return false;

      return field.length > 0;
    },
    copyPassword() {
      navigator.clipboard.writeText(this.password);
      alert('Contraseña copiada al portapapeles.');
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
