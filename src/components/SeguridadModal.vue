<template>
  <div class="mt4 mx2">
    <div>
      <b-input-group class="mt-1">
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
          <b-button variant="primary" type="submit" class="actionButton">
            <i class="fas fa-sync"></i>
          </b-button>
        </b-form>
      </b-input-group>
    </div>
    <b-table
      class="shadow-sm"
      style="font-size:90%;"
      responsive
      id="modalTable"
      :per-page="perPage"
      :busy="busy"
      :filter="filterSearch"
      :total-rows="rows"
      :fields="tableFields"
      :items="cptItems"
      @row-clicked="onRowClicked"
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
    </b-table>
  </div>
</template>

<script>
import ClabtoolService from '../services/clabtool.service';

export default {
  name: 'BaseModal',
  model: {
    prop: 'selectedItems',
    event: 'change'
  },
  props: {
    type: String,
    tableFields: Array,
    selectedItems: Array,
    showOnly: Boolean
  },
  data() {
    return {
      filterSearch: '',
      tableItems: [],
      busy: false,
      currentPage: 1,
      perPage: 10,
    }
  },
  methods: {
    getData() {
      this.busy = true;

      switch (this.type) {     
        default:
          ClabtoolService.getData(this.type)
            .then(data => {
              this.tableItems = data;
            })
            .catch(error => this.$parent.catchError(error));
      }

      this.busy = false;
    },
    onRowClicked(item) {
      if( this.showOnly ) {
        return;
      }
      let found = false;
      for( let i = 0; i < this.selectedItems.length; i++ ) {
        if( this.selectedItems[i].id == item.id ) {
          this.selectedItems.splice(i, 1);
          found = true;
          break;
        }
      }
      if( found == false ) {
        this.selectedItems.push(item);
      }
    }
  },
  mounted() {
    if( this.showOnly ) {
      this.tableItems = this.selectedItems;
      return;
    }
    this.getData();
  },
  computed: {
    rows() {
      return this.tableItems.length;
    },
    cptItems() {
      if( this.showOnly ) {
        return this.tableItems;
      }
      return this.tableItems.map((item) => {
        let tmp = item;
        let found = false;
        for( let i = 0; i < this.selectedItems.length; i++ ) {
          if( tmp.id == this.selectedItems[i].id ) {
            tmp._rowVariant = 'success';
            found = true;
            break;
          }
        }
        if( found == false ) {
          tmp._rowVariant = null;
        }
        return tmp;
      })
    },
  }
}
</script>