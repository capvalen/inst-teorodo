import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../views/InicioView.vue')	
  },
  {
    path: '/administracion/inicio',
    name: 'AdminHome',
    component: () => import(/* webpackChunkName: "about" */ '../views/Administracion/AdminHome.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
