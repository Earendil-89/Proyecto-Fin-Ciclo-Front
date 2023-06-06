<template>

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
