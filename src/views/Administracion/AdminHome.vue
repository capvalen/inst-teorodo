<template>
	<div class="mt-4 container">
		<h1 class="fs-1">Gestión de administración</h1>
		<ul class="nav nav-tabs">
			<li class="nav-item" role="presentation">
				<button class="nav-link active" id="carga-tab" data-bs-toggle="tab" data-bs-target="#carga-tab-pane" type="button" role="tab" aria-controls="carga-tab-pane" aria-selected="true">Carga de datos</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="cursos-tab" data-bs-toggle="tab" data-bs-target="#cursos-tab-pane" type="button" role="tab" aria-controls="cursos-tab-pane" aria-selected="false">Cursos</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="alumnos-tab" data-bs-toggle="tab" data-bs-target="#alumnos-tab-pane" type="button" role="tab" aria-controls="alumnos-tab-pane" aria-selected="false">Alumnos</button>
			</li>
		</ul>
		<div class="tab-content" id="myTabContent">
			<div class="tab-pane fade show active bg-body" id="carga-tab-pane" role="tabpanel" aria-labelledby="carga-tab" tabindex="0">
				<Subida></Subida>
			</div>
			<div class="tab-pane fade bg-body text-start" id="cursos-tab-pane" role="tabpanel" aria-labelledby="cursos-tab" tabindex="0">
				<Cursos :carreras="carreras"></Cursos>
			</div>
			<div class="tab-pane fade bg-body" id="alumnos-tab-pane" role="tabpanel" aria-labelledby="alumnos-tab" tabindex="0">...</div>
			<div class="tab-pane fade bg-body" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">...</div>
		</div>
	</div>
</template>
<script>
import Subida from "./Subida"
import Cursos from "./Cursos"
export default{
	components:{Subida, Cursos},
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