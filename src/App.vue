<template>
  <div>
    <div class="main">
      <b-navbar
      >
        <b-navbar-nav class="ml-auto" id="navbar" v-if="currentUser">
          <b-nav-item class="mr-5">

          </b-nav-item>
          <b-nav-item @click.prevent="logOut">
            <i class="fas fa-sign-out-alt mr-1"></i>Log out
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
      <sidebar-menu
        :menu="sideBarMenu"
        width="260px"
        :collapsed="sideBarCollapsed"
        @toggle-collapse="onToggleCollapse"
        v-if="shouldShowSidebar"
      >
        <template v-slot:toggle-icon><i class="fas fa-ellipsis-h"></i></template>
      </sidebar-menu>
      <b-card v-if="currentUser"
        class="card-form"
        v-bind:style="[
          sideBarCollapsed == true
            ? 'margin: 10px 30px 30px 75px; padding: 0px 0px 0px 0px;'
            : 'margin: 10px 30px 30px 285px;padding: 0px 0px 0px 0px;'
        ]"
      >
        <router-view v-if="currentUser" :key="$route.fullPath"></router-view>
      </b-card>
    </div>
    <div v-if="!currentUser">
      <router-view v-if="!currentUser" :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Constants from "./plugins/Constants.js";

Vue.use(Constants);

export default {
  data() {
    return {
      gotoUpdate: false,
      //---------
      userId: null,
      password: '',
      sideBarCollapsed: false,
      sideBarMenu: []
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    shouldShowSidebar() {
      if( this.gotoUpdate == true ) {
        return false;
      }
      return this.$store.state.auth.user;
    }
  },
  methods: {
    sidbarStateChange() {
      this.sideBarCollapsed = !this.sideBarCollapsed;
    },
    onToggleCollapse(collapsed) {
      this.sideBarCollapsed = collapsed;
    },
    catchError(error) {
        console.log(error);
        if( error.response != null && error.response.status == 401 ) {
          this.showMsgBoxConfirm(
            'Sesión inválida o expirada. Por favor, realize login',
            'danger',
            'Error',
            'sm'
          );
          this.logOut();
          return;
        }
        this.showMsgBoxConfirm(
          'A problem occurred. Please contact the administrator',
          'danger',
          'Error',
          'sm'
        );
    },
    showMsgBoxConfirm(msg, vari, title, size) {
      this.$bvModal
        .msgBoxOk(msg, {
          title: title,
          size: size,
          buttonSize: 'sm',
          okVariant: vari,
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
        .then(value => {
          this.msgValue = value;
        });
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    updateSidebar() {
      this.sideBarMenu = [
        {
          header: 'mainmenu',
          title: 'Menú principal',
          hiddenOnCollapse: true
        }
      ];
      if( this.currentUser === null ) {
        return;
      }
      if( this.currentUser.roles.includes('ROLE_USER')) {
        this.sideBarMenu.push(Vue.prototype.$constants().sidebarMenuUser);
      }
      if( this.currentUser.roles.includes('ROLE_INSPECTOR') ) {
        this.sideBarMenu.push(Vue.prototype.$constants().sidebarMenuManager);
      }
      if( this.currentUser.roles.includes('ROLE_ADMIN') ) {
        this.sideBarMenu.push(Vue.prototype.$constants().sidebarMenuAdmin);
      }
      this.gotoUpdate = true;
      this.gotoUpdate = false;
    }
  },
  mounted() {
    this.updateSidebar();
  }
};
</script>
<style>
@font-face {
  font-family: 'Sans';
  src: local('Sans'), url(./fonts/ProductSans-Regular.ttf) format('truetype');
}
.main {
  font-family: 'Sans';
  font-size: 14px;
  color: #000;
}
body
{
  background-image: linear-gradient(#e8e8ea, #ebe9e9);
}
.navbar
{
  background: linear-gradient(to right, #2a2a2e 50%, #c3c3c5 90% );
}
.card-login {
  max-width: 350px;
  background-color: #ffffff;
  margin: 150px auto 25px;
  border-radius: 20px;
  border-color: #dddddd;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 3px -2px rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
}
.card-form {
  background-color: #edffde;
  margin: 0px 0px 0px 0px;
  padding: auto;
  border-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 3px -2px rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
}
.actionButton {
  border-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 3px -2px rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
}
.actionButtonCheck {
  border-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 3px -2px rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
  width: 100px;
  height: 100px;
  margin: 10px 20px 10px 20px;
}
.gradient {
  background-image: linear-gradient(#222222, #2a2a2e);
}
.qtyField {
  max-width: 80px;
}
</style>
