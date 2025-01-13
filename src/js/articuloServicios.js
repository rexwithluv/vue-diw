import Swal from 'sweetalert2';

const ARTICULOS_URL = "http://localhost:5000/articulos";

// Funciones auxiliares
export function mostrarAlerta(titulo, mensaje, icono) {
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
}

// Limpia el formulario de la parte superior de la página
export function limpiarFormulario() {
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
}

// Formatear el precio para que use el formato EE,cc
export function formatearPrecio(precio) {
    if (!Number.isInteger(precio)) {
        precio = precio.toString();
        let euros = precio.split(".")[0];
        let centimos = precio.split(".")[1];

        if (centimos.length === 1) {
            centimos = centimos + "0";
        }

        return `${euros},${centimos}`;
    } else {
        return precio + ",00";
    }
}

// Interactuar con la DB
export async function getArticulos() {
    try {
        const response = await fetch(ARTICULOS_URL);
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        this.articulos = await response.json();
    } catch (error) {
        console.log(error);
    }
}
export async function seleccionarArticulo(articulo) {
    try {
        this.limpiarFormulario();
        const response = await fetch(ARTICULOS_URL);
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const articuloEncontrado = this.articulos.find(art => art._id === articulo._id);
        if (articuloEncontrado) {
            this.articulo = { ...articulo };

            // Línea mágica que hace que ahora funcione
            if (this.articulo.alta) {
                this.articulo.alta = this.articulo.alta.split('T')[0];
            }
        } else {
            this.mostrarAlerta('Error', 'Usuario no encontrado en el servidor.', 'error');
        }
    } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el usuario desde el servidor.', 'error');
    }
}

export async function guardarArticulo() {
    if (this.articulo.nombre && this.articulo.categoria && this.articulo.precio && this.articulo.stock && this.articulo.alta) {
        try {
            const response = await fetch(ARTICULOS_URL);
            if (!response.ok) {
                throw new Error("Error al obtener los articulos: " + response.statusText);
            }

            if (this.articulo._id) {
                const editarResponse = await fetch(ARTICULOS_URL + this.articulo._id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.articulo)
                })

                if (!editarResponse.ok) {
                    throw new Error("Error al guardar el artículo: " + editarResponse.statusText);
                }

                this.mostrarAlerta("Aviso", "Artículo editado correctamente", "success");
            } else {
                const crearResponse = await fetch(ARTICULOS_URL, {
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
            }


            this.limpiarFormulario();
            this.getArticulos();

        } catch (error) {
            console.log(error);
            this.mostrarAlerta("Error", "No se pudo guardar el artículo.", "error");
        }
    } else {
        this.mostrarAlerta("Error", "Por favor completa todos los campos requeridos", "error");
    }
}

export async function eliminarArticulo(articulo) {
    const result = await Swal.fire({
        title: "Confirmación",
        html: `¿Desea eliminar <strong>${articulo.nombre}</strong>? <br><br>
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
            const response = await fetch(ARTICULOS_URL + articulo._id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(articulo),
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }
        } catch (error) {
            console.error(error);
            this.mostrarAlerta('Error', 'No se pudo cargar el articulo desde el servidor.', 'error');
        }

        // Recargamos la tabla al finalizar la operación
        this.getArticulos();
    }
}

// Métodos para la paginación en la tabla
export function siguientePagina() {
    if (this.paginaActual * this.porPagina < this.articulos.length) {
        this.paginaActual++;
    }
}
export function paginaAnterior() {
    if (this.paginaActual > 1) {
        this.paginaActual--;
    }
}
