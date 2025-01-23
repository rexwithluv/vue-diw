<template>
    <NavBar></NavBar>
    <h2 class="text-center fw-bold py-3">
        <i class="bi bi-chat-left-text"></i>
        Zona de comentarios
        <router-link to="/" class="ms-5">
            <i class="fas fa-reply"></i>
        </router-link>
    </h2>

    <div class="container-fluid px-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">

            <p v-if="!isLogueado" class="fw-bold">
                Solo los usuarios registrados pueden comentar.
                <router-link to="registro">Registrarse</router-link>
            </p>


            <form class="row m-auto gx-4 gy-3 border rounded bg-light pb-3">

                <!-- Email y móvil -->
                <div class="col-7">
                    <div class="input-group">
                        <label class="input-group-text">Email</label>
                        <input type="text" class="form-control" placeholder="Email" required
                            @blur="validarCorreo(this.comentario.email)" v-model="comentario.email">
                    </div>
                </div>
                <div class="col-5">
                    <div class="input-group">
                        <label class="input-group-text">Móvil</label>
                        <input type="text" class="form-control" placeholder="Teléfono" required
                            @blur="validarTelefono(this.comentario.movil)" v-model="comentario.movil">
                    </div>
                </div>

                <!-- Comentarios -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text text-align-top">Comentarios: </label>
                        <textarea class="form-control" placeholder="Comentarios (máximo 256 caracteres)" maxlength="256"
                            v-model="comentario.mensaje"></textarea>
                    </div>
                </div>

                <!-- Valoración en estrellas -->
                <div class="col-11">
                    <div class="input-group">
                        <label class="input-group-text">Valoración</label>
                        <div class="form-control">
                            <span v-for="n in 5" :key="n"
                                :class="n <= this.comentario.valoracion ? 'bi bi-star-fill' : 'bi bi-star'"
                                @click="setValoracion(n)" class="star-icon-pointer"></span>
                        </div>
                    </div>
                </div>
                <div class="col-1">
                    <button type="button" class="btn btn-secondary w-100" @click.prevent="limpiarFormulario()">
                        <i class="bi bi-eraser-fill me-1"></i>
                    </button>
                </div>

                <!-- Acepta condiciones -->
                <div class="col-12 text-center">
                    <div class="form-check d-inline-block">
                        <input class="form-check-input" type="checkbox" v-model="comentario.acepta">
                        <label class="form-check-label">He leído y acepto las <router-link to="/politica-privacidad"
                                class="link">Políticas de privacidad</router-link></label>
                    </div>
                </div>

                <!-- Botón enviar -->
                <div class="col-12">
                    <button type="button" class="btn btn-primary px-4 mt-3" @click.prevent="guardarComentario()">
                        <i class="bi bi-floppy-fill me-2"></i>
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Tabla -->
    <h2 class="text-center fw-bold mt-4">Tabla de comentarios</h2>

    <div class="my-3 mx-2">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col" class="bg-info-subtle text-center">ID</th>
                        <th scope="col" class="bg-info-subtle text-center">Fecha</th>
                        <th scope="col" class="bg-info-subtle text-center">Email</th>
                        <th scope="col" class="bg-info-subtle text-center">Mensaje</th>
                        <th scope="col" class="bg-info-subtle text-center">Valoración</th>
                        <th scope="col" class="bg-warning-subtle text-center" v-if="isAdmin">Gestión</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="comentario in comentariosPorPagina" :key="comentario.id">
                        <td class="align-middle text-center">{{ comentario.id }}</td>
                        <td class="align-middle text-center">{{ comentario.fecha }}</td>
                        <td class="align-middle text-center">{{ comentario.email }}</td>
                        <td class="align-middle text-center">{{ comentario.mensaje }}</td>
                        <td class="align-middle text-center">
                            <span v-for="n in 5" :key="n"
                                :class="n <= comentario.valoracion ? 'bi bi-star-fill' : 'bi bi-star'"
                                class="star-icon"></span>
                        </td>
                        <td class="text-center align-middle pale-yellow" v-if="isAdmin">
                            <div>
                                <button class="btn btn-warning m-2" @click.prevent="seleccionarComentario(comentario)">
                                    <i class="bi bi-pencil-fill"></i>
                                </button>
                                <button class="btn btn-danger m-2" @click.prevent="eliminarComentario(comentario)">
                                    <i class="bi bi-trash-fill"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Paginación en la tabla -->
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary" :disabled="currentPage === 1" @click="paginaAnterior()">
                <i class="bi bi-chevron-left"></i>
            </button>

            <span class="mx-3 align-self-center"> Página {{ currentPage }}</span>

            <button class="btn btn-primary" :disabled="currentPage * pageSize >= comentarios.length"
                @click="siguientePagina()">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>

