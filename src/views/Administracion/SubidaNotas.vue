<template>
	<div class="text-start">
		<p class="fs-3">Subida de archivo por lotes</p>
		<p class="">Para cargar las notas del alumnado por lotes debe seguir el siguiente formato:
			<a class="text-decoration-none" :href="'/assets/plantilla_notas.xlsx'" download="plantilla_notas.xlsx"><i class="bi bi-file-earmark-spreadsheet"></i> Descargar Excel para notas</a>
		</p>

		<div class="d-flex">
			<input type="file" id="fileInput" class="form-control w-50" accept=".xlsx" @change="cargarExcel()">
			<button v-if="verificado" class="btn btn-outline-secondary ms-2" @click="limpiar()"><i class="bi bi-eraser"></i> Limpiar</button>
			<button v-if="validar" class="btn btn-outline-secondary ms-2" @click="validarCarga()"><i class="bi bi-journal-check"></i> Validar registros</button>
			<button v-if="verificado" class="btn btn-outline-success ms-2" @click="registrarExcel()"><i class="bi bi-cloud-upload"></i> Cargar registros</button>
		</div>
		<div>
			<p class="mb-0 fw-bold">Resumen</p>
			<ul>
				<li>Total de registros: <span class="text-success">{{ total }}</span></li>
				<li>Datos hábiles para ingresar: <span class="text-success">{{ habiles }}</span></li>
				<li v-if="duplicado>0">Registros ya registrados: <span class="text-danger">{{ duplicado }}</span></li>
				<li v-if="sinDni>0">DNI no registrados: <span class="text-danger">{{ sinDni }}</span></li>
				<li v-if="sinCarrera>0">Carreras inexistentes: <span class="text-danger">{{ sinCarrera }}</span></li>
			</ul>
			<p v-show="sinDni>0 || sinCarrera>0"><small>Subsane los datos en <span class="text-danger">rojo</span> o no se subirán al servidor.</small></p>
		</div>
		<hr>

		<!-- CODIGO QUE JALA AUTOMATICAMENTE LOS CAMPOS DE: data
		<table class=" mt-3 table table-hover" v-if="data.length > 0">
			<thead>
				<tr>
					<th v-for="(value, key) in data[0]" :key="key"  v-show="key!='validar'">{{ key }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, index) in contenido" :key="index" :class="{ 'table-danger' : !row.validar }" > 
					<td v-for="(value, key) in row" :key="key" v-show="key!='validar'">{{ value }}</td>
				</tr>
			</tbody>
		</table> -->
		<table class="mt-3 table table-hover" v-if="data.length > 0">
			<thead>
				<tr>
					<th>N°</th>
					<th>DNI</th>
					<th>NOMBRE DEL ALUMNO</th>
					<th>CODIGO DE CURSO</th>
					<th>CURSO</th>
					<th>PARCIAL #1</th>
					<th>PARCIAL #2</th>
					<th>PROMEDIO FINAL</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, index) in contenido" :class="{ 'table-danger' : !row.validarDni || !row.validarCurso || row.duplicado }">
					<td>{{ index+1 }}</td>
					<td>{{ row.DNI }}</td>
					<td>{{ row.nombres }}</td>
					<td>{{ row.CODIGO_CURSO }}</td>
					<td>{{ row.curso }}</td>
					<td>{{ row.PARCIAL_1 }}</td>
					<td>{{ row.PARCIAL_2 }}</td>
					<td>{{ row.PROMEDIO }}</td>
				</tr>
			</tbody>
		</table>

	</div>
</template>
<script>
import * as XLSX from 'xlsx';
export default{
	name: 'SubidaNotas',
	data() {
		return {
			habiles:0, sinDni:0, sinCarrera:0, duplicado:0, total:0,
			data: [], contenido:[], validar:false, verificado:false
		}
	},
	methods:{
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
					fila.validarCurso=true
				})
				this.validar = true
				this.verificado=false
			};
			reader.readAsArrayBuffer(file);
		},
		validarCarga(){
			let datos = new FormData();
			datos.append('pedir', 'validarNotas')
			datos.append('notas', JSON.stringify(this.data))
			this.axios.post(this.servidor+'Cursos.php', datos )
			.then(resp => {
				this.contenido  = resp.data.notas;
				this.verificado=true;
				this.contarduplicados()
			})
		},
		contarduplicados(){
			this.habiles=0; this.sinDni=0; this.sinCarrera=0; this.duplicado=0; this.total = this.contenido.length;
			this.contenido.forEach(contenido=>{
				if(!contenido.validarDni) this.sinDni++;
				if(!contenido.validarCurso) this.sinCarrera++;
				if(contenido.duplicado) this.duplicado++;
				if(contenido.validarDni && contenido.validarCurso && !contenido.duplicado) this.habiles++;
			})
		},
		registrarExcel(){
			let datos = new FormData();
			datos.append('pedir', 'registrarExcel')
			datos.append('notas', JSON.stringify(this.contenido))
			this.axios.post(this.servidor+'Cursos.php', datos )
			.then(resp => {
				if(resp.data.contador)
				this.limpiar()
					alertify.message(`Se agregó ${resp.data.contador} nota${resp.data.contador==1?'':'s'} a la base de datos`)
			})
		},
		limpiar(){
			this.habiles=0; this.sinDni=0; this.sinCarrera=0; this.duplicado=0; this.total =0;
			this.data=[]; this.contenido=[]; this.verificado=false; this.validar=false;
			document.getElementById('fileInput').value=''
		}
	}
}
</script>