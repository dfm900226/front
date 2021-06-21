<template>
  <q-page class="row q-pa-lg justify-evenly">
    <q-card class="my-card col-4" >
      <q-card-section>
        <div class="text-h6">Registrar Trabajador</div>
        <hr>
        <div class="row">
          <q-input v-model="text" type="text" label="Nombre" class="col-6 q-pa-sm"/>
          <q-input v-model="text" type="text" label="Apellidos" class="col-6 q-pa-sm"  />
        </div>
        <div class="row">
          <q-input v-model="text" type="password" label="Contraseña" class="col-6 q-pa-sm" />
          <q-input v-model="text" type="password" label="Confirmar contraseña"  class="col-6 q-pa-sm"/>
        </div>
        <div class="row">
          <q-input v-model="text" type="text" label="DNI" class="q-pa-sm col-12"  />
        </div>
      </q-card-section>
      <q-card-actions   align="center">
        <q-btn  label="Registrar" color="primary" />
        <q-btn flat  label="Reset" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'PageIndex',
  data() {
    return {

    }
  },


});
</script>
