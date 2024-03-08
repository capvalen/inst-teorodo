<template>
	<div class="text-start">
		<p class="fs-3">Subida de alumnos por lotes</p>
		<p class="">Para cargar los datos del alumnado debe seguir el siguiente formato:
			<a :href="rutaArchivo" download="archivo.xlsx">Descargar Excel</a>
		</p>
		<p>A continuación seleccione su archivo para subirlo</p>
		<div class="d-flex">
			<input type="file" id="fileInput" class="form-control w-50" accept=".xlsx" @change="cargarExcel()">
			<button v-if="verificado" class="btn btn-outline-secondary ms-2" @click="limpiar()"><i class="bi bi-eraser"></i> Limpiar</button>
			<button v-if="validar" class="btn btn-outline-secondary ms-2" @click="validarCarga()"><i class="bi bi-journal-check"></i> Validar registros</button>
			<button v-if="verificado" class="btn btn-outline-success ms-2" @click="registrarExcel()"><i class="bi bi-cloud-upload"></i> Cargar registros</button>

		</div>
		<hr>
		<div>
			<p class="mb-0 fw-bold">Resumen</p>
			<ul>
				<li>Total de registros: <span class="text-success">{{ total }}</span></li>
				<li>Datos hábiles para ingresar: <span class="text-success">{{ habiles }}</span></li>
				<li v-if="sinDni>0">Datos repetidos o DNI incompleto: <span class="text-danger">{{ sinDni }}</span></li>
				<li v-if="sinCarrera>0">Carreras inexistentes: <span class="text-danger">{{ sinCarrera }}</span></li>
			</ul>
			<p v-show="sinDni>0 || sinCarrera>0"><small>Subsane los datos en <span class="text-danger">rojo</span> o no se subirán al servidor.</small></p>
		</div>
		<hr>
		<table class=" mt-3 table table-hover" v-if="data.length > 0">
			<thead>
				<tr>
					<th>DNI</th>
					<th>Nombres</th>
					<th>Carrera</th>
					<th>F. nacimiento</th>
					<th>Correo</th>
					<th>Celular</th>
					<th>Sexo</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, index) in contenido" :class="{ 'table-danger' : !row.validarDni || !row.validarCarrera }">
					<td>{{ row.DNI }}</td>
					<td>{{ row.Nombres }}</td>
					<td>{{ row.Carrera }}</td>
					<td>{{ row.Fecha_Nacimiento }}</td>
					<td>{{ row.Correo }}</td>
					<td>{{ row.Celular }}</td>
					<td>{{ row.Sexo }}</td>
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
			habiles:0, sinDni:0, sinCarrera:0, total:0,
			data: [], contenido:[], validar:false, verificado:false
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
				this.contenido.forEach(fila => {
					fila.validarDni = true
					fila.validarCarrera=true
				})
				this.validar = true
				this.verificado=false
			};
			reader.readAsArrayBuffer(file);
		},
		validarCarga(){
			let datos = new FormData();
			datos.append('pedir', 'validarCarga')
			datos.append('alumnos', JSON.stringify(this.data))
			this.axios.post(this.servidor+'Alumnos.php', datos )
			.then(resp => {
				this.contenido  = resp.data.alumnos;
				this.verificado=true;
				this.contarRepetidos()
			})
		},
		contarRepetidos(){
			this.habiles=0; this.sinDni=0; this.sinCarrera=0; this.total = this.contenido.length;
			this.contenido.forEach(contenido=>{
				if(!contenido.validarDni) this.sinDni++;
				if(!contenido.validarCarrera) this.sinCarrera++;
				if(contenido.validarDni && contenido.validarCarrera) this.habiles++;
			})
		},
		registrarExcel(){
			let datos = new FormData();
			datos.append('pedir', 'registrarExcel')
			datos.append('alumnos', JSON.stringify(this.contenido))
			this.axios.post(this.servidor+'Alumnos.php', datos )
			.then(resp => {
				if(resp.data.contador)
				this.limpiar()
					alertify.message(`Se agregó ${resp.data.contador} alumno${resp.data.contador==1?'':'s'} a la base de datos`)
			})
		},
		limpiar(){
			this.habiles=0; this.sinDni=0; this.sinCarrera=0; this.total =0;
			this.data=[]; this.contenido=[]; this.verificado=false; this.validar=false;
			document.getElementById('fileInput').value=''
		}
	}
}

</script>