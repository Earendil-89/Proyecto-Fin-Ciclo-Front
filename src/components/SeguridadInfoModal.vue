<template>
  <div>
     <b-card class="p3 mb-4">
      <img v-for="(etiqueta) in etiquetas" :key="etiqueta.id" :src="etiqueta.imgUrl"/>
     </b-card> 
     <b-card>
      <b-row v-for="(frase) in frases" :key="frase.id">
        <b-col cols="2">
            <b-form-input v-model="frase.codigo" :disabled="true" id="form-key"></b-form-input>
        </b-col>
        <b-col>
            <b-form-input v-model="frase.descripcion" :disabled="true" id="form-info"></b-form-input>
        </b-col>
      </b-row>
     </b-card>
  </div>
</template>

<script>

export default {
  name: 'SeguridadInfoModal',
  props: {
    etiquetas: Array,
    frases: Array
  }
}
</script>

<style scoped>

img
{
  width: 96px;
  height: 96px;
}
#form-key
{
  background-color: rgba(0, 220, 150, 0.25);
}
#form-info
{
  background-color: rgba(188, 201, 118, 0.25);
}
</style>