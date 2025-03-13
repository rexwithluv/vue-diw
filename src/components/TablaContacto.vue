<template>
    <h2 class="text-center fw-bold py-4 mb-3">
        <i class="fas fa-file-alt"></i>
        Contacto
        <router-link to="/" class="ms-5">
            <i class="fas fa-reply"></i>
        </router-link>
    </h2>

    <div class="container-fluid px-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form class="row gy-3 pb-3 border rounded bg-light">
                <!-- Apellidos y nombre -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Nombre</label>
                        <input type="text" class="form-control" placeholder="Nombre" v-model="contacto.nombre"
                            required />
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Teléfono</label>
                        <input type="text" class="form-control" placeholder="000000000" v-model="contacto.telefono"
                            required />
                    </div>
                </div>

                <!-- Email -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text">Email</label>
                        <input type="email" class="form-control" placeholder="Email" v-model="contacto.email"
                            required />
                    </div>
                </div>

                <!-- Mensaje -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text">Mensaje</label>
                        <textarea class="form-control" placeholder="Esto es un mensaje..."
                            v-model="contacto.mensaje"></textarea>
                    </div>
                </div>

                <!-- Botón enviar -->
                <div class="col-12">
                    <button type="button" class="btn btn-primary px-4 mt-3" @click.prevent="enviarCorreo()">
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
export default {
    name: "PaginaInicio",
    data() {
        return {
            contacto: {
                nombre: "",
                telefono: "",
                email: "",
                mensaje: "",
            },
            mensajeError: "",
        };
    },
    computed: {
        esNombreValido() {
            return this.contacto.nombre.trim() !== "";
        },

        esTelefonoValido() {
            const regexTelefono = /^[67]\d{8}$/;
            return regexTelefono.test(this.contacto.telefono);
        },

        esEmailValido() {
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regexEmail.test(this.contacto.email);
        },
    },
    methods: {
        enviarCorreo() {
            if (this.esNombreValido && this.esTelefonoValido && this.esEmailValido) {
                fetch("http://localhost:5000/enviar-correo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.contacto),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message) {
                            this.contacto.nombre = "";
                            this.contacto.telefono = "";
                            this.contacto.email = "";
                            this.contacto.mensaje = "";
                            this.mostrarAlerta(
                                "Enviado",
                                "Mensaje enviado con éxito",
                                "success"
                            );
                        } else {
                            this.mensajeError =
                                "Hubo un problema al enviar el mensaje. Inténtalo de nuevo";
                            this.mostrarAlerta(
                                "Error",
                                this.mensajeError,
                                "error"
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.mensajeError =
                            "Hubo un problema en la conexión del servidor al enviar el mensaje. Intenta de nuevo";
                        this.mostrarAlerta(
                            "Error",
                            this.mensajeError,
                            "error"
                        );
                    });
            } else {
                console.log(
                    this.contacto.nombre,
                    this.contacto.telefono,
                    this.contacto.email
                );
                console.log(
                    this.esNombreValido,
                    this.esTelefonoValido,
                    this.esEmailValido
                );
                this.mostrarAlerta(
                    "Error",
                    "Por favor completa todos los campos correctamente",
                    "error"
                );
            }
        },

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
    },
};
</script>

<style></style>
