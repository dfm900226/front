<template>
  <div class="q-pa-md">
    <q-dialog v-model="dialog">
      <q-card class="q-pa-md">
        <div class="text-h6">
          {{ editedIndex >= 0 ? 'Editando Trabajador' : 'Nuevo trabajador' }}
        </div>
        <q-card-section>
          <div class="row">
            <q-input
              ref="form.nombre"
              v-model="form.nombre"
              type="text"
              label="Nombre"
              class="col-5 q-pa-sm"
              :rules="nameRules"
            />
            <q-input
              v-model="form.apellidos"
              type="text"
              class="col-7 q-pa-sm"
              label="Apellidos"
              :rules="nameRules"
            />
          </div>
          <div class="row">
            <q-input
              v-model="form.dni"
              type="text"
              class="q-pa-sm col-5"
              label="DNI"
              :rules="dniRules"
            />
            <q-input
              v-model="form.direccion"
              type="text"
              class="q-pa-sm col-7"
              label="Direccion"
              :rules="dirRules"
            />
          </div>
          <div class="row">
            <q-select
              v-model="entidadSelected"
              :options="entidades"
              option-label="nombre"
              class="q-pa-sm col-6"
              :rules="[value =>   value != null ||  'Seleccion requerida' ]"
              label="Entidad"
            />
            <q-input
              :hint="['Fecha de nacimiento','', 'Mayor de 18' ]"
              v-model="form.fecha_nacimiento"
              mask="date"
              class="col-6 q-pa-sm"
              :rules="[value => value != null || 'Fecha requerida ',]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="form.fecha_nacimiento" :locale="myLocale" :navigation-max-year-month="fechaAdulto">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Aceptar" color="primary" />
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row">
            <!-- <q-input v-model="form.image" type="text" label="Imagen" /> -->
            <q-file
              class="q-mt-xl col-12"
              v-model="files"
              label="Seleccione foto de perfil "
              filled
              counter
              max-file-size="204800"
              accept=".jpg, .pdf, image/*"
              max-files="1"
              multiple
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="guardar" color="primary" disabled="btnForm" @click="saveItem()" />
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm"
            >You are currently not connected to any network.</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <h4>Trabajadores de la entidad</h4>

    <q-btn
      color="primary"
      icon="add"
      label="nuevo"
      @click="nuevoTrabajador()"
      class="q-mb-md"
    />
    <q-table :data="data" :columns="columns" row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td :props="props" key="nombre">{{ props.row.nombre }}</q-td>
          <q-td :props="props" key="apellidos">{{ props.row.apellidos }}</q-td>
          <q-td :props="props" key="dni">{{ props.row.dni }}</q-td>
          <q-td :props="props" key="dni">{{ props.row.puesto_laboral }}</q-td>
          <q-td :props="props" key="fecha_nacimiento">{{
            props.row.fecha_nacimiento
          }}</q-td>
          <q-td :props="props" key="direccion">{{ props.row.direccion }}</q-td>
          <q-td :props="props" key="image">
            <q-avatar size="35px">
              <img src="image/autoriaaaaaa.png" />
            </q-avatar>
          </q-td>
          <q-td :props="props" key="actions">
            <q-btn
              color="red"
              icon="edit"
              size="x-small"
              @click="editItem()"
              class="q-mr-sm"
            />
            <q-btn
              color="blue-grey lighten"
              icon="delete"
              size="x-small"
              @click="deletItem()"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import axios from 'axios';
import { Notify } from 'quasar'
axios.defaults.baseURL = 'http://localhost:8000/api/v1';

