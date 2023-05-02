<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Prueba</h4>
        <b-row class="mb-3">
          <b-col>
            <label for="Number" class="form-label">Number</label>
            <b-form-input v-model="Number" id="Number"></b-form-input>
            <p style="font-size: 70%;color: red;">Required</p>
          </b-col>
        </b-row>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>

export default {
  name: 'Prueba',
  data() {
    return {
      id: '',
      Number: '',
      //--------------------
      perPage: 10,
      currentPage: 1,
      txtBtnFormulario: 'Save',
      editState: false,
    };
  },
  methods: {
    processForm() {
      if (this.editState == false) {
        var dataSave = {
          Number: this.Number
        };

        this.$parent.saveData(dataSave);
      } else {
        var dataUpdate = {
          id: this.id,
          Number: this.Number
        };

        this.$parent.updateData(dataUpdate);
      }

      this.reset();
    },
    reset() {
      this.id = '';
      this.Number = '';
      this.txtBtnFormulario = 'Save';
      this.editState = false;
    },
    loadItem(item) {
      this.id = item.id;
      this.Number = item.Number;
      this.txtBtnFormulario = 'Update';
      this.editState = true;
    }
  },
  computed: {
  },
  mounted() {
  },
  components: {
  }
};
</script>
