<template>
  <div class="q-pa-md">
    <q-dialog v-model="dialog" top  >
      <q-card  class="q-pa-md "  style="width: 600px" >
       <div class="text-h6">{{editedIndex >= 0 ? 'Editando Puesto laboral':'Nuevo Puesto Laboral' }}</div>
       <q-card-section >
         <div class="row">
           <q-input v-model="form.nombre" type="text" label="Nombre" class="col-10 q-pr-xl"
           :rules="[
            value => !!value || 'Este campo es requerido',
            value => /^[a-zA-Z' '0-9]+$/.test(value) || 'Solo numeros y letras admitidos ',
           ]"/>
           <q-select v-model="form.importancia" :options="[1,2,3,4,5,6,7,8,9,10]" options-dense hint="Importancia" class="col-2" />
         </div>
         <div class="row">
           <q-select v-model="categoriaSelected" :options="categorias"  label="Categorias" option-label="nombre" option-value="id" class="col-6 q-pr-md" :rules="[ value => value != null || 'Se requiere una selección' ] "/>
           <q-select v-model="entidadSelected" :options="entidades" option-label="nombre" option-value="id" label="Entidad" class="col-6 q-pl-md" :rules="[ value => value != null || 'Se requiere una selección' ] "/>
         </div>
         <div class="row">
           <q-checkbox  class="q-pt-lg" v-model="form.es_jefe" label="Cargo de jefe" />
         </div>
       </q-card-section>
       <q-card-actions  align="right">
         <q-btn color="primary" label="guardar" :disabled='btnForm' @click="guardarPuesto()" />
         <q-btn color="blue-grey" flat label="cancelar" @click="clearForm()" />
       </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon=""  text-color="blue-grey" />
          <span class="q-ml-sm">¿Esta seguro que desea eliminar este elemento?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="blue-grey" @click="clearForm()" />
          <q-btn  label="Aceptar" color="primary" @click="confirmAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <h4>Puestos Laborales</h4>
    <q-btn color="primary" icon="add" label="Nuevo" @click="dialog = true" class="q-mb-md"/>

    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props='props' >
          <q-td :props="props" key="nombre">{{props.row.nombre}}</q-td>
          <q-td :props="props" key="importancia">{{props.row.importancia}}</q-td>
          <q-td :props="props" key="es_jefe">{{props.row.es_jefe == true ? 'Si': 'No'}}</q-td>
          <q-td :props="props" key="categoria_id">{{props.row.categoria_id}}</q-td>
          <q-td :props="props" key="opciones">
            <q-btn color="blue-grey" icon="edit"  @click="editItem()" size="sm" class="q-mr-sm"/>
            <q-btn color="red" icon="delete"  @click="onClick" size="sm"  />
          </q-td>
        </q-tr>

      </template>
    </q-table>
  </div>
</template>

<script>
import  axios  from "axios";
axios.defaults.baseURL = "http://localhost:8000/api/v1";
export default {
  data () {
    return {
    dialogConfirm: false,
    editedIndex: -1,
    confirmAction: null,
    prueba:'',
      categoriaSelected:null,
      entidadSelected:null,
      categorias:[],
      entidades:[],
      dialog:false,
      form:{
        nombre:'',
        es_jefe:false,
        importancia:1,
        entidad_id:null,
        categoria_id:null,
      },
      columns: [
        {
          name: 'nombre',
          required: true,
          label: 'Nombre del puesto',
          align: 'left',
          field: row => row.nombre,
          format: val => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 100px',
          headerClasses: 'bg-primary text-white'
        },
        { name: 'importancia', align: 'center', label: 'Puntos de importancia', field: 'importancia', sortable: true },
        { name: 'es_jefe', label: 'Cargo de jefe', align: 'center', field: 'es_jefe', sortable: true },
        { name: 'categoria_id', label: 'Categoría', align: 'center', field: 'categoria_id' },
        {  name:'opciones', label: 'Opciones', align: 'center', field:"opciones" },
      ],
      data: []
    }
  },
  watch: {
    categoriaSelected(nVal){
      this.form.categoria_id = nVal.id;
    },
    entidadSelected(nVal){
      this.form.entidad_id = nVal.id;
    },
    dialog(nVal){
      nVal == true ? [this.getEntidades(), this.getCategorias()] : null;
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    btnForm(){
      var d= this.form.nombre && this.form.entidad_id != null && this.form.categoria_id != null ? false: true;
      return d;
    }
  },
  methods: {
    clearForm(){
      this.dialog = false;
      this.form ={
        es_jefe:false,
        importancia:1,
      };

    },
    getCategorias() {
      axios.get('/categoria')
      .then(res => {
        this.categorias = res.data.dataList;
      })
      .catch(err => {
        console.error(err);
      })

    },
    getEntidades(){
      axios.get('/entidad')
      .then(res => {
        this.entidades = res.data.dataList
      })
      .catch(err => {
        console.error(err);
      })
    },
    getData(){
      axios.get('puesto_laboral')
      .then(res => {
       this.data= res.data.dataList;
      })
      .catch(err => {
        console.error(err);
      })
    },
    editItem() {

    },
    guardarPuesto(){
      axios.post('puesto_laboral',this.form).then(()=>{
        this.getData();
        this.dialog= false
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
