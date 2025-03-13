import AvisoLegal from "@/components/AvisoLegal.vue";
import FormularioLogin from "@/components/FormularioLogin.vue";
import NotFound from "@/components/NotFound.vue";
import PaginaInicio from "@/components/PaginaInicio.vue";
import PaginaTienda from "@/components/PaginaTienda.vue";
import PagoAprobado from "@/components/PagoAprobado.vue";
import PagoCancelado from "@/components/PagoCancelado.vue";
import PanelGestion from "@/components/PanelGestion.vue";
import PoliticaPrivacidad from "@/components/PoliticaPrivacidad.vue";
import RegistroUsuarios from "@/components/RegistroUsuarios.vue";
import TablaArticulos from "@/components/TablaArticulos.vue";
import TablaCarrito from "@/components/TablaCarrito.vue";
import TablaComentarios from "@/components/TablaComentarios.vue";
import TablaContacto from "@/components/TablaContacto.vue";
import TablaEmpleo from "@/components/TablaEmpleo.vue";
import TablaUsuarios from "@/components/TablaUsuarios.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "inicio",
    component: PaginaInicio,
  },
  {
    path: "/gestion",
    name: "gestion",
    component: PanelGestion,
    meta: { requiresAdmin: true },
  },
  {
    path: "/tienda",
    name: "PaginaTienda",
    component: PaginaTienda,
  },
  {
    path: "/usuarios",
    name: "usuarios",
    component: TablaUsuarios,
    meta: { requiresAdmin: true },
  },
  {
    path: "/carrito",
    name: "TablaCarrito",
    component: TablaCarrito,
  },
  {
    path: "/empleo",
    name: "empleo",
    component: TablaEmpleo,
  },
  {
    path: "/articulos",
    name: "articulos",
    component: TablaArticulos,
    meta: { requiresAdmin: true },
  },
  {
    path: "/comentarios",
    name: "comentarios",
    component: TablaComentarios,
  },
  {
    path: "/contacto",
    name: "contacto",
    component: TablaContacto,
  },
  {
    path: "/tienda",
    name: "tienda",
    component: PaginaTienda,
  },
  {
    path: "/registro",
    name: "registro",
    component: RegistroUsuarios,
  },
  {
    path: "/login",
    name: "login",
    component: FormularioLogin,
  },
  {
    path: "/politica-privacidad",
    name: "politica-privacidad",
    component: PoliticaPrivacidad,
  },
  {
    path: "/aviso-legal",
    name: "aviso-legal",
    component: AvisoLegal,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/success",
    name: "PagoAprobado",
    component: PagoAprobado,
  },
  {
    path: "/cancel",
    name: "PagoCancelado",
    component: PagoCancelado,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Guardia de navegación global
router.beforeEach((to, from, next) => {
  // Verifica si la ruta requiere administrador
  if (to.meta.requiresAdmin) {
    //Verifica si el usuario está logueado y es admin
    const isLogueado = localStorage.getItem("isLogueado") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    // Si no es admin, redirígue al inicio
    if (!isLogueado || !isAdmin) {
      next({ name: "inicio" });
    }

    // Si es admin permite acceso a la ruta solicitada
    next();
  }

  // Si no necesita verificación permite acceso
  next();
});

export default router;
