<template>
  <div>
    <b-collapse id="formCollapse">
      <b-form @submit.prevent="processForm">
        <h4 class="mt-4 mb-3">Fecha</h4>

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
            ><i class="far fa-check-circle mr-1"></i
            >{{ txtBtnForm }}</b-button
          >
          <b-col>
            <label class="form-label">Fecha</label>
            <b-form-datepicker id="fm" v-model="fechaManual" class="mb-2"></b-form-datepicker>
          </b-col>
          <b-col>
            <label class="form-label">Fecha - Date</label>
            <b-form-datepicker id="fmd" v-model="fechaManualDate" class="mb-2"></b-form-datepicker>
          </b-col>
          <b-col>
            <label class="form-label">Fecha - Timestamp</label>
            <b-form-datepicker id="fmts" v-model="fechaManualTimestamp" class="mb-2"></b-form-datepicker>
          </b-col>
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
      fechaManual: '',
      fechaManualDate: '',
      fechaManualTimestamp: '',
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
          fechaManual: this.fechaManual,
          fechaManualDate: this.fechaManualDate,
          fechaManualTimestamp: this.fechaManualTimestamp,
          fechaAuto: new Date(),
          fechaAutoDate: new Date(),
          fechaAutoTimestamp: new Date()
        };
        console.log(dataSave);
        this.$parent.saveData(dataSave);
      } else {
        var dataUpdate = {
          id: this.id,
          fechaManual: this.fechaManual,
          fechaManualDate: this.fechaManualDate,
          fechaManualTimestamp: this.fechaManualTimestamp,
        };

        this.$parent.updateData(dataUpdate);
      }

      this.reset();
    },
    reset() {
      this.id = null;
      this.fechaManual = '';
      this.fechaManualDate = '';
      this.fechaManualTimestamp = '';
      this.fechaManualTime = '';

      this.txtBtnForm = 'Guardar';
      this.editState = false;
    },
    loadItem(item) {
      this.id = item.id;
      this.fechaManual = item.fechaManual;
      this.fechaManualDate = item.fechaManualDate;
      this.fechaManualTimestamp = item.fechaManualTimestamp;

      this.txtBtnForm = 'Actualizar';
      this.editState = true;
    },
    validField(field) {
      if( field == null )
        return false;

      return field.length > 0;
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
