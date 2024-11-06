<template>
    <div>
        <NavBar></NavBar>
    </div>
    <div class="row">
        <h4 class="text-center front-weight-bold my-3">Gestión clientes</h4>
    </div>
    <div class="container-fluid border p-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form @submit.prevent="grabarCliente" class="form-in-line">

                <div class="input-group mb-3 border rounded py-2 px-3 bg-light">
                    <label class="input-group-text">DNI/NIE</label>
                    <input type="text" class="form-control" placeholder="DNI-NIE" @blur="validarDni(cliente.dni)"
                        v-model="cliente.dni">

                    <label class="input-group-text ">Fecha de alta</label>
                    <input type="date" class="form-control" placeholder="Fecha alta" v-model="cliente.fechaAlta">
                </div>

                <div class="input-group mb-3 border rounded py-2 px-3 bg-light">
                    <label class="input-group-text">Apellidos</label>
                    <input type="text" class="form-control" placeholder="Apellidos" v-model="cliente.apellidos">

                    <label class="input-group-text">Nombre</label>
                    <input type="text" class="form-control" placeholder="Nombre" v-model="cliente.nombre">
                </div>

                <div class="input-group mb-3 border rounded py-2 px-3 bg-light">
                    <label class="input-group-text">Dirección</label>
                    <input type="text" class="form-control" placeholder="Dirección" v-model="cliente.direccion">

                    <label class="input-group-text">Email</label>
                    <input type="text" class="form-control" placeholder="Email" @blur="validarCorreo(cliente.email)"
                        v-model="cliente.email">
                </div>

                <div class="input-group mb-3 border rounded py-2 px-3 bg-light">
                    <label class="input-group-text">Provincia</label>
                    <select name="provincia" id="provincia" class="form-select" v-model="cliente.provincia">
                        <option value="">Selecciona una provincia</option>
                        <option v-for="provincia in provincias" :key="provincia.id" :value="provincia">
                            {{ provincia.nm }}</option>
                    </select>

                    <label class="input-group-text">Municipio</label>
                    <select name="municipio" id="municipio" class="form-select" v-model="cliente.municipio">
                        <option value="">Selecciona una opción</option>
                        <option v-for="municipio in municipios" :key="municipio.id" :value="municipio">{{ municipio.nm
                            }}
                        </option>
                    </select>
                </div>

                <div class="input-group mb-3 border rounded py-2 px-3 bg-light">
                    <div class="input-group-text ">
                        <input v-model="isChecked" type="checkbox" name="historico" id="historico"
                            class="form-check-input mt-0" />
                    </div>
                    <label class="input-group-text">Quiero que se muestren clientes que se han dado de baja</label>
                </div>

                <div class="d-flex justify-content-center gap-4 mt-4">
                    <button type="submit" class="btn btn-primary" @click.prevent="grabarCliente">Guardar</button>
                    <button type="submit" class="btn btn-warning" @click.prevent="grabarCliente">Modificar</button>
                    <button type="submit" class="btn btn-danger" @click.prevent="grabarCliente">Eliminar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- tabla -->
    <div class="container-fluid border my-2">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead class="table-info rounded-header">
                    <tr>
                        <th scope="col" class="w-15 text-center">DNI</th>
                        <th scope="col" class="w-25">Apellidos</th>
                        <th scope="col" class="w-25">Nombre</th>
                        <th scope="col" class="w-20 text-center">Email</th>
                        <th scope="col" class="w-10 text-center">Fecha Baja</th>
                        <th scope="col" class="pale-yellow">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cliente in filtroClientes" :key="cliente.id">
                        <td class="align-middle">{{ cliente.dni }}</td>
                        <td class="align-middle">{{ cliente.apellidos }}</td>
                        <td class="align-middle">{{ cliente.nombre }}</td>
                        <td class="align-middle">{{ cliente.email }}</td>
                        <td class="align-middle">{{ cliente.baja }}</td>
                        <td class="text-center align-middle pale-yellow">
                            <div>
                                <button class="btn btn-warning m-2" @click="seleccionaCliente(cliente)">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                                <button class="btn btn-danger m-2" @click="deleteCliente(cliente.dni)">
                                    <i class="bi bi-trash"></i>
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
import NavBar from './NavBar.vue';
import Swal from 'sweetalert2';
export default {
    name: "TablaClientes",
    components: {
        NavBar
    },


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
            isChecked: false
        }
    },

    // Funciones que se ejecutan al iniciar el servidor
    mounted() {
        this.getProvincias();
        this.getClientes();
        this.getMunicipios();
    },

    // Funciones que se ejecutan en tiempo real, sensibles a cambios
    computed: {
        filtroClientes() {
            //Filtra clientes que tienen fecha de baja vacia si isChecked es false
            return this.isChecked ? this.clientes : this.clientes.filter(cliente => !cliente.baja); //lo hace todo
        },
        municipiosFiltrados() {
            if (!this.cliente.provincia || !this.cliente.provincia.id) {
                return [];
            }
            return this.municipios.filter((municipio) => municipio.id.startsWith(this.cliente.provincia.id));
        },
    },

    // Métodos de los de toda la vida
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

        async getClientes() {
            try {
                const response = await fetch("http://localhost:3000/clientes");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                this.clientes = await response.json();
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

        grabarCliente() {
            this.clientes.push({ ...this.cliente })
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
            }
        },
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
}

</script>

<style></style>