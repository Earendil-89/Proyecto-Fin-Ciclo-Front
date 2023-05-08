<template>
  <div>
    <div class="main">
      <sidebar-menu 
        :menu="sideBarMenu"
        width="220px"
        :collapsed="sideBarCollapsed"
        @toggle-collapse="onToggleCollapse"
      >
        <template v-slot:toggle-icon><i class="fas fa-ellipsis-h"></i></template>
      </sidebar-menu>
      <b-card
        class="card-form"
        v-bind:style="[
          sideBarCollapsed == true
            ? 'margin: 10px 30px 30px 75px; padding: 0px 0px 0px 0px;'
            : 'margin: 10px 30px 30px 245px;padding: 0px 0px 0px 0px;'
        ]"
      >
        <router-view :key="$route.fullPath"></router-view>
      </b-card>
    </div>
  </div>
</template>

<script>
  
export default {
  data() {
    return {
      userId: null,
      password: '',
      sideBarCollapsed: false,
      sideBarMenu: [ {
          header: 'Menu principal',
          hiddenOnCollapse: false
        },
        { href: '/usuario', title: 'Gestión usuarios', icon: 'fas fa-user' },
        { href: '/frase', title: 'Frases seguridad', icon: 'fas fa-exclamation-triangle' },
        { href: '/armario', title: 'Almacenamiento', icon: 'fas fa-box' },
        { href: '/etiqueta', title: 'Etiquetado seguridad', icon: 'fas fa-exclamation-triangle'},
        { href: '/compuesto', title: 'Compuestos químicos', icon :'fas fa-atom' }
      ]
    };
  },
  computed: {
  },
  methods: {
    generateSideBarMenu()
    {
      this.sideBarMenu = [
     
      ];
      this.$forceUpdate();
     
    },
    sidbarStateChange() {
      this.sideBarCollapsed = !this.sideBarCollapsed;
    },
    onToggleCollapse(collapsed) {
      this.sideBarCollapsed = collapsed;
    },
    catchError(error) {
        console.log(error);
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
    }
  },
  mounted() {

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
