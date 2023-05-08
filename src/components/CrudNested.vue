<template>
  <div>
    <b-card
      class="card-form"
      v-bind:style="[
        sideBarCollapsed == true
          ? 'margin: 10px 30px 30px 75px; padding: 0px 0px 0px 0px;'
          : 'margin: 10px 30px 30px 245px;padding: 0px 0px 0px 0px;'
      ]"
    >
      <b-row>
        <b-col>
          <!-- Top: New button, search, pagination & refresh data ------>
          <b-button
            variant="primary"
            v-b-toggle:formCollapse
            class="mt-1 actionButton"
            v-show="!parentFormStateCollapse"
          >
            <i class="fas fa-plus-circle"></i> Crear {{ type }}
          </b-button>
        </b-col>
        <b-col cols="10">
          <b-input-group class="mt-1" v-show="!parentFormStateCollapse">
            <b-form-input
              v-model="filterSearch"
              placeholder="Search..."
              class="ml-1 mr-1 shadow-sm"
              type="search"
            ></b-form-input>
            <b-pagination
              class="ml-2 mr-2 shadow-sm"
              v-model="currentParentPage"
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
        <!-- Main Form ------------------------------------------------------------>
        <component
          :is="parent"
          ref="parentComponent"
          @hook:mounted="getData()"
        ></component>
      </b-row>
      <!-- Results -------------------------------------------------------------->
      <div class="mt-2 overflow-auto" v-show="!parentFormStateCollapse">
        <b-table
          class="shadow-sm"
          style="font-size:90%;"
          responsive
          id="mainTable"
          :parentBusy="parentBusy"
          :filter="filterSearch"
          :total-rows="rows"
          :fields="mainTableFields"
          :parentItems="parentItems"
          :per-page="perPage"
          :current-page="currentParentPage"
          hover
          small
        >
          <template #table-parentBusy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
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
                @click="editParent(row.item)"
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
    </b-card>
    <!-- Children section -------------------------------------------------------------->
    <b-card v-if="parentFormStateCollapse && parentId != null"
      class="card-form"
      v-bind:style="[
        sideBarCollapsed == true
          ? 'margin: 10px 30px 30px 75px; padding: 0px 0px 0px 0px;'
          : 'margin: 10px 30px 30px 245px;padding: 0px 0px 0px 0px;'
      ]"
    >
      <b-row>
        <b-col>
          <!-- Children Top: New button, search, pagination & refresh data -->
          <b-button
            variant="primary"
            v-b-toggle:childFormCollapse
            class="mt-1 actionButton"
            v-show="!childFormStateCollapse"
          >
            <i class="fas fa-plus-circle"></i> Crear {{ childType }}
          </b-button>
        </b-col>
        <b-col cols="10">
          <b-input-group class="mt-1" v-show="!childFormStateCollapse">
            <b-form-input
              v-model="childFilterSearch"
              placeholder="Search..."
              class="ml-1 mr-1 shadow-sm"
              type="search"
            ></b-form-input>
            <b-pagination
              class="ml-2 mr-2 shadow-sm"
              v-model="currentChildPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="childTable"
            ></b-pagination>
            <b-form @submit.prevent="addChild()">
              <b-button variant="primary" type="submit" class="actionButton"
                ><i class="fas fa-sync"></i
              ></b-button>
            </b-form>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4" v-show="childFormStateCollapse">
          <!-- Children Main Form --------------------------------------------------->
          <component
            :is="children"
            ref="childComponent"
          ></component>
        </b-col>
        <b-col>
          <!-- Children Results ----------------------------------------------------->
          <div class="mt-2 overflow-auto">
            <b-table
              class="shadow-sm"
              style="font-size:90%;"
              responsive
              id="childTable"
              :parentBusy="parentBusy"
              :filter="childFilterSearch"
              :total-rows="rows"
              :fields="childTableFields"
              :parentItems="childItems"
              :per-page="childPerPage"
              :current-page="currentChildPage"
              hover
              small
            >
              <template #table-parentBusy>
                <div class="text-center text-danger my-2">
                  <b-spinner class="align-middle"></b-spinner>
                </div>
              </template>
              <template #cell(childAction)="row" align="center" style="padding: 0px 0px 0px 0px; margin:0px 0px 0px 0px" >
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
                    v-b-toggle:childFormCollapse
                    @click="editChild(row.item)"
                    class="actionButton ml-1"
                    ><i class="fas fa-edit fa-2x"></i
                  ></b-button>
                  <b-button
                    size="sm"
                    variant="outline-danger"
                    @click="deleteChild(row.item)"
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
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import ClabtoolService from '../services/clabtool.service';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  name: 'CrudNested',
  props: ['parent', 'children', 'mainTableFields', 'childTableFields', 'parentType', 'childType'],
  data() {
    return {
      parentId: null,
      parentBusy: false,
      childBusy: false,
      childEnabled: false,
      perPage: 10,
      currentParentPage: 1,
      childPerPage: 5,
      currentChildPage: 1,
      parentFormStateCollapse: false,
      childFormStateCollapse: false,
      filterSearch: '',
      childFilterSearch: '',
      parentItems: [],
      childItems: [],
      deleteConfirm: '',
      options: ['list', 'of', 'options'],
      value:'',
    };
  },
  methods: {
    getData(isChild = false, parentId = null) {
      if( isChild ) {
        this.childBusy = true;
        switch( this.childType ) {
          default:
            ClabtoolService.getChildData(this.childType, parentId)
              .then(data => {
                this.childItems = data;
              })
              .catch(error => this.$parent.catchError(error));
        }
        this.childBusy = false;
      } else {
        this.parentBusy = true;
        switch( this.parentType ) {
          default:
            ClabtoolService.getData(this.parentType)
              .then(data => {
                this.parentItems = data;
              })
              .catch(error => this.$parent.catchError(error));
        }
        this.parentBusy = false;
      }
    },
    saveData(data, isChild = false, parentId) {
      if( isChild ) {
        this.childBusy = true;
        switch( this.childType ) {
          default:
            ClabtoolService.saveData(this.childType, data)
              .then(data => {
                this.showMessage(data.message);
                this.getData(true, parentId);
              })
              .catch(error => this.$parent.catchError(error));
        }
      }
      else {
        this.parentBusy = true;
        switch( this.parentType ) {
          default:
            ClabtoolService.saveData()
            .then(data => {
              this.showMessage(data.message);
              this.getData();
            })
        }
        this.parentBusy = false;
      }
    },
    updateData(data) {
      this.parentBusy = true;

      switch (this.type) {
        default:
          ClabtoolService.updateData(this.type, data)
            .then(data => {
              this.showMessage(data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
      }

      this.parentBusy = false;
    },
    deleteData(data) {
      this.deleteConfirm = '';
      this.$bvModal
        .msgBoxConfirm('¿Estás seguro?', {
          title: '',
          okVariant: 'danger',
          okTitle: 'YES',
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
                    this.showMessage(data.message);
                    this.getData();
                  })
                  .catch(error => this.$parent.catchError(error));
            }
          }
        });
    },

    showMessage(message) {
      this.$parent.showMsgBoxConfirm(message, 'success', 'Success', 'sm');
    },
    editParent(item) {
      this.$refs.parentComponent.loadItem(item);
      this.parentId = item.id;
    },
    catchError(error) {
      this.$parent.catchError(error);
    }
  },
  computed: {
    rows() {
      return this.parentItems.length;
    }
  },
  mounted() {
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (collapseId == 'formCollapse') {
        this.parentFormStateCollapse = isJustShown;
      } else if( collapseId == 'childFormCollapse' ) {
        this.childFormStateCollapse = isJustShown;
      }
    });
  },
  components: {
    "armario-dynamic": () => import("./ArmarioComponent.vue"),
    "estante-dynamic": () => import("./EstanteComponent.vue"),
    VueJsonPretty
}
};
</script>
