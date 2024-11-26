import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '@/components/PaginaInicio.vue'
import TablaUsuarios from '@/components/TablaUsuarios.vue'
import TablaContacto from '@/components/TablaContacto.vue'
import NotFound from '@/components/NotFound.vue'
import TablaEmpleo from '@/components/TablaEmpleo.vue'
import PoliticaPrivacidad from '@/components/PoliticaPrivacidad.vue'
import AvisoLegal from '@/components/AvisoLegal.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: PaginaInicio
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: TablaUsuarios
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: TablaContacto
  },
  {
    path: "/empleo",
    name: "empleo",
    component: TablaEmpleo
  },
  {
    path: "/politica-privacidad",
    name: "politica-privacidad",
    component: PoliticaPrivacidad
  },
  {
    path: "/aviso-legal",
    name: "aviso-legal",
    component: AvisoLegal
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
