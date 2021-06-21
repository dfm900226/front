<template>
  <div class="q-pa-md">
    <h4>Usuarios</h4>


    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000/api/v1';
export default {
  data () {
    return {

      columns: [
        {
          name: 'nombre',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: row => row.nombre,
          format: val => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 100px',
          headerClasses: 'bg-primary text-white'
        },
        { name: 'apellidos', align: 'center', label: 'Apellidos', field: 'apellidos', sortable: true },
        { name: 'email', label: 'e-mail',align: 'center',  field: 'email', sortable: true },
      ],

      data: []
    }
  },
  mounted() {
   this.getData();
  },
  created() {
    this.getDatata();
  },
  methods: {
    getData(){
      axios.get('/usuario')
      .then(res => {
        this.data= res.data.dataList;
      })
      .catch(err => {
        console.error(err);
      })
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
