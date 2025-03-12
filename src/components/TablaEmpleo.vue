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
                            required />
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Nombre</label>
                        <input type="text" class="form-control" placeholder="Nombre" v-model="candidato.nombre"
                            required />
                    </div>
                </div>

                <!-- Email y móvil -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Email</label>
                        <input type="email" class="form-control" placeholder="Email" v-model="candidato.email"
                            @blur="validarCorreo(this.candidato.email)" required />
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Móvil</label>
                        <input type="text" class="form-control" placeholder="Móvil" v-model="candidato.telefono"
                            @blur="validarTelefono(this.candidato.telefono)" required />
                    </div>
                </div>

                <!-- Categoría y modalidad -->
                <div class="col-lg-6 col-sm-5">
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
                <div class="col-lg-6 col-sm-7">
                    <div class="input-group">
                        <label class="input-group-text">Modalidad</label>
                        <div class="btn-group form-control" role="group">
                            <input type="radio" class="btn-check" name="modalidad" id="remoto" value="Remoto"
                                autocomplete="off" v-model="candidato.modalidad" />
                            <label class="btn btn-outline-secondary" for="remoto">Remoto</label>

                            <input type="radio" class="btn-check" name="modalidad" id="hibrido" value="Híbrido"
                                autocomplete="off" v-model="candidato.modalidad" />
                            <label class="btn btn-outline-secondary" for="hibrido">Híbrido</label>

                            <input type="radio" class="btn-check" name="modalidad" id="presencial" value="Presencial"
                                autocomplete="off" v-model="candidato.modalidad" />
                            <label class="btn btn-outline-secondary" for="presencial">Presencial</label>
                        </div>
                    </div>
                </div>

                <!-- Comentarios -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text text-align-top">Comentarios </label>
                        <textarea class="form-control" placeholder="Comentarios (máximo 256 caracteres)" maxlength="256"
                            v-model="candidato.comentarios"></textarea>
                    </div>
                </div>

                <!-- CV => Curriculum Vitae -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text">CV (PDF)</label>
                        <input type="file" class="form-control" placeholder="CV en formato PDF"
                            accept=".pdf, .jpg, .jpeg" @change="handleFileChange" ref="fileInput" />
                    </div>
                </div>

                <!-- Acepta condiciones -->
                <div class="col-12 text-center">
                    <div class="form-check d-inline-block">
                        <input class="form-check-input" type="checkbox" v-model="candidato.acepta" />
                        <label class="form-check-label">He leído y acepto las
                            <router-link to="/politica-privacidad" class="link">Políticas de
                                privacidad</router-link></label>
                    </div>
                </div>

                <!-- Botón enviar -->
                <div class="col-12">
                    <button type="button" class="btn btn-primary px-4 mt-3" @click.prevent="guardarCandidato()">
                        Mandar CV
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Tabla -->
    <h2 class="text-center fw-bold mt-4" v-if="isAdmin">Tabla candidatos</h2>

    <div class="my-3 mx-2" v-if="isAdmin">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col" class="bg-info-subtle text-center">Apellidos</th>
                        <th scope="col" class="bg-info-subtle text-center">Nombre</th>
                        <th scope="col" class="bg-info-subtle text-center">Teléfono</th>
                        <th scope="col" class="bg-info-subtle text-center">Email</th>
                        <th scope="col" class="bg-info-subtle text-center">Departamento</th>
                        <th scope="col" class="bg-info-subtle text-center">Modalidad</th>
                        <th scope="col" class="bg-warning-subtle text-center">Gestión</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="candidato in candidatosPorPagina" :key="candidato.id">
                        <td class="align-middle text-start">{{ candidato.apellidos }}</td>
                        <td class="align-middle text-start">{{ candidato.nombre }}</td>
                        <td class="align-middle text-center">{{ candidato.telefono }}</td>
                        <td class="align-middle text-center">{{ candidato.email }}</td>
                        <td class="align-middle text-center">
                            {{
                                departamentos.find((dep) => dep.id === candidato.departamento)
                                    .nombre
                            }}
                        </td>
                        <td class="align-middle text-center">{{ candidato.modalidad }}</td>
                        <td class="text-center align-middle pale-yellow">
                            <button class="btn btn-warning m-2" @click.prevent="seleccionarCandidato(candidato)">
                                <i class="bi bi-pencil-fill"></i>
                            </button>
                            <button class="btn btn-danger m-2" @click.prevent="eliminarCandidato(candidato)">
                                <i class="fas fa-trash"></i>
                            </button>
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

            <button class="btn btn-primary" :disabled="currentPage * pageSize >= candidatos.length"
                @click="siguientePagina()">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
