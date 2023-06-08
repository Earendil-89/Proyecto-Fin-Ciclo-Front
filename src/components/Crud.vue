<template>
  <div>
    <b-row>
      <b-col v-if="isValidCreateButton">
        <b-button
          v-if="type != 'envase-user'"
          variant="primary"
          v-b-toggle:formCollapse
          class="mt-1 actionButton"
          v-show="!formStateCollapse"
        >
          <i class="fas fa-plus-circle"></i>
          {{ getNameType }} 
        </b-button>
        <b-button
          v-else
          variant="primary"
          class="mt-1 actionButton"
          v-show="!formStateCollapse"
          @click="searchAction"
        >
          <i class="fas fa-search"></i>
          Buscar reactivo
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
        <template #cell(link)="row" align="center">
          <a 
            v-if="row.item.link != null && row.item.link != ''"
            :href="row.item.link"
            class="btn btn-outline-primary"
            target="_blank"
          ><i class="fas fa-globe-europe fa-lg"></i></a>
        </template>
        <template #cell(image)="row" align="center">
          <img :src='row.item.imgUrl' height="64">
        </template>
        <template #cell(containerCapacity)="row" align="center">
          {{ getCapacity(row.item) }}
        </template>
        <template #cell(containerAmount)="row" align="center">
          <p class="text-center mr-3">{{ getQuantity(row.item) }}</p>
          <b-progress
          class="mr-3"
            :value="current == 'envase-user-dynamic' ? row.item.envase.cantidad : row.item.cantidad"
            :max="current == 'envase-user-dynamic' ? row.item.envase.propiedades.capacidad : row.item.propiedades.capacidad"
            :variant="getPBarVariant(row.item)"
          >
          </b-progress>
        </template>
        <template #cell(userFullName)="row" align="center">
          {{ getUserFullName(row.item) }}
        </template>
        <template v-if="current != 'envase-user-dynamic'" #cell(location)="row" align="center">
          <p>{{ row.item.estante.armario.nombre }}</p>
          <p>{{ row.item.estante.nombre }}</p>
        </template>
        <template v-else #cell(location)="row" align="center">
          <p>{{ row.item.envase.estante.armario.nombre }}</p>
          <p>{{ row.item.envase.estante.nombre }}</p>
        </template>
        <template #cell(image_inside)="row" align="center">
          <img :src='row.item.compuesto.imgUrl' height="64">
        </template>
        <template #cell(image_envaseProp)="row" align="center">
          <img :src='row.item.propiedades.compuesto.imgUrl' height="64">
        </template>
        <template #cell(image_usoEnvase)="row" align="center">
          <img :src='row.item.envase.propiedades.compuesto.imgUrl' height="64">
        </template>
        <template #cell(capacidad)="row" align="left">
          {{ row.item.capacidad + ' ' + convertUnidades(row.item.unidades) }}
        </template>
        <template #cell(estado)="row" align="left">
          {{ transformEstado(row.item) }}
        </template>
        <template #cell(pureza)="row" align="center">
          {{ row.item.pureza }}%
        </template>
        <template #cell(fechaUso)="row" align="center">
          {{ formatFecha(row.item.fechaUso) }}
        </template>
        <template #cell(fechaDevolucion)="row" align="center">
          {{ formatFecha(row.item.fechaDevolucion) }}
        </template>
        <template #cell(disponible)="row" align="center">
          <i v-if="row.item.disponible" class="fas fa-check-circle" style="color: #00bb44"></i>
          <i v-else class="fas fa-times-circle" style="color: #bb4400"></i>
        </template>
        <template #cell(action)="row" align="center" style="padding: 0px 0px 0px 0px; margin:0px 0px 0px 0px" >
          <b-button-group align="center" size="sm" style="padding: 0px 0px 0px 0px; margin:0px 0px 0px 0px" >
            <b-button
              size="sm"
              variant="outline-info"
              @click="row.toggleDetails"
              class="actionButton ml-1"
              ><i class="fas fa-code fa-lg"></i>
              {{ row.detailsShowing ? '' : '' }}
            </b-button>
            <b-button
              v-if="current==='usuario-dynamic'"
              size="sm"
              variant="outline-primary"
              v-b-toggle:formCollapse
              @click="enterPwdMode(row.item)"
              class="actionButton ml-1"
            >
              <i class="fas fa-key fa-2x"></i>
            </b-button>
            
            <b-button
              v-if="isValidClosePedidoButton(row.item)"
              size="sm"
              variant="outline-danger"
              @click="closePedido(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-truck-loading"></i>
            </b-button>
            <b-button
              v-if="isValidEditButton(row.item)"
              size="sm"
              variant="outline-success"
              v-b-toggle:formCollapse
              @click="editComponent(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-edit fa-2x"></i>
            </b-button>
            <b-button
              v-if="isValidTramitationButton()"
              size="sm"
              variant="outline-success"
              v-b-toggle:formCollapse
              @click="editComponent(row.item)"
              class="actionButton ml-1"
            ><i class="fas fa-stamp fa-2x"></i>
            </b-button>
            <b-button
              v-if="isValidDeleteButton(row.item)"
              size="sm"
              variant="outline-danger"
              @click="deleteData(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-trash-alt fa-2x"></i>
            </b-button>
            <b-button
              v-if="current=='envase-user-dynamic'"
              size="sm"
              variant="outline-success"
              @click="envaseReturn(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-download fa-2x"></i></b-button>
            <b-button
              v-if="current=='envase-user-dynamic'"
              size="sm"
              variant="outline-warning"
              @click="showSecurity(row.item)"
              class="actionButton ml-1"
              ><i class="fas fa-exclamation-triangle fa-2x"></i></b-button>
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
import AuthService from '../services/auth.service';
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
      const name = this.$store.state.auth.user.username;

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
        
        case 'solicitud-user':
          ClabtoolService.getData('solicitud/usuario?nombreUsuario=' + name)
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error)); 
        break;

        case 'solicitud-manager':
          ClabtoolService.getData('solicitud')
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error));  
        break;

        case 'envase-manager':
          ClabtoolService.getData('manager/envase')
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error));  

          ClabtoolService.getData('armario')
            .then(data => {
              this.$refs.component.setArmarios(data);
            })
            .catch(error => this.$parent.catchError(error));

          ClabtoolService.getData('pedido?isClosed=false')
            .then(data => {
              this.$refs.component.setPedidos(data);
            })
            .catch(error => this.$parent.catchError(error));
        break;

        case 'envase-user': 
          ClabtoolService.getData('usoEnvase?nombreUsuario=' + name)
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error));  
        break;
        
        case 'usuario': {
          AuthService.get()
            .then(data => {
              this.items = data;
              ClabtoolService.getData('usuario')
                .then(data2 => {
                  for( let i = 0; i < this.items.length; i++ ) {
                    for( let j = 0; j < data2.length; j++ ) {
                      if( this.items[i].username === data2[j].nombreUsuario ) {
                        this.items[i].id_clabtool = data2[j].id;
                        this.items[i].nombre = data2[j].nombre;
                        this.items[i].apellidos = data2[j].apellidos;
                        this.items[i].nombreUsuario = data2[j].nombreUsuario;
                        this.items[i].email = data2[j].email;
                        data2.splice(j, 1);
                        break;
                      }
                    }
                  }
                  this.$forceUpdate();
                })
                .catch(error => this.$parent.catchError(error));

                this.$forceUpdate();
              })
            .catch(error => this.$parent.catchError(error));
        } break;
        
        case 'usoEnvase':
          ClabtoolService.getData('manager/usoEnvase')
            .then(data => {
              this.items = data;
            })
            .catch(error => this.$parent.catchError(error));  
        break;

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
      const name = this.$store.state.auth.user.username;

      switch (this.type) {
        case 'solicitud-user':
          ClabtoolService.saveData('solicitud/usuario?nombreUsuario=' + name, data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));        
        break;

        case 'envase-manager':
          ClabtoolService.saveData('envase', data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));     
        break;

        case 'envase-user': 
          data.nombreUsuario = name;
          ClabtoolService.saveData('usoEnvase', data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
        break;
        
        case 'usuario': {
          const authData = {
            username: data.nombreUsuario,
            password: data.password,
            email: data.email,
            role: data.roles,
            attributes: []
          };
          const clabtoolData = {
            nombreUsuario: data.nombreUsuario,
            email: data.email,
            nombre: data.nombre,
            apellidos: data.apellidos,
          };
          AuthService.signup(authData)
            .then( data => {
              console.log(data.message);
              this.getAndRegister(clabtoolData);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
        } break;

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
      const name = this.$store.state.auth.user.username;

      switch (this.type) {
        case 'solicitud-manager':
          ClabtoolService.updateData('solicitud/usuario?nombreUsuario=' + name, data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
        break;

        case 'envase-manager':
          ClabtoolService.saveData('envase', data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));     
        break;

        case 'envase-user': 
          data.nombreUsuario = name;
          ClabtoolService.updateData('usoEnvase', data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
          break;

        case 'solicitud-user':
          ClabtoolService.updateData('solicitud', data)
            .then(data => {
              this.showMessage(data.status, data.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
        break;

        case 'usuario': {
          const authData = {
            id: data.id,
            username: data.nombreUsuario,
            role: data.roles,
            attributes: []
          };
          const clabData = {
            id: data.id_clabtool,
            nombreUsuario: data.nombreUsuario,
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email
          }
          ClabtoolService.updateData('usuario', clabData)
            .then(clabResult => {
              AuthService.updateUser(authData)
                .then(authResult => {
                  console.log(authResult);
                })
                .catch(error => this.$parent.catchError(error));

              this.showMessage(clabResult.status, clabResult.message);
              this.getData();
            })
            .catch(error => this.$parent.catchError(error));
        } break;

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
    getAndRegister(data) {

      AuthService.get()
        .then(result => {
          for( let i = 0; i < result.length; i++ ) {
            if( result[i].username === data.nombreUsuario ) {
              const clabData = {
                id: result[i].id,
                nombreUsuario: data.nombreUsuario,
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email
              };
              ClabtoolService.saveData('usuario', clabData)
                .then(sndRes => {
                  this.showMessage(sndRes.status, sndRes.message);
                  this.getData(this.type);
                })
                .catch(error => this.$parent.catchError(error));
            }
          }
        })
    },
    updatePassword(data) {
      AuthService.setPassword(data)
        .then( () => {
          this.showMessage(0, 'Contraseña actualizada');
        })
        .catch(error => this.$parent.catchError(error));
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
              case 'envase-manager':
                ClabtoolService.deleteData('envase', data.id)
                  .then(data => {
                    this.showMessage(data.status, data.message);
                    this.getData();
                  })
                  .catch(error => this.$parent.catchError(error));
              break;

              case 'solicitud-user':
                ClabtoolService.deleteData('solicitud', data.id)
                  .then(data => {
                    this.showMessage(data.status, data.message);
                    this.getData();
                  })
                  .catch(error => this.$parent.catchError(error));
              break;

              case 'usuario':
                ClabtoolService.deleteData(this.type, data.id_clabtool)
                  .then( clabData => {
                    AuthService.delete(data.id)
                      .then( authData => {
                        console.log(authData.message);
                        this.getData();
                      })
                      .catch(error => this.$parent.catchError(error));

                    this.showMessage(clabData.status, clabData.message);
                    
                  })
                  .catch(error => this.$parent.catchError(error)); 
              break;

              case 'solicitud-manager':
                ClabtoolService.deleteData('solicitud', data.id)
                  .then(data => {
                    this.showMessage(data.status, data.message);
                    this.getData();
                  })
                  .catch(error => this.$parent.catchError(error));
              break;

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
    closePedido(item) {
      this.$bvModal
        .msgBoxConfirm('¿Quieres registrar la entrega?', {
          title: '',
          okVariant: 'danger',
          okTitle: 'SÍ',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if( value == true ) {
            item.fechaEntrega = new Date();
            this.updateData(item);
          }
        });
    },
    editComponent(item) {
      this.$refs.component.loadItem(item);
    },
    enterPwdMode(item) {
      this.$refs.component.editPassword(item);
    },
    catchError(error) {
      this.$parent.catchError(error);
    },
    convertUnidades(unidades) {
      switch( unidades.unidad ) {
        case 'UNIDAD_MICROLITROS': return 'ul';
        case 'UNIDAD_MILILITROS': return 'ml';
        case 'UNIDAD_LITROS': return 'l';
        case 'UNIDAD_MILIGRAMOS': return 'mg';
        case 'UNIDAD_GRAMOS': return 'g';
        case 'UNIDAD_KILOGRAMOS': return 'kg';
        default: return '';
      }
    },
    editEstantes(item) {
      this.$refs.component.launchModal(item);
    },
    envaseReturn(item) {
      this.$refs.component.showReturn(item);
    },
    transformEstado(item) {
      switch (item.estado) {
        case 'ESTADO_ESPERA': return 'Esperando trámite';
        case 'ESTADO_ACEPTADA': return 'Aceptada';
        case 'ESTADO_DENEGADA': return 'Denegada';
      }
    },
    getUserFullName(item) {
      if( this.type != 'solicitud-user') {
        if( this.current == 'pedido-dynamic' || this.current == 'usoEnvase-dynamic' ) {
          return item.usuario.apellidos + ', ' + item.usuario.nombre;
        }
        return item.usuarioSolicitud.apellidos + ', ' + item.usuarioSolicitud.nombre;
      }
      else {
        if( item.usuarioTramite == null ) {
          return '';
        }
        return item.usuarioTramite.apellidos + ', ' + item.usuarioTramite.nombre;
      }
    },
    formatFecha(inputDate) {
      if( inputDate == null ) {
        return '';
      }
      const date = new Date(inputDate);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return date.toLocaleString('es-ES', options);
    },
    isValidEditButton(item) {
      if( this.current == 'usoEnvase-dynamic' ) {
        return false;
      }
      if( this.current == 'envase-user-dynamic' ) {
        return false;
      }
      if( this.current == 'solicitudUser-dynamic') {
        if( item.estado != 'ESTADO_ESPERA' ) {
          return false;
        }
      }
      else if( this.current == 'solicitud-dynamic' ) {
        return false;
      }
      return true;
    },
    isValidDeleteButton(item) {
      if( this.current == 'usoEnvase-dynamic' ) {
        return false;
      }
      if( this.current == 'envase-user-dynamic' ) {
        return false;
      }
      if( this.current == 'solicitudUser-dynamic') {
        if( item.estado != 'ESTADO_ESPERA') {
          return false;
        }
      }
      if( this.current == 'solicitud-dynamic') {
        if( item.estado == 'ESTADO_ESPERA') {
          return false;
        }
      }
      return true;
    },
    isValidTramitationButton() {
      return this.current == 'solicitud-dynamic';
    },
    isValidClosePedidoButton(item) {
      if( this.current != 'pedido-dynamic' ) {
        return false;
      }
      return item.fechaEntrega == null;
    },
    getQuantity(item) {
      if( this.current == 'envase-user-dynamic' ) {
        return item.envase.cantidad + ' ' + this.convertUnidades(item.envase.propiedades.unidades);
      }
      else {
        return item.cantidad + ' ' + this.convertUnidades(item.propiedades.unidades);
      }
    },
    getCapacity(item) {
      if( this.current == 'envase-user-dynamic' ) {
        return item.envase.propiedades.capacidad + ' ' + this.convertUnidades(item.envase.propiedades.unidades);
      }
      else {
        return item.propiedades.capacidad + ' ' + this.convertUnidades(item.propiedades.unidades);
      }
    },
    getPBarVariant(item) {
      const cantidad = this.current == 'envase-user-dynamic' ? item.envase.cantidad : item.cantidad;
      const capacidad = this.current == 'envase-user-dynamic' ? item.envase.propiedades.capacidad : item.propiedades.capacidad;

      if( cantidad == capacidad ) {
        return null;
      }
      if( cantidad > capacidad / 2 ) {
        return 'success';
      }
      if( cantidad > capacidad / 4 ) {
        return 'warning';
      }
      return 'danger';
    },
    searchAction() {
      if( this.type == 'envase-user' ) {
        this.$refs.component.launchSearchModal();
      }
    },
    showSecurity(item) {
      this.$refs.component.showSecurity(item.envase.propiedades);
    }
  },
  computed: {
    rows() {
      return this.items.length;
    },
    getNameType() {
      switch( this.type ) {
        case 'envaseProp': return 'Datos de envase';
        case 'solicitud-user': return 'Crear solicitud';
        case 'envase-manager': return 'Crear envase';
        case 'envase-user': return 'Buscar reactivo';
        default: return 'Crear ' + this.type;
      }
    },
    isValidCreateButton() {
      if( this.current == 'solicitud-dynamic' ) {
        return false;
      }
      return true;
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
    "envase-manager-dynamic": () => import("./EnvaseComponent.vue"),
    "envase-user-dynamic": () => import("./EnvaseUserComponent.vue"),
    "solicitud-dynamic": () => import("./SolicitudManagerComponent.vue"),
    "solicitudUser-dynamic": () => import("./SolicitudUserComponent.vue"),
    "armario-dynamic": () => import("./ArmarioComponent.vue"),
    "estante-dynamic": () => import("./EstanteComponent.vue"),
    "pedido-dynamic": () => import("./PedidoComponent.vue"),
    "usoEnvase-dynamic": () => import("./UsoEnvaseComponent.vue"),
    VueJsonPretty
  }
};
</script>
