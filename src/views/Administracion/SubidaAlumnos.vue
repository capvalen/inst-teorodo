<template>
	<div class="text-start">
		<p class="fs-3">Subida de alumnos por lotes</p>
		<p class="">Para cargar los datos del alumnado debe seguir el siguiente formato:
			<a :href="rutaArchivo" download="archivo.xlsx">Descargar Excel</a>
		</p>
		<p>A continuación seleccione su archivo para subirlo</p>
		<div class="d-flex">
			<input type="file" id="fileInput" class="form-control w-50" accept=".xlsx" @change="cargarExcel()">
		<button v-if="validar" class="btn btn-outline-secondary ms-2" @click="validarCarga()"><i class="bi bi-journal-check"></i> Validar registros</button>

		</div>
		<hr>
		<table class=" mt-3 table table-hover" v-if="data.length > 0">
      <thead>
        <tr>
          <th v-for="(value, key) in data[0]" :key="key"  v-show="key!='validar'">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in contenido" :key="index" :class="{ 'table-danger' : !row.validar }" > <!-- -->
					<td v-for="(value, key) in row" :key="key" v-show="key!='validar'">{{ value }}</td>
        </tr>
      </tbody>
    </table>

	</div>
</template>
<script>
import * as XLSX from 'xlsx';

export default{
	data() {
    return {
			rutaArchivo: "/assets/plantilla_alumnos.xlsx",
			data: [], contenido:[], validar:false
    };
  },
	mounted() {
	},
	methods: {
		cargarExcel(){
			const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
				
        this.data = jsonData.map(row => {
					const obj = {};
					for (let i = 0; i < jsonData[0].length; i++) {
						obj[jsonData[0][i]] = row[i];
					}
					return obj;
        });
				this.data.shift()
				this.contenido = this.data
				//this.contenido.shift()
				this.contenido.forEach(fila => fila.validar = true)
				this.validar = true
      };
      reader.readAsArrayBuffer(file);
		},
		validarCarga(){
			let datos = new FormData();
			datos.append('pedir', 'validarCarga')
			datos.append('alumnos', JSON.stringify(this.data))
			this.axios.post(this.servidor+'Alumnos.php', datos )
			.then(resp => this.contenido  = resp.data.alumnos )
		}
	},
}

</script>