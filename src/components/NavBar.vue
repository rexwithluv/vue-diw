<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" v-if="isAdmin">
            <router-link
              to="/gestion"
              class="nav-link active"
              :class="{ current: currentRoute === '/gestion' }"
            >
              Gestión
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link active"
              :class="{ current: currentRoute === '/' }"
            >
              Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/tienda"
              class="nav-link active"
              :class="{ current: currentRoute === '/tienda' }"
            >
              Tienda
            </router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link
              to="/usuarios"
              class="nav-link active"
              :class="{ current: currentRoute === '/usuarios' }"
            >
              Usuarios
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/empleo"
              class="nav-link active"
              :class="{ current: currentRoute === '/empleo' }"
            >
              Empleo
            </router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link
              to="/articulos"
              class="nav-link active"
              :class="{ current: currentRoute === '/articulos' }"
            >
              Artículos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/comentarios"
              class="nav-link active"
              :class="{ current: currentRoute === '/comentarios' }"
            >
              Comentarios
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/contacto"
              class="nav-link active"
              :class="{ current: currentRoute === '/contacto' }"
            >
              Contacto
            </router-link>
          </li>
        </ul>

        <input
          class="form-control me-4 w-25 ms-auto"
          type="search"
          placeholder="Buscar"
          aria-label="Search"
        />
        <button class="btn btn-outline-primary bg-light" type="submit">
          <i class="bi bi-search"></i>
        </button>

        <div>
          <router-link
            to="/carrito"
            class="btn btn-primary align-middle position-relative"
            v-if="this.isLogueado"
          >
            <i class="fas fa-shopping-cart"></i>
          </router-link>
          <div
            v-if="this.cartStore.totalItems >= 1"
            class="position-absolute bg-danger text-white rounded-circle d-flex align-items-center justify-content-center z-1"
            style="
              top: -5px;
              right: -5px;
              width: 20px;
              height: 20px;
              font-size: 12px;
            "
          >
            {{ this.cartStore.totalItems }}
          </div>
        </div>

        <div class="dropdown ms-auto">
          <button
            type="button"
            class="btn btn-primary dropdown-toggle"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span class="me-2 fw-bold">{{ this.usuario }}</span>
            <i class="bi bi-person-circle"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li class="dropdown-item">
              <router-link to="/login">Acceso</router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/registro">Registro</router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/logout" @click="logout">
                Cerrar sesión</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useCartStore } from "@/store/carts";

export default {
  name: "NavBar",

  data() {
    return {
      isDropdownVisible: false,
      isAdmin: false,
      isLogueado: false,
      usuario: "",
      cartStore: useCartStore(),
    };
  },

  mounted() {
    this.isAdmin = localStorage.getItem("isAdmin") === "true";
    this.isLogueado = localStorage.getItem("isLogueado") === "true";

    const email = localStorage.getItem("email");
    if (email) {
      this.usuario = this.obtenerNombreUsuario(email);
    }
  },

  computed: {
    currentRoute() {
      return this.$route.path;
    },
  },

  methods: {
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },

    logout() {
      localStorage.removeItem("isLogueado");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("email");

      this.$router.push({ name: "login" }).then(() => window.location.reload());
    },

    async obtenerNombreUsuario(email) {
      const response = await fetch(
        `http://localhost:3000/usuarios?email=${email}`
      );
      if (!response.ok) {
        console.log("Se ha producido un error");
      }

      const usuario = await response.json();
      this.usuario = usuario[0].nombre;
    },
  },
};
</script>

<style scoped>
.nav-link.active:hover {
  color: #fad02e !important;
  font-size: large;
}

.nav-link.active.current {
  color: #8df031 !important;
  font-size: large;
}
</style>
