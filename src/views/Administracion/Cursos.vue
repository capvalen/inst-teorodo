<template>
	<div class="text-start">
		<p class="fs-3">Edición de Cursos</p>
		<p>Seleccione el filtro de carrera para ver sus cursos:</p>
		<div class="row row-col-2">
			<div class="col">
				<select class="form-select" id="sltCarreras" v-model="idCarrera" @change="cargarCursos()">
					<option value="-1">Seleccione la carrera</option>
					<option v-for="carrera in carreras" :value="carrera.id">{{carrera.carrera}}</option>
				</select>
			</div>
			<div class="col">
				<button class="btn btn-outline-success" @click="crearModalCurso()"><i class="bi bi-asterisk"></i> Nuevo curso</button>
			</div>
		</div>
		<hr>
		<p class="mt-3">Datos de la carrera: <span class="fw-bold">{{ nombreCarrera }}</span> </p>
		<table class="table table-hover mt-3">
			<thead>
				<th>N°</th>
				<th>Curso</th>
				<th>Créditos</th>
			</thead>
			<tbody>
				<tr v-for="(curso, index) in cursos">
					<td>{{ index+1 }}</td>
					<td>{{ curso.curso }}</td>
					<td>{{ curso.creditos }}</td>
					<td class="d-grid gap-2 d-flex ">
						<button class="btn btn-outline-primary btn-sm" @click="editarModalCurso(curso.id, index)"><i class="bi bi-pencil-square"></i></button>
						<button class="btn btn-outline-danger btn-sm" @click="eliminarCurso(curso.id, index)"><i class="bi bi-trash3"></i></button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- Modal -->
	<div class="modal fade" id="modalCurso" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header border-0">
					<h1 class="modal-title fs-5" id="exampleModalLabel">
						<span v-if="estado=='crear'">Nuevo Curso</span>
						<span v-if="estado=='editar'">Editar Curso</span>
					</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body ">
					<p>Complete los datos necesarios:</p>
					<label for="">Carrera <span class="text-danger">*</span></label>
					<select class="form-select" id="sltCarreras" v-model="cursoNuevo.idCarrera">
						<option value="-1">Seleccione la carrera</option>
						<option v-for="carrera in carreras" :value="carrera.id">{{carrera.carrera}}</option>
					</select>
					<label for="">Nombre del curso <span class="text-danger">*</span></label>
					<input type="text" class="form-control" v-model="cursoNuevo.curso">
					<label for="">Cantidad de créditos <span class="text-danger">*</span></label>
					<input type="number" step="1" min="1" class="form-control" v-model="cursoNuevo.creditos">
				</div>
				<div class="modal-footer border-0">
					<button type="button" class="btn btn-outline-primary" @click="hacerCurso()">
						<span v-if="estado=='crear'"><i class="bi bi-asterisk"></i> Crear curso</span>
						<span v-if="estado=='editar'"><i class="bi bi-pencil-square"></i> Actualizar curso</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	props:['carreras'],
	data() {
		return {
			idCarrera:-1, cursos:[], nombreCarrera:'', idCurso:-1, nombreCurso:'', cursoNuevo:{idCarrera:-1, curso:'', creditos:1, idCurso:-1}, estado:'crear'
		}
	},
	methods:{
		cargarCursos(){
			if(this.idCarrera>-1){
				let datos = new FormData();
				datos.append('pedir', 'listarPorCarrera')
				datos.append('idCarrera', this.idCarrera)
				this.axios.post(this.servidor+'Cursos.php', datos )
				.then(res => {
					this.cursos = res.data
					const sltCarreras = document.getElementById(`sltCarreras`);
					this.nombreCarrera = sltCarreras.options[sltCarreras.selectedIndex].text
				})
			}
		},
		eliminarCurso(id, index){
			let datos = new FormData();
			datos.append('pedir', 'eliminar')
			datos.append('idCurso', id)
			this.axios.post(this.servidor+'Cursos.php', datos )
			.then(() => this.cursos.splice(index,1) )
		},
		crearModalCurso(){
			this.estado = 'crear';
			this.cursoNuevo.idCarrera = -1
			this.cursoNuevo.idCurso = -1
			const modalCurso = new bootstrap.Modal('#modalCurso')
			modalCurso.show()
		},
		hacerCurso(){
			if(this.cursoNuevo.idCarrera==-1)
				alertify.error('<i class="bi bi-bug"></i> Debe seleccionar la carrera', 10)
			else if(this.cursoNuevo.curso.trim()=='')
				alertify.error('<i class="bi bi-bug"></i> Debe ingresar un nombre', 10)
			else if(this.cursoNuevo.creditos<0)
				alertify.error('<i class="bi bi-bug"></i> Debe ingresar crédito', 10)
			else{
				let datos = new FormData();
				
				if( this.estado == 'crear' )
					datos.append('pedir', 'crear')
				if( this.estado == 'editar' )
					datos.append('pedir', 'editar')
				
				datos.append('curso', JSON.stringify(this.cursoNuevo))

				this.axios.post(this.servidor+'Cursos.php', datos )
				.then(()=>{
					const cerrar = document.querySelector('#modalCurso .btn-close')
					cerrar.click()
					alertify.message('<i class="bi bi-check-lg"></i> Registrado correctamente', 10)	
					this.cargarCursos();
				})

			}
		},
		editarModalCurso(id, index){
			this.estado = 'editar';
			this.cursoNuevo.idCarrera = this.cursos[index].idCarrera
			this.cursoNuevo.idCurso = id
			this.cursoNuevo.curso = this.cursos[index].curso
			this.cursoNuevo.creditos = this.cursos[index].creditos

			const modalCurso = new bootstrap.Modal('#modalCurso')
			modalCurso.show()
		},
		editarCurso(){

		}
	}
	
}
</script>