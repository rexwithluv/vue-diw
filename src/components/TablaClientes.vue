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
                <div class="input-group-text mb-3">
                    <label class="input-group-text custom-span me-2">DNI/NIE</label>
                    <input type="text" class="form-control sm w-25" placeholder="DNI-NIE" v-model="cliente.dni">

                    <label class="input-group-text custom-span ms-auto me-2">Fecha de alta</label>
                    <input type="date" class="form-control sm w-25" placeholder="Fecha alta"
                        v-model="cliente.fechaAlta">
                    <button class="btn btn-primary ms-2" type="submit">
                        <i class="bi bi-calendar-date"></i>
                    </button>
                </div>
                <div class="input-group-text mb-3">
                    <label class="input-group-text custom-span me-2">Apellidos</label>
                    <input type="text" class="form-control sm w-50" placeholder="Apellidos" v-model="cliente.apellidos">

                    <label class="input-group-text custom-span mx-2">Nombre</label>
                    <input type="text" class="form-control sm w-50" placeholder="Nombre" v-model="cliente.nombre">
                </div>
                <div class="input-group-text mb-3">
                    <label class="input-group-text custom-span me-2">Dirección</label>
                    <input type="text" class="form-control sm" placeholder="Dirección" v-model="cliente.direccion">
                </div>
                <div class="input-group-text mb-">
                    <label class="input-group-text custom-span me-2">Provincia</label>
                    <select type="text" class="form-select sm w-25" placeholder="Provincia" v-model="cliente.provincia">
                    </select>

                    <label class="input-group-text custom-span mx-2">Municipio</label>
                    <select type="text" class="form-select sm  w-50" placeholder="Municipio"
                        v-model="cliente.municipio">
                    </select>
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
                    <tr v-for="cliente in clientes" :key="cliente.id">
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
    }, data() {
        return {
            clientes: [
                {
                    dni: '0000000H',
                    apellidos: 'Balado Gómez',
                    nombre: 'Juan',
                    email: 'asdf@gasdg.es',
                    baja: '',
                },
                {
                    dni: '0000000H',
                    apellidos: 'Gil Gómez',
                    nombre: 'Alvaro',
                    email: 'asdfasff@fassg.es',
                    baja: '',
                },
                {
                    dni: '0000000H',
                    apellidos: 'Balado Gómez',
                    nombre: 'Maria',
                    email: 'asdf@gasdg.es',
                    baja: '04/11/2024',
                },
            ],
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
            errores: [],
            mostrarHistorico: false,
            provincias: ['Provincia 1', 'Provincia 2', 'Provincia 3'],
            municipios: ['Municipio 1', 'Municipio 2', 'Municipio 3'],
        }
    },
    computed: {
        clientesFiltrados() {
            if (this.mostrarHistorico) {
                return this.clientes
            } else {
                return this.clientes.filter(cliente => !cliente.baja)
            }
        },
    },
    methods: {
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
    },
}

</script>

<style></style>