</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: "TablaComentarios",

    data() {
        return {
            comentario: {
                email: "",
                mensaje: "",
                movil: "",
                valoracion: 1,
                acepta: false
            },

            usuarios: [],
            comentarios: [],

            isAdmin: false,
            isLogueado: false,

            currentPage: 1,
            pageSize: 5,
        }
    },

    mounted() {
        this.getUsuarios();
        this.getComentarios();
        this.isAdmin = localStorage.getItem("isAdmin") === "true";
        this.isLogueado = localStorage.getItem("isLogueado") === "true";
    },

    computed: {
        comentariosPorPagina() {
            // slice para extraer un fragmento de un array de 5 elementos
            const comentariosFiltrados = this.comentarios;
            const indiceInicial = (this.currentPage - 1) * this.pageSize;
            return comentariosFiltrados.slice(indiceInicial, indiceInicial + this.pageSize);
        },
    },

    methods: {

        // Getters
        async getUsuarios() {
            try {
                const response = await fetch("http://localhost:3000/usuarios");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);

                }
                this.usuarios = await response.json();

            } catch (error) {
                console.log(error);
            }
        },
        async getComentarios() {
            try {
                const response = await fetch("http://localhost:3000/comentarios");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);

                }
                this.comentarios = (await response.json()).sort((a, b) => a.fecha.localeCompare(b.fecha));

            } catch (error) {
                console.log(error);
            }
        },

        // Limpiar formulario después de las operaciones
        limpiarFormulario() {
            this.comentario = {
                email: "",
                mensaje: "",
                movil: "",
                valoracion: 1,
                acepta: false
            }
        },

        // Usando estrellas
        setValoracion(n) {
            this.comentario.valoracion = n;
        },

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

        // Almacenar la valoración
        async guardarComentario() {
            if (this.comentario.acepta === false) {
                this.mostrarAlerta(
                    "Debe aceptar",
                    "Debe aceptar las políticas de privacidad para poder mandar su reseña.",
                    "warning");
            } else {
                if (this.comentario.email && this.comentario.movil) {
                    try {
                        const correoExiste = this.usuarios.find(user => user.email === this.comentario.email);

                        if (!correoExiste) {
                            this.mostrarAlerta("Error", "No existe ningún usuario con ese correo.", "error");
                        } else {

                            if (correoExiste.email !== this.comentario.email) {
                                this.mostrarAlerta("Correo incorrecto", "El correo de comentario debe ser idéntico al del usuario logueado", "error");
                                return;
                            }

                            this.comentario.fecha = new Date().toLocaleDateString("es-ES");
                            const guardarResponse = await fetch('http://localhost:3000/comentarios', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(this.comentario)
                            });

                            if (!guardarResponse.ok) {
                                throw new Error("Error al guardar el comentario: " + guardarResponse.statusText);
                            }

                            this.mostrarAlerta("Aviso", "Comentario guardado correctamente", "success");
                            this.limpiarFormulario();
                        }

                    } catch (error) {
                        console.log(error);
                        this.mostrarAlerta("Error", "No se pudo guardar el candidato.", "error");
                    }
                } else {
                    this.mostrarAlerta("Error", "Por favor completa todos los campos", "error");
                }

                // Recargamos la tabla al finalizar la operación
                this.getComentarios();
            }
        },

        // Los métodos para seleccionar y eliminar desde la tabla
        async seleccionarComentario(comentario) {
            try {
                this.limpiarFormulario();
                const response = await fetch("http://localhost:3000/comentarios");
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }

                // Usuarios
                const comentarios = await response.json();
                const comentarioEncontrado = comentarios.find(c => c.dni === comentario.dni);
                if (comentarioEncontrado) {
                    this.comentario = { ...comentarioEncontrado };
                } else {
                    this.mostrarAlerta('Error', 'Comentario no encontrado en el servidor.', 'error');
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo cargar el usuario desde el servidor.', 'error');
            }
        },
        async eliminarComentario(comentario) {
            const result = await Swal.fire({
                title: "Confirmación",
                html: `¿Desea eliminar el comentario de <strong>${comentario.email}? <br><br>
            Esta acción no se puede deshacer.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:3000/comentarios/${comentario.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Error en la solicitud: ' + response.statusText);
                    }
                } catch (error) {
                    console.error(error);
                    this.mostrarAlerta('Error', 'No se pudo cargar el comentario desde el servidor.', 'error');
                }

                // Avisamos y recargamos la tabla al finalizar la operación
                this.mostrarAlerta('Comentario eliminado', 'Comentario eliminado correctamente.', 'success');
                this.getComentarios();
            }
        },

        // Métodos para la paginación en la tabla
        siguientePagina() {
            if (this.currentPage * this.pageSize < this.usuarios.length) {
                this.currentPage++;
            }
        },
        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        }
    },
}
</script>

<style scoped>
.star-icon-pointer {
    margin-right: 5px;
    margin-left: 5px;
    cursor: pointer;
    color: #ffc107;
}

.star-icon {
    margin-right: 5px;
    margin-left: 5px;
    color: #ffc107;
}
</style>