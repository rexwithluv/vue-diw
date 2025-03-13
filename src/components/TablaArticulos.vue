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
            <input type="text" class="form-control" placeholder="Nombre del artículo" v-model="articulo.nombre" />
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

        <!-- Descripción y personalización -->
        <div class="col-6">
          <div class="input-group">
            <label class="input-group-text text-align-top">Descripción</label>
            <textarea class="form-control" placeholder="Descripción del artículo"
              v-model="articulo.descripcion"></textarea>
          </div>
        </div>
        <div class="col-6">
          <div class="input-group">
            <label class="input-group-text text-align-top">Personalización</label>
            <textarea class="form-control" placeholder="Personalización del artículo"
              v-model="articulo.personalizacion"></textarea>
          </div>
        </div>

        <!-- Precio, stock, fecha de alta -->
        <div class="col-4">
          <div class="input-group">
            <label class="input-group-text">€/Un</label>
            <input type="number" class="form-control" placeholder="Precio por cada unidad" v-model="articulo.precio" />
          </div>
        </div>
        <div class="col-4">
          <div class="input-group">
            <label class="input-group-text">Stock</label>
            <input type="number" class="form-control" placeholder="Stock actual en almacen" v-model="articulo.stock" />
          </div>
        </div>
        <div class="col-4">
          <div class="input-group">
            <label class="input-group-text label-width">Fecha de alta</label>
            <input type="date" class="form-control" placeholder="Fecha de alta del artículo" v-model="articulo.alta" />
          </div>
        </div>

        <!-- Imagen -->
        <div class="col-12">
          <div class="input-group">
            <label class="input-group-text">Imagen</label>
            <input type="file" class="form-control" accept=".png, .jpg, .jpeg" ref="fileInput"
              @change="handleFileChange" />
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
            <td class="align-middle text-center">
              {{ articulo._id.slice(-8) }}
            </td>
            <td class="align-middle text-center">{{ articulo.nombre }}</td>
            <td class="align-middle text-center">
              {{ getCategoriaArticulo(articulo) }}
            </td>
            <td class="align-middle text-center">{{ articulo.descripcion }}</td>
            <td class="align-middle text-center">
              {{ formatearPrecio(articulo.precio) }}€
            </td>
            <td class="align-middle text-center">{{ articulo.stock }}</td>
            <td class="align-middle text-center">
              {{ formatearFecha(articulo.alta) }}
            </td>
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
import {
  actualizarArticulo,
  agregarArticulo,
  eliminarArticulo,
  obtenerArticulos,
} from "@/js/articuloServicios";
import Swal from "sweetalert2";

