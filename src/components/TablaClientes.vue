<template>
    <div class="container-fluid px-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form class="row m-auto gx-4 gy-3 border rounded bg-light">

                <!-- DNI y fecha alta -->
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">DNI/NIE</label>
                        <input type="text" class="form-control" placeholder="DNI-NIE" @blur="validarDni(cliente.dni)"
                            v-model="cliente.dni">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text label-width">Fecha de alta</label>
                        <input type="date" class="form-control" placeholder="Fecha alta" v-model="cliente.alta">
                    </div>
                </div>

                <!-- Nombre y apellidos -->
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">Nombre</label>
                        <input type="text" class="form-control" placeholder="Nombre" v-model="cliente.nombre">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">Apellidos</label>
                        <input type="text" class="form-control" placeholder="Apellidos" v-model="cliente.apellidos">
                    </div>
                </div>

                <!-- Dirección e email -->
                <div class="col-md-12">
                    <div class="input-group">
                        <label class="input-group-text">Dirección</label>
                        <input type="text" class="form-control" placeholder="Dirección" v-model="cliente.direccion">
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="input-group">
                        <label class="input-group-text">Email</label>
                        <input type="text" class="form-control" placeholder="Email" @blur="validarCorreo(cliente.email)"
                            v-model="cliente.email">
                    </div>
                </div>

                <!-- Provincia y municipio -->
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">Provincia</label>
                        <select name="provincia" id="provincia" class="form-select" v-model="cliente.provincia">
                            <option value="">Selecciona una provincia</option>
                            <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">
                                {{ provincia.nm }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group">
                        <label class="input-group-text">Municipio</label>
                        <select name="municipio" id="municipio" class="form-select" v-model="cliente.municipio">
                            <option value="">Selecciona una opción</option>
                            <option v-for="municipio in municipiosFiltrados" :key="municipio.id" :value="municipio.id">
                                {{ municipio.nm }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Checkbox "Histórico" -->
                <div class="col-md-6">
                    <div class="form-check">
                        <input v-model="verHistorico" type="checkbox" name="historico" id="historico"
                            class="form-check-input" />
                        <label class="form-check-label">Mostrar clientes que se han dado de
                            baja</label>
                    </div>
                </div>

                <!-- Botones -->
                <div class="col-md-12 d-flex justify-content-center">
                    <div class="pt-3 pb-4 d-flex gap-4">
                        <button type="button" class="btn btn-primary px-3" @click.prevent="grabarCliente()">
                            <i class="bi bi-floppy-fill me-1"></i>
                            Guardar
                        </button>
                        <button type="button" class="btn btn-warning px-3" @click.prevent="grabarCliente()">
                            <i class="bi bi-pencil-fill me-1"></i>
                            Modificar
                        </button>
                        <button type="button" class="btn btn-danger px-3" @click.prevent="grabarCliente()">
                            <i class="bi bi-trash-fill me-1"></i>
                            Eliminar
                        </button>
                        <button type="button" class="btn btn-secondary px-3" @click.prevent="limpiarFormulario()">
                            <i class="bi bi-eraser-fill me-1"></i>
                            Limpiar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Tabla -->
    <h2 class="text-center fw-bold mt-4">Tabla clientes</h2>

    <div class="my-3">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col" class="bg-info-subtle text-center">DNI</th>
                        <th scope="col" class="bg-info-subtle text-center">Apellidos</th>
                        <th scope="col" class="bg-info-subtle text-center">Nombre</th>
                        <th scope="col" class="bg-info-subtle text-center">Email</th>
                        <th v-if="verHistorico" scope="col" class="bg-info-subtle text-center">Fecha Baja</th>
                        <th scope="col" class="bg-warning-subtle text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
                        <td class="align-middle text-center">{{ cliente.dni }}</td>
                        <td class="align-middle text-center">{{ cliente.apellidos }}</td>
                        <td class="align-middle text-center">{{ cliente.nombre }}</td>
                        <td class="align-middle text-center">{{ cliente.email }}</td>
                        <td v-if="verHistorico" class="align-middle text-center">{{ cliente.baja }}</td>
                        <td class="text-center align-middle text-center pale-yellow">
                            <div>
                                <button class="btn btn-warning m-2" @click.prevent="seleccionarCliente(cliente)">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: "TablaClientes",

    data() {
        return {
            cliente: {
                dni: '',
                alta: '',
                apellidos: '',
                nombre: '',
                direccion: '',
                email: '',
                provincia: '',
                municipio: '',
                baja: '',
            },
            clientes: [],
            provincias: [],
            municipios: [],
            errores: [],
            verHistorico: false,
        }
    },

    // Funciones que se ejecutan al iniciar el servidor
    mounted() {
        this.getProvincias();
        this.getClientes();
        this.getMunicipios();
    },

    // Propiedades computadas que se calculan en tiempo real, reactivas a cambios
    computed: {
        clientesFiltrados() {
            //Filtra clientes que tienen fecha de baja vacia si verHistorico es false
            return this.verHistorico ? this.clientes : this.clientes.filter(cliente => !cliente.baja); //lo hace todo
        },
        municipiosFiltrados() {
            if (!this.cliente.provincia) {
                return [];
            }
            return this.municipios.filter((municipio) => municipio.id.startsWith(this.cliente.provincia));
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
        async getClientes() {
            try {
                const response = await fetch("http://localhost:3000/clientes");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);

                }
                this.clientes = (await response.json()).sort((a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre));

            } catch (error) {
                console.log(error);
            }
        },

        // Limpiar formulario
        limpiarFormulario() {
            this.cliente = {
                dni: '',
                alta: '',
                apellidos: '',
                nombre: '',
                direccion: '',
                email: '',
                provincia: '',
                municipio: '',
                baja: '',
            };
        },

        async grabarCliente() {
            if (this.cliente.dni && this.cliente.apellidos) {
                try {
                    this.cliente.baja = "";

                    const response = await fetch("http://localhost:3000/clientes");
                    if (!response.ok) {
                        throw new Error("Error al obtener los clientes: " + response.statusText);
                    }

                    const clientesExistentes = await response.json();
                    const clienteExistente = clientesExistentes.find(cliente => cliente.dni === this.cliente.dni);
                    if (clienteExistente) {
                        this.mostrarAlerta("Error", "El DNI ya está registrado", "error");
                    } else {
                        const crearResponse = await fetch("http://localhost:3000/clientes", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(this.cliente)
                        });

                        if (!crearResponse.ok) {
                            throw new Error("Error al guardar el cliente: " + crearResponse.statusText);
                        }

                        const nuevoCliente = await crearResponse.json();
                        this.clientes.push(nuevoCliente);
                        this.mostrarAlerta("Aviso", "Cliente guardado", "success");
                        this.getClientes;
                        this.limpiarFormulario();
                    }
                } catch (error) {
                    console.log(error);
                    this.mostrarAlerta("Error", "No se pudo grabar el cliente.", "error");
                }
            } else {
                this.mostrarAlerta("Error", "Por favor completa todos los campos requeridos", "error");
            }
        },

        seleccionarCliente(cliente) {
            this.cliente = cliente;
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
    },
}

</script>

<style></style>