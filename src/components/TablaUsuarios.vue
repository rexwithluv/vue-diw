<template>
    <NavBar></NavBar>
    <h2 class="text-center fw-bold py-3">
        <i class="bi bi-people-fill"></i>
        Gestión usuarios
        <router-link to="/" class="ms-5">
            <i class="fas fa-reply"></i>
        </router-link>
    </h2>

    <div class="container-fluid px-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form class="row m-auto gx-4 gy-3 border rounded bg-light">

                <!-- DNI y fecha alta -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">DNI/NIE</label>
                        <input type="text" class="form-control" placeholder="DNI-NIE" :disabled="bloquearDni"
                            @blur="validarDni(usuario.dni)" v-model="usuario.dni">
                        <button type="button" class="btn btn-primary" @click="buscarDNI(usuario.dni)">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text label-width">Fecha de alta</label>
                        <input type="date" class="form-control" placeholder="Fecha alta" v-model="usuario.alta">
                    </div>
                </div>

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

                <!-- Dirección -->
                <div class="col-12">
                    <div class="input-group">
                        <label class="input-group-text">Dirección</label>
                        <input type="text" class="form-control" placeholder="Dirección" v-model="usuario.direccion">
                    </div>
                </div>

                <!-- Email y teléfono -->
                <div class="col-7">
                    <div class="input-group">
                        <label class="input-group-text">Email</label>
                        <input type="text" class="form-control" placeholder="Email" @blur="validarCorreo(usuario.email)"
                            v-model="usuario.email">
                    </div>
                </div>
                <div class="col-5">
                    <div class="input-group">
                        <label class="input-group-text">Teléfono</label>
                        <input type="text" class="form-control" placeholder="Teléfono"
                            @blur="validarTelefono(usuario.telefono)" v-model="usuario.telefono">

                    </div>
                </div>

                <!-- Provincia, municipio y tipo de usuario -->
                <div class="col-lg-4 col-sm-5">
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
                <div class="col-lg-5 col-sm-7">
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
                <div class="col-lg-3 col-sm-6">
                    <div class="input-group">
                        <label class="input-group-text">Tipo de usuario</label>
                        <select name="tipoUsuario" id="tipoUsuario" class="form-select" v-model="usuario.tipo"
                            :class="{ 'text-placeholder': usuario.tipo === '' }">
                            <option value="" disabled>Selecciona</option>
                            <option v-for="tipoUsuario in tiposUsuario" :key="tipoUsuario.id" :value="tipoUsuario.id"
                                class="text-black">
                                {{ tipoUsuario.tipo }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Checkbox "Histórico" -->
                <div class="col-12">
                    <div class="form-check text-start">
                        <input v-model="verHistorico" type="checkbox" name="historico" id="historico"
                            class="form-check-input" />
                        <label class="form-check-label">Mostrar usuarios que se han dado de
                            baja</label>
                    </div>
                </div>

                <!-- Botones -->
                <div class="d-flex mb-4 gap-4 px-4">
                    <button type="button" class="btn btn-primary fs-5 py-2 w-100" @click.prevent="grabarUsuario()">
                        <i class="bi bi-floppy-fill me-2"></i>
                        Alta
                    </button>
                    <button type="button" class="btn btn-warning fs-5 py-2 w-100" @click.prevent="modificarUsuario()">
                        <i class="bi bi-pencil-fill me-1"></i>
                        Modificar
                    </button>
                    <button type="button" class="btn btn-danger fs-5 py-2 w-100" @click.prevent="eliminarUsuario()">
                        <i class="bi bi-trash-fill me-1"></i>
                        Baja
                    </button>
                    <button type="button" class="btn btn-secondary fs-5 py-2 w-100"
                        @click.prevent="limpiarFormulario()">
                        <i class="bi bi-eraser-fill me-1"></i>
                        Limpiar
                    </button>
                </div>


            </form>
        </div>
    </div>

    <!-- Tabla -->
    <h2 class="text-center fw-bold mt-4">Tabla usuarios</h2>

    <div class="my-3 mx-2">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col" class="bg-info-subtle text-center">DNI</th>
                        <th scope="col" class="bg-info-subtle text-center">Apellidos</th>
                        <th scope="col" class="bg-info-subtle text-center">Nombre</th>
                        <th scope="col" class="bg-info-subtle text-center">Email</th>
                        <th scope="col" class="bg-info-subtle text-center">Teléfono</th>
                        <th scope="col" class="bg-info-subtle">Tipo</th>
                        <th v-if="verHistorico" scope="col" class="bg-info-subtle text-center">Fecha Baja</th>
                        <th scope="col" class="bg-warning-subtle text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in usuariosPorPagina" :key="usuario.id">
                        <td class="align-middle text-center">{{ usuario.dni }}</td>
                        <td class="align-middle text-start">{{ usuario.apellidos }}</td>
                        <td class="align-middle text-start">{{ usuario.nombre }}</td>
                        <td class="align-middle text-center">{{ usuario.email }}</td>
                        <td class="align-middle text-center">{{ usuario.telefono }}</td>
                        <td class="align-middle text-center">{{ tiposUsuario.find(tipoUser => tipoUser.id === usuario.tipo).tipo }}
                        </td>
                        <td v-if="verHistorico" class="align-middle text-center">{{ usuario.baja }}</td>
                        <td class="text-center align-middle pale-yellow">
                            <div>
                                <button class="btn btn-warning m-2" @click.prevent="seleccionarUsuario(usuario)">
                                    <i class="bi bi-pencil-fill"></i>
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

            <button class="btn btn-primary" :disabled="currentPage * pageSize >= usuariosFiltrados.length"
                @click="siguientePagina()">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>


</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: "TablaUsuarios",

    data() {
        return {
            usuario: {
                dni: "",
                alta: "",
                apellidos: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
                provincia: "",
                municipio: "",
                baja: "",
                tipo: "",
            },
            tiposUsuario: [],
            usuarios: [],
            provincias: [],
            municipios: [],
            errores: [],
            verHistorico: false,
            bloquearDni: false,
            currentPage: 1,
            pageSize: 5,
        }
    },

    // Funciones que se ejecutan al iniciar el servidor
    mounted() {
        this.getProvincias();
        this.getUsuarios();
        this.getMunicipios();
        this.getTiposUsuario();
    },

    // Propiedades computadas que se calculan en tiempo real, reactivas a cambios
    computed: {
        usuariosFiltrados() {
            //Filtra usuarios que tienen fecha de baja vacia si verHistorico es false
            return this.verHistorico ? this.usuarios : this.usuarios.filter(usuario => !usuario.baja); //lo hace todo
        },
        usuariosPorPagina() {
            // slice para extraer un fragmento de un array de 5 elementos
            const usuariosFiltrados = this.usuariosFiltrados;
            const indiceInicial = (this.currentPage - 1) * this.pageSize;
            return usuariosFiltrados.slice(indiceInicial, indiceInicial + this.pageSize);
        },
        municipiosFiltrados() {
            if (!this.usuario.provincia) {
                return [];
            }
            return this.municipios.filter((municipio) => municipio.id.startsWith(this.usuario.provincia));
        }
    },

    // Métodos de los de toda la vida
    methods: {

        // Getters para los select
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
        async getUsuarios() {
            try {
                const response = await fetch("http://localhost:3000/usuarios");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);

                }
                this.usuarios = (await response.json()).sort((a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre));

            } catch (error) {
                console.log(error);
            }
        },
        async getTiposUsuario() {
            try {
                const response = await fetch("http://localhost:3000/tiposUsuario");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                this.tiposUsuario = await response.json();
            } catch (error) {
                console.log(error);
            }
        },

        // Limpiar formulario
        limpiarFormulario() {
            this.usuario = {
                dni: "",
                alta: "",
                apellidos: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
                provincia: "",
                municipio: "",
                baja: "",
                tipo: "",
            };
            this.bloquearDni = false;
        },

        // Obtener la fecha de hoy
        obtenerFechaHoy() {
            const fecha = new Date();
            const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
            const fechaFormateada = new Intl.DateTimeFormat("es-ES", opciones).format(fecha);
            return fechaFormateada;
        },

        // Métodos que se llaman desde los botones del formulario
        async grabarUsuario() {
            if (this.usuario.dni && this.usuario.apellidos) {
                try {
                    this.usuario.baja = "";

                    const response = await fetch("http://localhost:3000/usuarios");
                    if (!response.ok) {
                        throw new Error("Error al obtener los usuarios: " + response.statusText);
                    }

                    const usuariosExistentes = await response.json();
                    const usuarioExistente = usuariosExistentes.find(usuario => usuario.dni === this.usuario.dni);
                    if (usuarioExistente && usuarioExistente.baja !== "") {
                        // Quitamos la fecha de baja
                        usuarioExistente.baja = "";
                        const crearResponse = await fetch(`http://localhost:3000/usuarios/${usuarioExistente.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(usuarioExistente)
                        });

                        if (!crearResponse.ok) {
                            throw new Error("Error al dar de alta el usuario: " + crearResponse.statusText);
                        }

                        const nuevoUsuario = await crearResponse.json();
                        this.usuarios.push(nuevoUsuario);
                        this.mostrarAlerta("Aviso", "Usuario dado de alta correctamente", "success");
                        this.getUsuarios();
                        this.limpiarFormulario();
                    }
                    else if (usuarioExistente) {
                        this.mostrarAlerta("Error", "El DNI ya está registrado", "error");
                    } else {
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

                        const nuevoUsuario = await crearResponse.json();
                        this.usuarios.push(nuevoUsuario);
                        this.mostrarAlerta("Aviso", "Usuario guardado", "success");
                        this.getUsuarios();
                        this.limpiarFormulario();
                    }
                } catch (error) {
                    console.log(error);
                    this.mostrarAlerta("Error", "No se pudo grabar el usuario.", "error");
                }
            } else {
                this.mostrarAlerta("Error", "Por favor completa todos los campos requeridos", "error");
            }
        },
        async eliminarUsuario() {
            const result = await Swal.fire({
                title: "Confirmación",
                html: `¿Desea dar de baja a <strong>${this.usuario.nombre} ${this.usuario.apellidos}</strong>?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch("http://localhost:3000/usuarios");
                    if (!response.ok) {
                        throw new Error("Error en la solicitud: " + response.statusText);
                    }

                    const usuarios = await response.json();
                    const usuarioExistente = usuarios.find(usuario => usuario.dni === this.usuario.dni);
                    if (usuarioExistente) {
                        const fechaHoy = this.obtenerFechaHoy();  // Usamos la nueva función simplificada para obtener la fecha

                        usuarioExistente.baja = fechaHoy;

                        // Enviar la actualización al servidor
                        await fetch(`http://localhost:3000/usuarios/${usuarioExistente.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(usuarioExistente),
                        });

                        this.mostrarAlerta("Aviso", "Usuario dado de baja correctamente", "success");
                        this.getUsuarios();
                    } else {
                        this.mostrarAlerta("Error", "Usuario no encontrado", "error")
                    }
                } catch (error) {
                    console.log(error);
                    this.mostrarAlerta("Error", "no se pudo dar de baja al usuario.", "error");
                }
            }
        },
        async modificarUsuario() {
            const result = await Swal.fire({
                title: "Confirmación",
                html: `¿Desea guardar los cambios de <strong>${this.usuario.nombre} ${this.usuario.apellidos}</strong>?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                if (this.usuario.dni) {
                    try {
                        // Buscar el usuario actual por su DNI en el servidor
                        const response = await fetch(`http://localhost:3000/usuarios/${this.usuario.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(this.usuario),
                        });

                        if (!response.ok) {
                            throw new Error("Error al modificar el usuario: " + response.statusText);
                        }

                        // Mostrar alerta de éxito
                        this.mostrarAlerta("Aviso", "Usuario modificado con éxito", "success");
                        this.getUsuarios();
                    } catch (error) {
                        console.log(error);
                        this.mostrarAlerta("Error", "No se pudo modificar el usuario", "error");
                    }
                } else {
                    this.mostrarAlerta("Error", "Debe seleccionar un usuario para modificar", "error");
                }
            }
        },

        // Método que llama los botones de la tabla
        async seleccionarUsuario(usuario) {
            try {
                this.limpiarFormulario();
                const response = await fetch("http://localhost:3000/usuarios");
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }

                // Usuarios
                const usuarios = await response.json();
                const usuarioEncontrado = usuarios.find(c => c.dni === usuario.dni);
                if (usuarioEncontrado) {
                    // Convertir la fecha de alta al formato dd/mm/yyyy
                    // Asignar el objeto completo de provincia y municipio
                    if (this.usuario.provincia) {
                        this.usuario.provincia = this.provincias.find(p => p.nm === this.usuario.provincia).nm;
                        if (this.usuario.provincia) {
                            console.log("Provincia encontrada", this.usuario.provincia);
                        }
                    }

                    this.usuario = { ...usuarioEncontrado };
                    this.bloquearDni = true;

                    if (this.usuario.alta) {
                        this.usuario.alta = this.usuario.alta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
                    }
                } else {
                    this.mostrarAlerta('Error', 'Usuario no encontrado en el servidor.', 'error');
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo cargar el usuario desde el servidor.', 'error');
            }
        },

        // Para filtrar por DNI
        async buscarDNI(dni) {
            if (dni.length === 0) {
                try {
                    const response = await fetch("http://localhost:3000/usuarios");
                    if (!response.ok) {
                        throw new Error('Error en la solicitud: ' + response.statusText);
                    }

                    const usuarios = await response.json();
                    const usuarioEncontrado = usuarios.find(c => c.dni === dni);
                    if (usuarioEncontrado) {
                        this.usuario = { ...usuarioEncontrado };
                        this.bloquearDni = true;
                    } else {
                        this.mostrarAlerta('Error', 'Usuario no encontrado en el servidor.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    this.mostrarAlerta("Error", "No se pudo cargar el usuario desde el servidor", "error");
                }
            } else {
                this.mostrarAlerta("Error", "El DNI está vacío.", "error");
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
.text-placeholder {
    color: #595c5f;
}
</style>