export default {
  name: "TablaArticulos",

  data() {
    return {
      articulo: {
        _id: "",
        nombre: "",
        categoria: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        personalizacion: "",
        imagen: "",
        alta: "",
      },
      categoriasArticulos: [],
      articulos: [],
      paginaActual: 1,
      porPagina: 5,
      archivo: null,
    };
  },

  mounted() {
    this.getArticulos();
    this.getCategorias();
  },

  computed: {
    articulosPorPagina() {
      const indiceInicial = (this.paginaActual - 1) * this.porPagina;
      return this.articulos.slice(
        indiceInicial,
        indiceInicial + this.porPagina
      );
    },
  },

  methods: {
    async getCategorias() {
      try {
        const response = await fetch(
          "http://localhost:3000/categoriasArticulos"
        );

        if (!response.ok) {
          throw new Error(`Error en la solicitud${response.statusText}`);
        }

        const data = await response.json();
        this.categoriasArticulos = data;
      } catch (error) {
        console.error(error);
      }
    },
    async getArticulos() {
      try {
        this.articulos = await obtenerArticulos();
      } catch (error) {
        console.error(error);
      }
    },

    async guardarArticulo() {
      if (
        !this.articulo.nombre ||
        !this.articulo.categoria ||
        !this.articulo.precio ||
        !this.articulo.stock
      ) {
        this.mostrarAlerta(
          "Error",
          "Por favor completa todos los campos requeridos",
          "error"
        );
        return;
      }

      try {
        // Si el artículo ya existe lo modificamos
        let articuloExisteID;

        if (this.articulo._id) {
          actualizarArticulo(this.articulo._id, this.articulo);

          articuloExisteID = this.articulo._id;
          this.mostrarAlerta(
            "Aviso",
            "Artículo modificado correctamente",
            "success"
          );
          this.getArticulos();
        } else {
          // Borramos el id para que no de problemas
          delete this.articulo._id;

          const articuloAgregado = await agregarArticulo(this.articulo);
          articuloExisteID = articuloAgregado._id;
          this.mostrarAlerta(
            "Aviso",
            "Artículo dado de alta correctamente",
            "success"
          );
          this.getArticulos();
        }

        // Si existe un archivo, lo cargamos contra el servidor
        if (this.archivo) {
          const formData = new FormData();
          const nuevoArchivo = new File(
            [this.archivo],
            `${articuloExisteID}.${this.archivo.name.split(".").pop()}`,
            { type: this.archivo.type }
          );
          formData.append("img", nuevoArchivo);

          console.log(nuevoArchivo);

          const fileResponse = await fetch("http://localhost:5000/subirimg", {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          if (!fileResponse.ok) {
            throw new Error("Error al subir el archivo");
          }

          const fileData = await fileResponse.json();

          this.articulo.imagen = `${fileData.archivo.originalname}`;
          actualizarArticulo(articuloExisteID, this.articulo);
        }

        this.limpiarFormulario();
        this.getArticulos();
      } catch (error) {
        console.error(`Error${error}`);
        this.mostrarAlerta("Error", "No se pudo guardar el artículo.", "error");
      }
    },
    async seleccionarArticulo(articulo) {
      try {
        this.limpiarFormulario();
        const articulos = await obtenerArticulos();

        const articuloEncontrado = articulos.find(
          (art) => art._id === articulo._id
        );

        if (articuloEncontrado) {
          this.articulo = { ...articulo };

          // Línea mágica que hace que ahora funcione
          if (this.articulo.alta) {
            this.articulo.alta = this.articulo.alta.split("T")[0];
          }
        } else {
          this.mostrarAlerta(
            "Error",
            "Artículo no encontrado en el servidor.",
            "error"
          );
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta(
          "Error",
          "No se pudo cargar el usuario desde el servidor.",
          "error"
        );
      }
    },
    async eliminarArticulo(articulo) {
      const confirmacion = await Swal.fire({
        title: "Confirmación",
        html: `¿Desea eliminar <strong>${articulo.nombre}</strong>? <br><br>
            Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        try {
          if (articulo._id) {
            eliminarArticulo(articulo._id);

            await fetch(`http://localhost:5000/articulos/${articulo._id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
          }

          this.mostrarAlerta(
            "Aviso",
            "Artículo eliminado correctamente.",
            "success"
          );
        } catch (error) {
          console.error(error);
          this.mostrarAlerta(
            "Error",
            "No se pudo cargar el articulo desde el servidor.",
            "error"
          );
        }

        // Recargamos la tabla al finalizar la operación
        this.getArticulos();
      }
    },

    getCategoriaArticulo(articulo) {
      if (this.categoriasArticulos.length === 0) {
        return "Cargando categorías...";
      }

      return this.categoriasArticulos.find(
        (cat) => cat.id === articulo.categoria
      ).nombre;
    },
    handleFileChange(e) {
      this.archivo = e.target.files[0];
    },

    formatearPrecio(precio) {
      if (!Number.isInteger(precio)) {
        const precioStr = precio.toString();
        const euros = precioStr.split(".")[0];
        let centimos = precioStr.split(".")[1];

        if (centimos.length === 1) {
          centimos = `${centimos}0`;
        }

        return `${euros},${centimos}`;
      }
      return `${precio},00`;
    },
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    mostrarAlerta(titulo, mensaje, icono) {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
      });
    },
    limpiarFormulario() {
      this.articulo = {
        _id: "",
        nombre: "",
        categoria: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        personalizacion: "",
        imagen: "",
        alta: "",
      };
      this.archivo = null;
      this.$refs.fileInput.value = null;
    },

    // Métodos para la paginación en la tabla
    siguientePagina() {
      if (this.paginaActual * this.porPagina < this.articulos.length) {
        this.paginaActual++;
      }
    },
    paginaAnterior() {
      if (this.paginaActual > 1) {
        this.paginaActual--;
      }
    },
  },
};
</script>

<style scoped>
.text-placeholder {
  color: #595c5f;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
