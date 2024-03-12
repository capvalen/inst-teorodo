<template>
	<div class="mt-4 container">
		<h1 class="fs-1">Gestión de administración</h1>
		<ul class="nav nav-tabs">
			<li class="nav-item" role="presentation">
				<button class="nav-link active" id="carga-tab" data-bs-toggle="tab" data-bs-target="#carga-tab-pane" type="button" role="tab" aria-controls="carga-tab-pane" aria-selected="true"><i class="bi bi-cloud-arrow-up"></i> Carga de notas</button>
			</li>
			
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="cursos-tab" data-bs-toggle="tab" data-bs-target="#cursos-tab-pane" type="button" role="tab" aria-controls="cursos-tab-pane" aria-selected="false"><i class="bi bi-book"></i> Cursos</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="alumnos-tab" data-bs-toggle="tab" data-bs-target="#alumnos-tab-pane" type="button" role="tab" aria-controls="alumnos-tab-pane" aria-selected="false"><i class="bi bi-backpack"></i> Alumnos</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="alumnosLote-tab" data-bs-toggle="tab" data-bs-target="#alumnosLote-tab-pane" type="button" role="tab" aria-controls="alumnosLote-tab-pane" aria-selected="true"><i class="bi bi-cloud-arrow-up"></i> Carga de alumnos</button>
			</li>
		</ul>
		<div class="tab-content" id="myTabContent">
			<div class="tab-pane fade show active bg-body" id="carga-tab-pane" role="tabpanel" aria-labelledby="carga-tab" tabindex="0">
				<Subida></Subida>
			</div>
			<div class="tab-pane fade bg-body text-start" id="cursos-tab-pane" role="tabpanel" aria-labelledby="cursos-tab" tabindex="0">
				<Cursos :carreras="carreras"></Cursos>
			</div>
			<div class="tab-pane fade bg-body text-start" id="alumnos-tab-pane" role="tabpanel" aria-labelledby="alumnos-tab" tabindex="0">
				<Alumnos :carreras="carreras"></Alumnos>
			</div>
			<div class="tab-pane fade bg-body text-start" id="alumnosLote-tab-pane" role="tabpanel" aria-labelledby="alumnosLote-tab" tabindex="0">
				<SubidaAlumnos :carreras="carreras"></SubidaAlumnos>
			</div>
			<div class="tab-pane fade bg-body" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">...</div>
		</div>
	</div>
</template>
<script>
import Subida from "./SubidaNotas"
import SubidaAlumnos from "./SubidaAlumnos"
import Cursos from "./Cursos"
import Alumnos from "./Alumnos"
export default{
	components:{Subida, Cursos, Alumnos, SubidaAlumnos},
	data() {
		return {
			usuario:[], carreras:[]
		}
	},
	mounted() {
		if(sessionStorage.getItem('idNivel')!=1){
			console.log('salir')
			this.$router.push({ name: 'Inicio'});
		}else{
			console.log('logueado')
			this.pedirDatos()
			this.usuario.id = sessionStorage.getItem('id')
			this.usuario.user = sessionStorage.getItem('user')
			this.usuario.idNivel = sessionStorage.getItem('idNivel')
		}
	},
	methods: {
		pedirDatos(){
			let datos = new FormData();
			datos.append('pedir', 'listar')
			this.axios.post(this.servidor+'Carreras.php', datos )
			.then(res => this.carreras = res.data )
		}
	},
}
</script>
<style >
.tab-pane{padding:2rem}
</style>