<template>
    <NavBar></NavBar>
    <h2 class="text-center fw-bold py-3">
        <i class="bi bi-123"></i>
        Gestión de artículos
        <router-link to="/" class="ms-5">
            <i class="fas fa-reply"></i>
        </router-link>
    </h2>

    <div class="container-fluid px-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form class="row m-auto gx-4 gy-3 border rounded bg-light">

                <!-- Nombre y categoría -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Nombre</label>
                        <input type="text" class="form-control" placeholder="Nombre del artículo"
                            v-model="articulo.nombre">
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text label-width">Categoría</label>
                        <select name="provincia" id="provincia" class="form-select"
                            :class="{ 'text-placeholder': articulo.categoria === '' }" v-model="articulo.categoria">
                            <option value="" disabled>Selecciona</option>
                            <option class="text-black" v-for="categoria in categoriasArticulos" :key="categoria.id"
                                :value="categoria.id">
                                {{ categoria.nombre }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Descripción y precio -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text text-align-top">Descripción</label>
                        <textarea class="form-control" placeholder="Descripción del artículo"
                            v-model="articulo.descripcion"></textarea>
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Precio unitario</label>
                        <input type="number" class="form-control" placeholder="Precio por cada unidad"
                            v-model="articulo.precio">
                        <label class="input-group-text">€</label>
                    </div>
                </div>

                <!-- Stock y personalización -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Stock</label>
                        <input type="number" class="form-control" placeholder="Stock actual en almacen"
                            v-model="articulo.stock">
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text text-align-top">Personalización</label>
                        <textarea class="form-control" placeholder="Personalización del artículo"
                            v-model="articulo.personalizacion"></textarea>
                    </div>
                </div>

                <!-- URL de la imagen y fecha de alta -->
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text">Imagen URL</label>
                        <input type="url" class="form-control" placeholder="http://imagen-del-articulo.png"
                            v-model="articulo.imagen">
                    </div>
                </div>
                <div class="col-6">
                    <div class="input-group">
                        <label class="input-group-text label-width">Fecha de alta</label>
                        <input type="date" class="form-control" placeholder="Fecha de alta del artículo"
                            v-model="articulo.alta">
                    </div>
                </div>

                <!-- Botones -->
                <div class="d-flex mb-4 gap-4 px-4 mt-5">
                    <button type="button" class="btn btn-primary fs-5 py-2 w-100" @click.prevent="guardarArticulo()">
                        <i class="bi bi-floppy-fill me-2"></i>
                        Guardar
                    </button>
                    <button type="button" class="btn btn-primary fs-5 py-2 w-100" @click.prevent="limpiarFormulario()">
                        <i class="bi bi-pencil-fill me-1"></i>
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Tabla -->
    <h2 class="text-center fw-bold mt-4">Tabla de artículos</h2>

    <div class="my-3 mx-2">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col" class="bg-info-subtle text-center">ID</th>
                        <th scope="col" class="bg-info-subtle text-center">Nombre</th>
                        <th scope="col" class="bg-info-subtle text-center">Categoría</th>
                        <th scope="col" class="bg-info-subtle text-center">Descripción</th>
                        <th scope="col" class="bg-info-subtle text-center">Precio</th>
                        <th scope="col" class="bg-info-subtle text-center">Stock</th>
                        <th scope="col" class="bg-info-subtle text-center">Fecha Alta</th>
                        <th scope="col" class="bg-warning-subtle text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="articulo in articulosPorPagina" :key="articulo.id">
                        <td class="align-middle text-center">{{ articulo.id }}</td>
                        <td class="align-middle text-center">{{ articulo.nombre }}</td>
                        <td class="align-middle text-center">{{ articulo.categoria }}</td>
                        <td class="align-middle text-center">{{ articulo.descripcion }}</td>
                        <td class="align-middle text-center">{{ articulo.precio }}</td>
                        <td class="align-middle text-center">{{ articulo.stock }}</td>
                        <td class="align-middle text-center">{{ articulo.alta }}</td>
                        <td class="text-center align-middle pale-yellow">
                            <div>
                                <button class="btn btn-warning m-2" @click.prevent="seleccionarArticulo(articulo)">
                                    <i class="bi bi-pencil-fill"></i>
                                </button>
                                <button class="btn btn-danger m-2" @click.prevent="eliminarArticulo(articulo)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Paginación en la tabla -->
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary" :disabled="paginaActual === 1" @click="paginaAnterior()">
                <i class="bi bi-chevron-left"></i>
            </button>

            <span class="mx-3 align-self-center"> Página {{ paginaActual }}</span>

            <button class="btn btn-primary" :disabled="paginaActual * porPagina >= articulos.length"
                @click="siguientePagina()">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>

</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: "TablaArticulos",

    data() {
        return {
            articulo: {
                nombre: "",
                categoria: "",
                descripcion: "",
                precio: 0,
                stock: 0,
                personalizacion: "",
                imagen: "",
                alta: "",
            },
            categoriasArticulos: [
                {
                    id: 1,
                    nombre: "Electrónica"
                },
                {
                    id: 2,
                    nombre: "Hogar"
                },
                {
                    id: 3,
                    nombre: "Ofimática"
                },
                {
                    id: 4,
                    nombre: "Deporte"
                },
                {
                    id: 5,
                    nombre: "Libros"
                },
                {
                    id: 6,
                    nombre: "Otros"
                },
            ],
            articulos: [],
            paginaActual: 1,
            porPagina: 5,
        }
    },

    computed: {
        articulosPorPagina() {
            const indiceInicial = (this.paginaActual - 1) * this.porPagina;
            return this.articulos.slice(indiceInicial, indiceInicial + this.porPagina);
        }
    },

    methods: {
        // Alerta usada en diversas validaciones
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

        // Limpia el formulario de la parte superior de la página
        limpiarFormulario() {
            this.articulo = {
                nombre: "",
                categoria: "",
                descripcion: "",
                precio: 0,
                stock: 0,
                personalizacion: "",
                imagen: "",
                alta: "",
            };
        },

        // Interactuar con la DB
        async guardarArticulo() {
            if (this.articulo.nombre && this.articulo.categoria && this.articulo.precio && this.articulo.stock && this.articulo.alta) {
                try {
                    const response = await fetch("http://localhost:5000/articulos");
                    if (!response.ok) {
                        throw new Error("Error al obtener los articulos: " + response.statusText);
                    }

                    const crearResponse = await fetch("http://localhost:5000/articulos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(this.articulo)
                    })

                    if (!crearResponse.ok) {
                        throw new Error("Error al guardar el artículo: " + crearResponse.statusText);
                    }

                    this.mostrarAlerta("Aviso", "Artículo guardado correctamente", "success");
                    this.limpiarFormulario();

                } catch (error) {
                    console.log(error);
                    this.mostrarAlerta("Error", "No se pudo guardar el artículo.", "error");
                }
            } else {
                this.mostrarAlerta("Error", "Por favor completa todos los campos requeridos", "error");
            }
        },
    },
}
</script>

<style scoped>
.text-placeholder {
    color: #595c5f;
}
</style>