export default {
  setup (){
    return {
      showNotif () {
        Notify.create({
            type: 'warning',
            color: 'warning',
            timeout: 2000,
            position: 'bottom',
            message: 'No existen Entidades a las que asociar el trabajador.'
          })
      }
    }
  },
  created() {
    this.getData();
  },
  data() {
    return {
      files: null,
      imagen: null,
      columns: [
        {
          name: 'nombre',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: (row) => row.nombre,
          format: (val) => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 100px',
          headerClasses: 'bg-primary text-white',
        },
        {
          name: 'apellidos',
          align: 'center',
          label: 'Apellidos',
          field: 'apellidos',
          sortable: true,
        },
        {
          name: 'dni',
          label: 'DNI',
          align: 'center',
          field: 'dni',
          sortable: true,
        },
        {
          name: 'fecha_nacimiento',
          align: 'center',
          label: 'Fecha de nacimiento',
          field: 'fecha_nacimiento',
        },
        {
          name: 'direccion',
          align: 'center',
          label: 'Direccion',
          field: 'direccion',
        },
        {
          name: 'puesto_laboral',
          align: 'center',
          label: 'Puesto Laboral',
          field: 'puesto_laboral',
        },
        { name: 'image', label: 'Foto (img)', field: 'image' },

        {
          name: 'actions',
          label: 'Opciones',
          sortable: false,
          field: 'actions',
        },
      ],
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
          '_'
        ),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split(
          '_'
        ),
        firstDayOfWeek: 1,
      },
      fechaAdulto:((new Date().getFullYear())- 18) +'/01',
      form: {},
      user: {},
      entidadSelected: null,
      dialog: false,
      file_path: null,
      entidades: [],
      dialogConfirm: false,
      editedIndex: -1,
      editedItem: {},
      data: [],
      nameRules: [
        (v) => !!v || 'Requerido',
        (v) =>
          (v || '').length <= 20 || 'Debe contener menos de 20 caracteres.',
        (v) => /^[a-zA-Z' ']+$/.test(v) || 'Solo debe contener letras.',
        ,
      ],
      dirRules: [
        (v) => !!v || 'Requerido',
        (v) =>
          (v || '').length <= 30 || 'Debe contener menos de 30 caracteres.',
        ,
      ],
      dniRules: [
        (v) => !!v || 'Requerido',
        (v) =>
          (((v || '').length > 7) && ((v || '').length < 20))|| 'Debe contener al menos 8 caracteres y menos de 20.',
        ,
      ],
    };
  },
  watch: {
    dialog(nVal) {
      nVal ? this.getEntidades() : (this.form = {});
    },
    entidadSelected(nVal) {
      this.form.entidad_id = nVal != null ? this.entidadSelected.id : null;
    },
  },
  computed: {
    btnForm(){
      if( this.form.nombre.value.hasError){
        return true;
      }else {
        return false
      }
    },
    urlImage(image) {
      return 'image/' + image;
    },
    onlyAdult(){
      var year = new Date()

    }
  },
  methods: {
    nuevoTrabajador(){
      this.dialog = true;
      if(this.entidades.length == 0){
         this.showNotif();
      }
    },
    test() {
      console.log(this.files);
    },
    onFileSelected(event) {
      console.log(event);
    },
    getEntidades() {
      axios
        .get('/entidad')
        .then((res) => {
          this.entidades = res.data.dataList;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getData() {
      axios
        .get('/trabajador')
        .then((res) => {
          this.data = [];
          this.data = res.data.dataList;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.form = item;
      this.dialog = true;
    },
    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} la imagen excede los 2 MB seleccione otra porfavor.`,
      });
    },
    uploadFile(file) {
      let img = this.files[0];
      const fileData = new FormData();

      fileData.append('file_path ', img);
      axios
        .post('uploads', fileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response.data);

          // Notify plugin needs to be installed
          // https://quasar.dev/quasar-plugins/notify#Installation
          this.$q.notify({
            type: 'possitive',
            message: `Image Uploaded`,
          });
        });
    },
    saveItem() {
      // console.log(this.form);
      if (this.editedIndex >= 0) {
        axios.put('/trabajador/' + this.form.id, this.form).catch((err) => {
          console.error(err);
        });
      } else {
        const fileData = new FormData();
        fileData.append('image', this.files[0], this.files[0].name);
        fileData.append('nombre', this.form.nombre);
        fileData.append('apellidos', this.form.apellidos);
        fileData.append('dni', this.form.dni);
        fileData.append('fecha_nacimiento', this.form.fecha_nacimiento);
        fileData.append('direccion', this.form.direccion);
        fileData.append('entidad_id', this.form.entidad_id);
        axios
          .post('/trabajador', fileData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            this.dialog = false;
            axios
              .post('/usuario', {
                nombre: this.form.nombre,
                apellidos: this.form.apellidos,
                email: this.form.email,
                dni: this.form.dni,
                trabajador_id: res.data,
              })
              .catch((err) => {
                console.error(err);
              });
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
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, {});
        this.editedIndex = -1;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
