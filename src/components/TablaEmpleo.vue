<template>
    <h2 class="text-center fw-bold py-4 mb-3">
        <i class="fas fa-file-alt"></i>
        Trabaja con nosotros
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
                        <label class="input-group-text">Apellidos</label>
                        <input type="text" class="form-control" placeholder="Apellidos" v-model="candidato.apellidos"
                            required>
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Nombre</label>
                        <input type="text" class="form-control" placeholder="Nombre" v-model="candidato.nombre"
                            required>
                    </div>
                </div>

                <!-- Email y móvil -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Email</label>
                        <input type="email" class="form-control" placeholder="Email" v-model="candidato.email"
                            @blur="validarCorreo(this.candidato.email)" required>
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Móvil</label>
                        <input type="text" class="form-control" placeholder="Móvil" v-model="candidato.telefono"
                            @blur="validarTelefono(this.candidato.telefono)" required>
                    </div>
                </div>

                <!-- Categoría y modalidad -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Departamento</label>
                        <select name="departamento" id="departamento" class="form-select"
                            v-model="candidato.departamento">
                            <option value="" disabled>Departamento</option>
                            <option v-for="departamento in departamentos" :key="departamento.id"
                                :value="departamento.id">
                                {{ departamento.nombre }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Modalidad</label>
                        <div class="form-control">

                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="modalidad" value="remoto"
                                    v-model="candidato.modalidad">
                                <label class="form-check-label">Remoto</label>
                            </div>

                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="modalidad" value="hibrido"
                                    v-model="candidato.modalidad">
                                <label class="form-check-label">Híbrido</label>
                            </div>

                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="modalidad" value="presencial"
                                    v-model="candidato.modalidad">
                                <label class="form-check-label">Presencial</label>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Comentarios -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text text-align-top">Comentarios: </label>
                        <textarea class="form-control" placeholder="Comentarios (máximo 256 caracteres)" maxlength="256"
                            v-model="candidato.comentarios"></textarea>
                    </div>
                </div>

                <!-- CV => Curriculum Vitae -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text">CV (PDF)</label>
                        <input type="file" class="form-control" placeholder="CV en formato PDF">
                    </div>
                </div>

                <!-- Acepta condiciones -->
                <div class="col-12 text-start">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" v-model="candidato.acepta">
                        <label class="form-check-label">He leído y acepto las <router-link to="/politica-privacidad"
                                class="link">Políticas de privacidad</router-link></label>
                    </div>
                </div>

                <!-- Botón enviar -->
                <div class="col-12">
                    <button type="button" class="btn btn-primary px-4 mt-3" @click.prevent="guardarCandidato()"
                        :disabled="!candidato.acepta">
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
            candidato: {
                apellidos: '',
                nombre: '',
                email: '',
                telefono: "",
                departamento: "",
                modalidad: "",
                comentarios: "",
                acepta: false,
            },
            departamentos: [],
        }
    },

    mounted() {
        this.getDepartamentos();
    },

    methods: {

        // Getters
        async getDepartamentos() {
            try {
                const response = await fetch("http://localhost:3000/departamentos");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                this.departamentos = await response.json();
            } catch (error) {
                console.log(error);
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
            if (this.candidato.apellidos && this.candidato.nombre && this.candidato.email && this.candidato.telefono && this.candidato.departamento && this.candidato.modalidad) {
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
                        body: JSON.stringify(this.candidato)
                    });

                    if (!guardarResponse.ok) {
                        throw new Error("Error al guardar la candidatura: " + guardarResponse.statusText);
                    }

                    this.mostrarAlerta("Aviso", "Candidatura guardada correctamente", "success");

                    this.candidato = {
                        apellidos: "",
                        nombre: "",
                        email: "",
                        telefono: "",
                        departamento: "",
                        modalidad: "",
                        comentarios: "",
                        acepta: false,
                    }


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

<style scoped>
.text-align-top {
    align-items: baseline;
}
</style>