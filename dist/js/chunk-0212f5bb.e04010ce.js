(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0212f5bb"],{"6f73":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t._self._c;return e("div",[e("b-collapse",{attrs:{id:"formCollapse"}},[e("b-form",{on:{submit:function(e){return e.preventDefault(),t.processForm.apply(null,arguments)}}},[e("h4",{staticClass:"mt-4 mb-3"},[t._v("User information")]),e("b-row",{staticClass:"mb-3"},[e("b-col",[e("label",{staticClass:"form-label",attrs:{for:"username"}},[t._v("Username")]),e("b-form-input",{attrs:{disabled:t.editState,id:"username"},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}})],1),e("b-col",[e("label",{staticClass:"form-label",attrs:{for:"email"}},[t._v("Email")]),e("b-form-input",{attrs:{disabled:t.editState,id:"email"},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}})],1),e("b-col",{attrs:{cols:"3"}},[e("label",{staticClass:"form-label",attrs:{for:"type"}},[t._v("Rol")]),e("b-form-select",{attrs:{options:t.$constants().optionsRolType},model:{value:t.rol,callback:function(e){t.rol=e},expression:"rol"}})],1),e("b-col",{attrs:{cols:"3"}},[e("label",{staticClass:"form-label",attrs:{for:"password"}},[t._v("Password")]),e("b-form-input",{attrs:{disabled:t.editState,type:"password",id:"password"},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1)],1),e("b-row",{staticClass:"mb-3"},[e("b-col",[e("label",{staticClass:"form-label",attrs:{for:"sites"}},[t._v("Sites")]),e("multiselect",{attrs:{options:t.sites,multiple:!0,"close-on-select":!1,placeholder:"Select options"},model:{value:t.sitesSelected,callback:function(e){t.sitesSelected=e},expression:"sitesSelected"}})],1)],1),e("div",{staticClass:"d-grid gap-2 d-md-flex justify-content-md-end"},[e("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle:formCollapse",arg:"formCollapse"}],staticClass:"actionButton",attrs:{variant:"outline-danger"},on:{click:function(e){return t.reset()}}},[e("i",{staticClass:"far fa-times-circle mr-1"}),t._v("Cancel")]),e("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle:formCollapse",arg:"formCollapse"}],staticClass:"actionButton",attrs:{variant:"outline-success",type:"submit"}},[e("i",{staticClass:"far fa-check-circle mr-1"}),t._v(t._s(t.txtBtnFormulario))])],1)],1)],1)],1)},i=[],r=(s("7f7f"),{name:"User",data:function(){return{id:"",username:"",email:"",password:"",roles:[],rol:"",value:null,perPage:10,currentPage:1,txtBtnFormulario:"Save",editState:!1,sites:[],sitesSelected:[]}},methods:{getData:function(){var t=this;this.$parent.getDataFromType("site").then((function(e){for(var s=0;s<e.length;s++)t.sites.push(e[s].name)})).catch((function(e){return t.$parent.catchError(e)}))},processForm:function(){for(var t=[],e=0;e<this.sitesSelected.length;e++)t.push({code:"site",value:this.sitesSelected[e]});if(this.roles.push(this.rol),0==this.editState){var s={username:this.username,email:this.email,password:this.password,role:this.roles,attributes:t};this.$parent.saveData(s)}else{var a={id:this.id,username:this.username,email:this.email,password:this.password,role:this.roles,attributes:t};this.$parent.updateData(a)}console.log("SitesSelected"+this.sitesSelected),this.reset()},reset:function(){this.id="",this.username="",this.email="",this.password="",this.roles=[],this.rol="",this.sitesSelected=[],this.txtBtnFormulario="Save",this.editState=!1},loadItem:function(t){this.editState=!0,this.id=t.id,this.username=t.username,this.email=t.email,this.password="","ROLE_INSPECTOR"==t.roles[0].name&&(this.rol="ROLE_INSPECTOR"),"ROLE_ADMIN"==t.roles[0].name&&(this.rol="ROLE_ADMIN");for(var e=0;e<t.attributes.length;e++)"site"==t.attributes[e].code&&this.sitesSelected.push(t.attributes[e].value);this.txtBtnFormulario="Update"}},computed:{currentUser:function(){return this.$store.state.auth.user}},mounted:function(){this.currentUser||this.$router.push("/login"),this.getData()},components:{}}),l=r,o=s("2877"),n=Object(o["a"])(l,a,i,!1,null,null,null);e["default"]=n.exports},"7f7f":function(t,e,s){var a=s("86cc").f,i=Function.prototype,r=/^\s*function ([^ (]*)/,l="name";l in i||s("9e1e")&&a(i,l,{configurable:!0,get:function(){try{return(""+this).match(r)[1]}catch(t){return""}}})}}]);
//# sourceMappingURL=chunk-0212f5bb.e04010ce.js.map