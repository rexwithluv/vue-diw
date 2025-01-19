<template>
    <NavBar></NavBar>
    <h2 class="text-center fw-bold py-3">
        <i class="bi bi-person-fill-add"></i>
        Formulario de registro
        <router-link to="/" class="ms-5">
            <i class="fas fa-reply"></i>
        </router-link>
    </h2>

    <div class="container-fluid px-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form class="row m-auto gx-4 gy-3 border rounded bg-light">

                <!-- Nombre y apellidos -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Nombre</label>
                        <input type="text" class="form-control" placeholder="Nombre" v-model="usuario.nombre">
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Apellidos</label>
                        <input type="text" class="form-control" placeholder="Apellidos" v-model="usuario.apellidos">
                    </div>
                </div>

                <!-- DNI y teléfono -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">DNI/NIE</label>
                        <input type="text" class="form-control" placeholder="DNI-NIE" @blur="validarDni(usuario.dni)"
                            v-model="usuario.dni">
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Teléfono</label>
                        <input type="text" class="form-control" placeholder="Teléfono"
                            @blur="validarTelefono(usuario.telefono)" v-model="usuario.telefono">
                    </div>
                </div>

                <!-- Dirección -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text">Dirección</label>
                        <input type="text" class="form-control" placeholder="Dirección" v-model="usuario.direccion">
                    </div>
                </div>

                <!-- Email y repetición de email -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Email</label>
                        <input type="text" class="form-control" placeholder="Email" @blur="validarCorreo(usuario.email)"
                            v-model="usuario.email">
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">De nuevo</label>
                        <input type="text" class="form-control" placeholder="Repita su email"
                            @blur="validarCorreo(usuario.email2)" v-model="usuario.email2">
                    </div>
                </div>

                <!-- Passwd y repetición de passwd -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Contraseña</label>
                        <input type="password" class="form-control" placeholder="Contraseña" v-model="usuario.passwd">
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">De nuevo</label>
                        <input type="password" class="form-control" placeholder="Repita su contraseña"
                            v-model="usuario.passwd2">
                    </div>
                </div>


                <!-- Provincia, municipio y tipo de usuario -->
                <div class="col-lg-5 col-sm-5">
                    <div class="input-group">
                        <label class="input-group-text">Provincia</label>
                        <select name="provincia" id="provincia" class="form-select"
                            :class="{ 'text-placeholder': usuario.provincia === '' }" v-model="usuario.provincia">
                            <option value="" disabled>Selecciona</option>
                            <option class="text-black" v-for="provincia in provincias" :key="provincia.id"
                                :value="provincia.id">
                                {{ provincia.nm }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-lg-7 col-sm-7">
                    <div class="input-group">
                        <label class="input-group-text">Municipio</label>
                        <select name="municipio" id="municipio" class="form-select" v-model="usuario.municipio"
                            :class="{ 'text-placeholder': usuario.municipio === '' }">
                            <option value="" disabled>Selecciona</option>
                            <option class="text-black" v-for="municipio in municipiosFiltrados" :key="municipio.id"
                                :value="municipio.id">
                                {{ municipio.nm }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Botones -->
                <div class="text-center">
                    <button type="button" class="btn btn-primary fs-5 py-2 m-3 mt-4 w-25"
                        @click.prevent="grabarUsuario()">
                        <i class="bi bi-person-fill-add"></i>
                        Registrarme
                    </button>
                    <button type="button" class="btn btn-primary fs-5 py-2 m-3 mt-4 w-25"
                        @click.prevent="limpiarFormulario()">
                        <i class="bi bi-eraser-fill me-1"></i>
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
import encriptarContrasenya from "@/config/passport.mjs";

export default {
    name: "RegistroUsuarios",

    data() {
        return {
            usuario: {
                dni: "",
                apellidos: "",
                nombre: "",
                direccion: "",
                email: "",
                email2: "",
                passwd: "",
                passwd2: "",
                telefono: "",
                provincia: "",
                municipio: "",
            },
            provincias: [],
            municipios: [],
        }
    },

    mounted() {
        this.getProvincias();
        this.getMunicipios();
    },

    computed: {
        municipiosFiltrados() {
            if (!this.usuario.provincia) {
                return [];
            }
            return this.municipios.filter((municipio) => municipio.id.startsWith(this.usuario.provincia));
        }
    },

    methods: {
        async getProvincias() {
            try {
                const response = await fetch("http://localhost:3000/provincias");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                this.provincias = await response.json();
            } catch (error) {
                console.log(error);
            }
        },
        async getMunicipios() {
            try {
                const response = await fetch("http://localhost:3000/municipios");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                this.municipios = await response.json();
            } catch (error) {
                console.log(error);
            }
        },

        async grabarUsuario() {
            if (this.usuario.dni && this.usuario.nombre && this.usuario.apellidos && this.usuario.telefono && this.usuario.provincia && this.usuario.municipio && this.usuario.email && this.usuario.email2) {

                if (this.usuario.email === this.usuario.email2) {

                    try {
                        const response = await fetch("http://localhost:3000/usuarios");
                        if (!response.ok) {
                            throw new Error("Error al obtener los usuarios: " + response.statusText);
                        }

                        const usuariosExistentes = await response.json();
                        const usuarioExistente = usuariosExistentes.find(usuario => usuario.dni === this.usuario.dni);
                        if (usuarioExistente && usuarioExistente.baja !== "") {
                            this.mostrarAlerta("Aviso", "El DNI está registrado pero dado de baja. Contacte con el administrador.", "error");

                        } else if (usuarioExistente) {
                            this.mostrarAlerta("Error", "El DNI ya está registrado", "error");

                        } else {
                            this.usuario.fechaAlta = new Date().toLocaleString("es-ES", {
                                day: "2-digit", month: "2-digit", year: "numeric"
                            });

                            this.usuario.tipoUsuario = "1";
                            this.usuario.baja = "";
                            delete this.usuario.email2;
                            delete this.usuario.passwd2;

                            const hashedPassword = await encriptarContrasenya(this.usuario.passwd);
                            this.usuario.passwd = hashedPassword;

                            const crearResponse = await fetch("http://localhost:3000/usuarios", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(this.usuario)
                            });

                            if (!crearResponse.ok) {
                                throw new Error("Error al guardar el usuario: " + crearResponse.statusText);
                            }

                            this.mostrarAlerta("Aviso", "Usuario guardado", "success");
                            this.limpiarFormulario();
                        }
                    } catch (error) {
                        console.log(error);
                        this.mostrarAlerta("Error", "No se pudo grabar el usuario.", "error");
                    }

                } else {
                    this.mostrarAlerta("Error", "Los campos de correo electrónico no coinciden", "error");
                }

            } else {
                this.mostrarAlerta("Error", "Por favor completa todos los campos requeridos", "error");
            }
        },

        // Alerta usada en las validaciones
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

        limpiarFormulario() {
            this.usuario = {
                dni: "",
                apellidos: "",
                nombre: "",
                direccion: "",
                email: "",
                email2: "",
                telefono: "",
                provincia: "",
                municipio: "",
            }
        },

        // Validaciones
        validarCorreo(email) {
            if (email.length === 0) {
                return true;
            }
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                Swal.fire(
                    'Error',
                    'El formato del correo electrónico es incorrecto',
                    'error',
                )
                return false;
            }
            return true;
        },
        validarDni(dni) {
            if (dni.length === 0) {
                return true;
            }

            const dniPattern = /^[XYZ]?\d{5,8}[A-Z]$/;
            const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

            if (!dniPattern.test(dni)) {
                Swal.fire('Error', 'El formato del DNI/NIE es incorrecto', 'error');
                return false;
            }

            let number = dni.substr(0, dni.length - 1);
            const letter = dni.substr(dni.length - 1, 1).toUpperCase();

            if (dni[0] === 'X') number = number.replace('X', '0');
            if (dni[0] === 'Y') number = number.replace('Y', '1');
            if (dni[0] === 'Z') number = number.replace('Z', '2');

            const calculatedLetter = dniLetters[number % 23]
            if (calculatedLetter !== letter) {
                Swal.fire('Error', 'La letra del DNI/NIE no es correcta', 'error');
                return false;
            }

            return true;
        },
        validarTelefono(telefono) {
            const regex = /^[67]\d{8}$/gi;
            if (!regex.test(telefono)) {
                Swal.fire('Error', 'El teléfono es incorrecto', 'error');
                return false;
            }
        },
    },
}
</script>

<style scoped>
.text-placeholder {
    color: #595c5f;
}

.error-field {
    border-color: rgb(160, 0, 0);
    background-color: rgb(255, 149, 149);
}
</style>