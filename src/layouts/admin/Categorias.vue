<template>
  <div class="q-pa-md">
    <q-dialog v-model="dialog">
      <q-card style="width: 400px" class="q-pa-md">
        <div class="text-h6">
          {{ editedIndex >= 0 ? 'Editando categoría' : 'Nueva categoría' }}
        </div>

        <q-card-section class="q-px-lg">
          <q-input v-model="form.nombre" type="text" label="Nombre" />
          <q-checkbox v-model="showDescripcion" label="Agregar descripción" />
          <q-input
            v-model="form.descripcion"
            type="textarea"
            label="Descripción"
            v-if="showDescripcion == true"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            color="primary"
            :disabled="validateForm"
            @click="guardarCategoria()"
            label="guardar"
            v-close-popup
          />
          <q-btn
            color="blue-grey"
            @click="dialog = false"
            label="cancelar"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogDelete">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning_amber" text-color="grey" size="xl" />
          <div class="q-ml-sm text-h6">
            ¿Desea borrar este elemento de la lista?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="aceptar" color="primary" @click="deleteItemConfirm()" />
          <q-btn flat label="Cancel" color="blue-grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <h4>Categorías Laborales</h4>
    <q-btn
      color="primary"
      icon="add"
      label="Nuevo"
      @click="dialog = true"
      class="q-mb-md"
    />

    <q-table :data="data" :columns="columns" row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td :props="props" key="nombre">{{ props.row.nombre }}</q-td>
          <q-td :props="props" key="descripcion">{{
            props.row.descripcion
          }}</q-td>
           <q-td :props="props" key="created_at">{{
            props.row.created_at
          }}</q-td>
          <q-td :props="props" key="opciones">
            <q-btn
              color="blue-grey"
              icon="edit"
              size="x-small"
              @click="editItem(props.row)"
              class="q-mr-sm"
            />
            <q-btn
              color="red"
              icon="delete"
              size="x-small"
              @click="deleteItem(props.row)"
            />
          </q-td>
        </q-tr>
        <v-btn color="success"></v-btn>
      </template>
    </q-table>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000/api/v1';
export default {
  created() {},
  mounted() {
    this.getData();
  },
  data() {
    return {
      showDescripcion: false,
      form: {
        nombre: null,
        descripcion: null,
      },
      editedIndex: -1,
      editedItem: {},
      dialog: false,
      dialogDelete: false,
      columns: [
        {
          name: 'nombre',
          required: true,
          label: 'Nombre de la categoría',
          align: 'left',
          field: (row) => row.nombre,
          format: (val) => `${val}`,
          sortable: true,
          style: 'width: 300px',
          headerClasses: 'bg-primary text-white',
        },
        {
          name: 'descripcion',
          align: 'center',
          label: 'Descripción',
          field: 'descripcion',
          sortable: true,
        },

        {
          name: 'created_at',
          align: 'center',
          label: 'Fecha de Creado',
          field: 'created_at',
          sortable: true,
        },
        {
          name: 'opciones',
          label: 'Opciones',
          align: 'right',
          field: 'opciones',
        },
      ],
      data: [],
    };
  },
  watch: {
    dialog(nVal) {
      if (nVal == false) {
        this.editedIndex = -1;
        this.showDescripcion = false;
      }
    },
  },
  computed: {
    validateForm() {},
  },
  methods: {
    getData() {
      axios
        .get('/categoria')
        .then((res) => {
          this.data = res.data.dataList;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    guardarCategoria() {
      if (this.editedIndex < 0) {
        console.log('entrando al crear');

        axios
          .post('/categoria', this.form)
          .then(() => {
            this.getData();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
            console.log('entrando al editar 1');

        axios
          .put('/categoria/' + this.form.id, this.form)
          .then((res) => {
            console.log('entrando al editar');
            this.getData();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    deleteItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.data.splice(this.editedIndex, 1);
      axios
        .delete('/categoria/' + this.editedItem.id)
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, {});
        this.editedIndex = -1;
      });
    },
    editItem(item) {
      console.log('duplicando');
      this.editedIndex = this.data.indexOf(item);
      console.log(this.editedIndex);
      this.form = item;
      this.form.descripcion =
        this.form.descripcion == 'Sin descripcion' ||
        this.form.descripcion.length
          ? ''
          : this.form.descripcion;
      this.showDescripcion = this.form.descripcion.length ? true : false;
      this.dialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
