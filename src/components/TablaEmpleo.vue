<template>
    <h2 class="text-center fw-bold py-3">Trabaja con nosotros</h2>

    <div class="container-fluid px-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form class="row gy-3 pb-3 border rounded bg-light">

                <!-- Apellidos y nombre -->
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">Apellidos</label>
                        <input type="text" class="form-control" placeholder="Apellidos" v-model="apellidos" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">Nombre</label>
                        <input type="text" class="form-control" placeholder="Nombre" v-model="nombre" required>
                    </div>
                </div>

                <!-- Email y móvil -->
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">Email</label>
                        <input type="email" class="form-control" placeholder="Email" v-model="email"
                            @blur="validarCorreo(this.email)" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">Móvil</label>
                        <input type="text" class="form-control" placeholder="Móvil" v-model="telefono"
                            @blur="validarTelefono(this.telefono)" required>
                    </div>
                </div>

                <!-- CV => Curriculum Vitae -->
                <div class="col-md-12">
                    <div class="input-group">
                        <label class="input-group-text">CV (PDF)</label>
                        <input type="file" class="form-control" placeholder="CV en formato PDF">
                    </div>
                </div>

                <div class="col-md-12">
                    <button type="button" class="btn btn-primary px-4 mt-3" @click.prevent="guardarCandidato()">
                        Mandar CV
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: "TablaEmpleo",

    data() {
        return {
            apellidos: '',
            nombre: '',
            email: '',
            telefono: "",
        }
    },

    methods: {

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
        validarTelefono(telefono) {
            if (telefono.length === 0) {
                return true;
            }

            const regex = /^[67]\d{8}$/gi;
            if (!regex.test(telefono)) {
                Swal.fire('Error', 'El teléfono es incorrecto', 'error');
                return false;
            }
        },

        // Enviar candidatura
        async guardarCandidato() {
            if (this.apellidos && this.nombre && this.email && this.telefono) {
                try {
                    const response = await fetch("http://localhost:3000/candidatos");
                    if (!response.ok) {
                        throw new Error("Error al obtener los candidatos: " + response.statusText);
                    }

                    const guardarResponse = await fetch(`http://localhost:3000/candidatos`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(this)
                    });

                    if (!guardarResponse.ok) {
                        throw new Error("Error al guardar la candidatura: " + guardarResponse.statusText);
                    }

                    this.mostrarAlerta("Aviso", "Candidatura guardada correctamente", "success");

                    this.apellidos = "";
                    this.nombre = "";
                    this.email = "";
                    this.movil = "";

                } catch (error) {
                    console.log(error);
                    this.mostrarAlerta("Error", "No se pudo guardar el candidato.", "error");
                }
            } else {
                this.mostrarAlerta("Error", "Por favor completa todos los campos", "error");
            }
        },
    },
}
</script>

<style></style>