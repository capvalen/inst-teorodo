/* import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app') */


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import axios from "axios";

const app = createApp(App)
app.config.globalProperties.servidor = 'http://localhost/inst-teodoro/api/';
//app.config.globalProperties.servidor = 'https://sistema.iestptrt.edu.pe/api/';

app
.use(router)
.use(VueAxios, axios)
.mount('#app')