export default {
    name: "TablaEmpleo",

    data() {
        return {
            candidato: {
                apellidos: "",
                nombre: "",
                email: "",
                telefono: "",
                departamento: "",
                modalidad: "",
                comentarios: "",
                cv: "",
                acepta: false,
            },
            departamentos: [],
            candidatos: [],

            archivo: null,

            isAdmin: false,

            // Para la paginación
            currentPage: 1,
            pageSize: 5,
        };
    },

    mounted() {
        this.getDepartamentos();
        this.getCandidatos();
        this.isAdmin = localStorage.getItem("isAdmin") === "true";
    },

    computed: {
        candidatosPorPagina() {
            const indiceInicial = (this.currentPage - 1) * this.pageSize;
            return this.candidatos.slice(
                indiceInicial,
                indiceInicial + this.pageSize
            );
        },
    },

    methods: {
        // Getters
        async getDepartamentos() {
            try {
                const response = await fetch("http://localhost:3000/departamentos");
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                this.departamentos = await response.json();
            } catch (error) {
                console.log(error);
            }
        },
        async getCandidatos() {
            try {
                const response = await fetch("http://localhost:3000/candidatos");
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                this.candidatos = await response.json();
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

        // Limpiar el formulario antes de hacer algún tipo de operación
        limpiarFormulario() {
            this.candidato = {
                apellidos: "",
                nombre: "",
                email: "",
                telefono: "",
                departamento: "",
                modalidad: "",
                comentarios: "",
                acepta: false,
            };
        },

        // Validaciones
        validarCorreo(email) {
            if (email.length === 0) {
                return true;
            }

            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                Swal.fire(
                    "Error",
                    "El formato del correo electrónico es incorrecto",
                    "error"
                );
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
                Swal.fire("Error", "El teléfono es incorrecto", "error");
                return false;
            }
        },

        // Enviar candidatura
        handleFileChange(event) {
            this.archivo = event.target.files[0];
            console.log(this.archivo);
        },
        async guardarCandidato() {
            if (this.candidato.acepta === false) {
                this.mostrarAlerta(
                    "Debe aceptar",
                    "Debe aceptar las políticas de privacidad para poder mandar su CV",
                    "warning"
                );
            } else {
                if (
                    this.candidato.apellidos &&
                    this.candidato.nombre &&
                    this.candidato.email &&
                    this.candidato.telefono &&
                    this.candidato.departamento &&
                    this.candidato.modalidad
                ) {
                    try {
                        // Si el candidato lo traemos de la base de datos tendrá ID, nos aseguramos de eliminarlo para evitar duplicados
                        delete this.candidato.id;

                        const guardarResponse = await fetch(
                            "http://localhost:3000/candidatos",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(this.candidato),
                            }
                        );

                        if (!guardarResponse.ok) {
                            throw new Error(
                                `Error al guardar la candidatura: ${guardarResponse.statusText}`
                            );
                        }

                        // Guardamos el PDF
                        if (this.archivo) {
                            const formData = new FormData();
                            const candidatoId = this.candidato.telefono || "default";
                            const nuevoArchivo = new File(
                                [this.archivo],
                                `${candidatoId}.pdf`,
                                { type: this.archivo.type }
                            );
                            formData.append("archivo", nuevoArchivo);
                            formData.append("candidatoId", this.candidato.telefono);
                            console.log(nuevoArchivo);
                            const fileResponse = await fetch(
                                "http://localhost:5000/subircv",
                                {
                                    method: "POST",
                                    body: formData,
                                    credentials: "include",
                                }
                            );

                            if (!fileResponse.ok) {
                                throw new Error("Error al subir el archivo");
                            }
                            console.log("Hubo respuesta:", fileResponse);

                            const fileData = await fileResponse.json();
                            console.log("Archivo subido correctamente:", fileData);
                        }

                        this.mostrarAlerta(
                            "Aviso",
                            "Candidatura guardada correctamente",
                            "success"
                        );
                        this.limpiarFormulario();
                    } catch (error) {
                        console.log(error);
                        this.mostrarAlerta(
                            "Error",
                            "No se pudo guardar el candidato.",
                            "error"
                        );
                    }
                } else {
                    this.mostrarAlerta(
                        "Error",
                        "Por favor completa todos los campos",
                        "error"
                    );
                }

                // Recargamos la tabla al finalizar la operación
                this.getCandidatos();
            }
        },

        //Métodos que se llaman desde los botones de la tabla
        // Seleccionar para editar
        async seleccionarCandidato(candidato) {
            try {
                this.limpiarFormulario();
                const response = await fetch("http://localhost:3000/candidatos");
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }

                const candidatos = await response.json();
                const candidatoEncontrado = candidatos.find(
                    (c) => c.id === candidato.id
                );
                if (candidatoEncontrado) {
                    this.candidato = { ...candidatoEncontrado };
                } else {
                    this.mostrarAlerta(
                        "Error",
                        "Candidato no encontrado en el servidor.",
                        "error"
                    );
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta(
                    "Error",
                    "No se pudo cargar el candidato desde el servidor.",
                    "error"
                );
            }
        },
        // Eliminar
        async eliminarCandidato(candidato) {
            const result = await Swal.fire({
                title: "Confirmación",
                html: `¿Desea eliminar a <strong>${candidato.nombre} ${candidato.apellidos}</strong>? <br><br>
            Esta acción no se puede deshacer.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(
                        `http://localhost:3000/candidatos/${candidato.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(candidato),
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error(error);
                    this.mostrarAlerta(
                        "Error",
                        "No se pudo cargar el usuario desde el servidor.",
                        "error"
                    );
                }

                // Recargamos la tabla al finalizar la operación
                this.getCandidatos();
            }
        },

        // Métodos para la paginación en la tabla
        siguientePagina() {
            if (this.currentPage * this.pageSize < this.candidatos.length) {
                this.currentPage++;
            }
        },
        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
    },
};
</script>

<style coped>
.text-align-top {
    align-items: baseline;
}
</style>
