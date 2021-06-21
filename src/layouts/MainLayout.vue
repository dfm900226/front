<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title> Recursos humanos </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8"> Administrador </q-item-label>
        <q-item
          v-for="item in links"
          :key="item.name"
          clickable
          v-ripple
          :active="link === item.name"
          @click="link = item.name"
          active-class="my-menu-link"
          :to='item.route'
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>{{item.title}}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(false);

    return { leftDrawerOpen,  };
  },
  data() {
    return {
      link:'trabajadores',
      links:[
        {name:'trabajadores', icon:'engineering', title:'Trabajadores', route:'/trabajadores'},
        {name:'usuarios', icon:'person', title:'Usuarios', route:'/usuarios'},
        {name:'puestos_laborales', icon:'work', title:'Puestos Laborales', route:'/puestos_laborales'},
        // {name:'categorias', icon:'category', title:'Categorias Laborales', route:'/categorias'},
        {name:'entidades', icon:'corporate_fare', title:'Entidades', route:'/entidades'},
      ]
    }
  },
});
</script>
<style lang="sass">

</style>
