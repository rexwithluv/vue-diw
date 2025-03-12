<template>
  <NavBar></NavBar>
  <h2 class="text-center fw-bold py-3">
    <i class="bi bi-person-fill"></i>
    Iniciar sesión
    <router-link to="/" class="ms-5">
      <i class="fas fa-reply"></i>
    </router-link>
  </h2>

  <div class="container-fluid px-4">
    <div class="col-10 col-m-6 col-lg-8 mx-auto">
      <form class="row m-auto gx-4 gy-3 border rounded bg-light pb-3">
        <!-- DNI -->
        <div class="col-12">
          <div class="input-group">
            <label class="input-group-text">DNI</label>
            <input
              type="text"
              class="form-control"
              placeholder="DNI"
              required
              v-model="usuario.dni"
              @blur="validarDni(this.usuario.dni)"
            />
          </div>
        </div>

        <!-- Contraseña -->
        <div class="col-12">
          <div class="input-group">
            <label class="input-group-text">Contraseña</label>
            <input
              type="password"
              class="form-control"
              placeholder="Contraseña"
              v-model="usuario.passwd"
            />
          </div>
        </div>

        <!-- Botón enviar -->
        <div class="col-12">
          <button
            type="button"
            class="btn btn-primary px-4 mt-3"
            @click.prevent="login()"
          >
            <i class="bi bi-person-plus-fill"></i>
            Log in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { verificarContrasenya } from "@/config/passport.mjs";
import Swal from "sweetalert2";

export default {
  name: "TablaComentarios",

  data() {
    return {
      usuario: {
        dni: "",
        passwd: "",
      },
    };
  },

  methods: {
    // Alerta usada a lo largo del programa
    mostrarAlerta(titulo, mensaje, icono) {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        customClass: {
          container: "custom-alert-container",
          popup: "custom-alert-popup",
          modal: "custom-alert-modal",
        },
      });
    },

    validarDni(dni) {
      if (dni.length === 0) {
        return true;
      }

      const dniPattern = /^[XYZ]?\d{5,8}[A-Z]$/;
      const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKE";

      if (!dniPattern.test(dni)) {
        Swal.fire("Error", "El formato del DNI/NIE es incorrecto", "error");
        return false;
      }

      let number = dni.substr(0, dni.length - 1);
      const letter = dni.substr(dni.length - 1, 1).toUpperCase();

      if (dni[0] === "X") number = number.replace("X", "0");
      if (dni[0] === "Y") number = number.replace("Y", "1");
      if (dni[0] === "Z") number = number.replace("Z", "2");

      const calculatedLetter = dniLetters[number % 23];
      if (calculatedLetter !== letter) {
        Swal.fire("Error", "La letra del DNI/NIE no es correcta", "error");
        return false;
      }

      return true;
    },

    async login() {
      const response = await fetch("http://localhost:3000/usuarios");
      if (!response.ok) {
        throw new Error(
          `Error al obtener los usuarios: ${response.statusText}`
        );
      }

      const usuariosExistentes = await response.json();
      const usuarioEncontrado = usuariosExistentes.find(
        (u) => u.dni === this.usuario.dni
      );

      const contrasenyaCorrecta = await verificarContrasenya(
        this.usuario.passwd,
        usuarioEncontrado.passwd
      );

      if (contrasenyaCorrecta) {
        localStorage.setItem("isLogueado", "true");
        localStorage.setItem("email", usuarioEncontrado.email);

        if (usuarioEncontrado.tipoUsuario === "2") {
          localStorage.setItem("isAdmin", "true");
        }

        Swal.fire({
          title: "Bienvenida/o",
          text: "Sesión iniciada correctamente",
          icon: "success",
          showConfirmButton: true,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          this.$router.push({ name: "inicio" }).then(() => {
            window.location.reload();
          });
        });
      }
    },
  },
};
</script>

<style scoped></style>
