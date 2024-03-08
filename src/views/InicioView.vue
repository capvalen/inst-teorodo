<template>
	<div class="row mx-0 d-flex justify-content-center mt-5 pt-5" id="inicio">
		<div>
			<div class="col-12 col-md-6 mx-auto mb-3" ><img src="https://iestptrt.edu.pe/wp-content/uploads/2022/08/LOGOWEB.png" alt=""></div>
			<div class="row justify-content-md-center">
				<div class="card col-8">
					<div class="card-body">
						<div class="row">
							<div class="col text-center my-3 py-3" id="izquierda">
								<p class="fs-2">Ubicar Notas del Alumno</p>
								<p>Ingrese su D.N.I. para entregarle sus notas:</p>
								<div class="w-75 mx-auto">
									<input type="text" class="form-control mx-auto " autocomplete="off" v-model="dni">
									<button class="btn btn-outline-success mt-3"><i class="bi bi-search"></i> Realizar búsqueda</button>
								</div>
							</div>
							<div class="col text-center my-3 py-3">
								<p class="fs-2">Ingresar al sistema</p>
								<div class="w-75 mx-auto">
									<p class="text-start">Usuario:</p>
									<input type="text" class="form-control " placeholder="Usuario" autocomplete="off" v-model="usuario.user">
									<p class="text-start">Clave:</p>
									<input type="password" class="form-control  " placeholder="Contraseña" autocomplete="off" v-model="usuario.password">
									<button class="btn btn-outline-secondary mt-3" @click="login()"><i class="bi bi-door-open"></i> Iniciar sesión</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	data() {
		return {
			dni:'', usuario:{user:'', password:''}
		}
	},
	mounted() {
		sessionStorage.removeItem("idUsuario");
		sessionStorage.removeItem("nombreUsuario");
		sessionStorage.removeItem("idNivel");
	},
	methods: {
		login(){
			let datos = new FormData();
			datos.append('pedir', 'login')
			datos.append('usuario', JSON.stringify(this.usuario))
			this.axios.post(this.servidor+'Usuario.php', datos )
			.then( resp => {
				//console.log(resp.data)
				if(resp.data.usuario.user){
					sessionStorage.setItem('idUsuario', resp.data.usuario.id);
					sessionStorage.setItem('nombreUsuario', resp.data.usuario.user);
					sessionStorage.setItem('idNivel', resp.data.usuario.idNivel);
					this.$router.push({ name: 'AdminHome'});
				}else{
					console.log('no existe')
				}
			})
		}
	},
}
</script>

<style scoped>
#inicio{
	min-height: 100vh;
}
#izquierda{
	border-right: 1px solid #ddd;
	
}

</style>