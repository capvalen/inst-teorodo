<template>
	<div class="text-start">
		<p class="fs-3">Edición de Alumnos</p>
		<p>Seleccione el filtro de carrera y  para ver los alumnos:</p>
		<div class="row row-col-2">
			<div class="col">
				<select class="form-select" id="sltCarreras" v-model="idCarrera" @change="cargarAlumnos()">
					<option value="-1">Seleccione la carrera</option>
					<option v-for="carrera in carreras" :value="carrera.id">{{carrera.carrera}}</option>
				</select>
			</div>
			<div class="col">
				<button class="btn btn-outline-success" @click="crearModalAlumno()"><i class="bi bi-asterisk"></i> Nuevo alumno</button>
			</div>
		</div>
		<hr>
		<p class="mt-3">Datos de la carrera: <span class="fw-bold">{{ nombreCarrera }}</span> </p>
		<table class="table table-hover mt-3">
			<thead>
				<th>N°</th>
				<th>Apellidos y nombres</th>
				<th>D.N.I.</th>
				<th>Edad</th>
				<th>Correo</th>
				<th>Celular</th>
				<th>Sexo</th>
			</thead>
			<tbody>
				<tr v-for="(alumno, index) in alumnos">
					<td>{{ index+1 }}</td>
					<td class="text-capitalize">{{ alumno.nombres }}</td>
					<td>{{ alumno.dni }}</td>
					<td>{{ qEdad(alumno.nacimiento) }}</td>
					<td>{{ alumno.correo }}</td>
					<td>{{ alumno.celular }}</td>
					<td>{{ alumno.sexo == '1' ? 'Femenino': alumno.sexo == '2' ? 'Masculino' : 'Sin especificar' }}</td>
					<td class="d-grid gap-2 d-flex ">
						<button class="btn btn-outline-primary btn-sm" @click="editarmodalAlumno(alumno.id, index)"><i class="bi bi-pencil-square"></i></button>
						<button class="btn btn-outline-danger btn-sm" @click="eliminarAlumno(alumno.id, index)"><i class="bi bi-trash3"></i></button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- Modal -->
	<div class="modal fade" id="modalAlumno" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header border-0">
					<h1 class="modal-title fs-5" id="exampleModalLabel">
						<span v-if="estado=='crear'">Nuevo Alumno</span>
						<span v-if="estado=='editar'">Editar Alumno</span>
					</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body ">
					<p>Complete los datos necesarios:</p>
					<label for="">Carrera <span class="text-danger">*</span></label>
					<select class="form-select" id="sltCarreras" v-model="alumnoNuevo.idCarrera">
						<option value="-1">Seleccione la carrera</option>
						<option v-for="carrera in carreras" :value="carrera.id">{{carrera.carrera}}</option>
					</select>
					<label for="">DNI <span class="text-danger">*</span></label>
					<input type="text" class="form-control" v-model="alumnoNuevo.dni" @change="comprobarDNI()">
					<label for="">Nombre del alumno <span class="text-danger">*</span></label>
					<input type="text" class="form-control" v-model="alumnoNuevo.nombres">
					<label for="">Fecha de nacimiento</label>
					<input type="date" class="form-control" v-model="alumnoNuevo.nacimiento">
					<label for="">Celular</label>
					<input type="text" class="form-control" v-model="alumnoNuevo.celular">
					<label for="">Sexo</label>
					<select class="form-select" id="sltCarreras" v-model="alumnoNuevo.sexo">
						<option value="2">Sin especificar</option>
						<option value="0">Femenino</option>
						<option value="1">Masculino</option>
					</select>
				</div>
				<div class="modal-footer border-0" v-if="valido">
					<button type="button" class="btn btn-outline-primary" @click="hacerAlumno()">
						<span v-if="estado=='crear'"><i class="bi bi-asterisk"></i> Crear alumno</span>
						<span v-if="estado=='editar'"><i class="bi bi-pencil-square"></i> Actualizar alumno</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import moment from 'moment'
