import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '@/components/PaginaInicio.vue'
import TablaUsuarios from '@/components/TablaUsuarios.vue'
import TablaContacto from '@/components/TablaContacto.vue'
import NotFound from '@/components/NotFound.vue'
import TablaEmpleo from '@/components/TablaEmpleo.vue'
import PoliticaPrivacidad from '@/components/PoliticaPrivacidad.vue'
import AvisoLegal from '@/components/AvisoLegal.vue'
import TablaComentarios from '@/components/TablaComentarios.vue'
import TablaArticulos from '@/components/TablaArticulos.vue'
import RegistroUsuarios from '@/components/RegistroUsuarios.vue'
import FormularioLogin from '@/components/FormularioLogin.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: PaginaInicio,
    meta: { requiresAdmin: true },
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: TablaUsuarios
  },
  {
    path: "/empleo",
    name: "empleo",
    component: TablaEmpleo
  },
  {
    path: "/articulos",
    name: "articulos",
    component: TablaArticulos
  },
  {
    path: "/comentarios",
    name: "comentarios",
    component: TablaComentarios
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: TablaContacto
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroUsuarios
  },
  {
    path: '/login',
    name: 'login',
    component: FormularioLogin
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

// Guardia de navegación global
router.beforeEach((to, from, next) => {

  // Verifica si la ruta requiere administrador
  if (to.meta.requiresAdmin){

    //Verifica si el usuario está logueado y es admin
    const isLogueado = localStorage.getItem("isLogueado") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";


    if (!isLogueado || !isAdmin){

      // Si no es admin, redirígue a otra ruga
      next({name: "login"});
    } else{
      next(); // Permite el acceso a la ruta
    }
  } else{
    next() // Si no es necesaria la verificación
  }
})

export default router