export default{
	props:['carreras'],
	data() {
		return {
			idCarrera:-1, alumnos:[], nombreCarrera:'', idAlumno:-1, nombreAlumno:'', alumnoNuevo:{idCarrera:-1, nombres:'', dni:'', nacimiento:null, correo:'', celular:'', sexo:2, id:-1}, estado:'crear', valido:true
		}
	},
	methods:{
		cargarAlumnos(){
			if(this.idCarrera>-1){
				let datos = new FormData();
				datos.append('pedir', 'listarPorCarrera')
				datos.append('idCarrera', this.idCarrera)
				this.axios.post(this.servidor+'Alumnos.php', datos )
				.then(res => {
					this.alumnos = res.data
					const sltCarreras = document.getElementById(`sltCarreras`);
					this.nombreCarrera = sltCarreras.options[sltCarreras.selectedIndex].text
				})
			}
		},
		eliminarAlumno(id, index){
			let datos = new FormData();
			datos.append('pedir', 'eliminar')
			datos.append('idAlumno', id)
			this.axios.post(this.servidor+'Alumnos.php', datos )
			.then(() => this.alumnos.splice(index,1) )
		},
		crearModalAlumno(){
			this.estado = 'crear';
			this.alumnoNuevo.idCarrera = -1
			this.alumnoNuevo.nombres = ''
			this.alumnoNuevo.dni = ''
			this.alumnoNuevo.nacimiento = null
			this.alumnoNuevo.celular = ''
			this.alumnoNuevo.sexo = 2
			const modalAlumno = new bootstrap.Modal('#modalAlumno')
			modalAlumno.show()
		},
		hacerAlumno(){
			if(this.alumnoNuevo.idCarrera==-1)
				alertify.error('<i class="bi bi-bug"></i> Debe seleccionar la carrera', 10)
			else if(this.alumnoNuevo.nombres.trim()=='')
				alertify.error('<i class="bi bi-bug"></i> Debe ingresar apellidos y nombres', 10)
			else if(this.alumnoNuevo.dni<0)
				alertify.error('<i class="bi bi-bug"></i> Debe ingresar un DNI', 10)
			else{
				let datos = new FormData();
				
				if( this.estado == 'crear' )
					datos.append('pedir', 'crear')
				if( this.estado == 'editar' )
					datos.append('pedir', 'editar')
				
				if(this.alumnoNuevo.nacimiento == '') this.alumnoNuevo.nacimiento = null
				datos.append('alumno', JSON.stringify(this.alumnoNuevo))

				this.axios.post(this.servidor+'Alumnos.php', datos )
				.then(()=>{
					const cerrar = document.querySelector('#modalAlumno .btn-close')
					cerrar.click()
					alertify.message('<i class="bi bi-check-lg"></i> Registrado correctamente', 10)	
					this.cargarAlumnos();
				})

			}
		},
		editarmodalAlumno(id, index){
			this.estado = 'editar';
			this.alumnoNuevo.idCarrera = this.alumnos[index].idCarrera
			this.alumnoNuevo.idAlumno = id
			this.alumnoNuevo.nombres = this.alumnos[index].nombres
			this.alumnoNuevo.dni = this.alumnos[index].dni
			this.alumnoNuevo.nacimiento = this.alumnos[index].nacimiento
			this.alumnoNuevo.celular = this.alumnos[index].celular
			this.alumnoNuevo.sexo = this.alumnos[index].sexo

			const modalAlumno = new bootstrap.Modal('#modalAlumno')
			modalAlumno.show()
		},
		comprobarDNI(){
			if(this.alumnoNuevo.dni.length>=8){
				let datos = new FormData();
				datos.append('pedir', 'comprobarDNI')
				datos.append('dni', this.alumnoNuevo.dni)
				this.axios.post(this.servidor+'Alumnos.php', datos )
				.then(res => {
					if(parseInt(res.data.conteo) >0){
						alertify.error('Ya existe el dni')
						this.valido = false
					}else this.valido = true
				})
			}
		},
		qEdad(fecha){
			if(fecha){
				let hoy = moment()
				let nacimiento = moment(fecha)
				return hoy.diff(nacimiento, 'years')
			}
			else return '-'
		}
	}
	
}
</script>