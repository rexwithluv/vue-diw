import Swal from 'sweetalert2';

const ARTICULOS_URL = "http://localhost:5000/articulos/";

// Función auxiliar
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
export function limpiarFormulario(formulario) {
    return {
        ...formulario,
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
        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function seleccionarArticulo(articulo, articulos) {
    try {
        const response = await fetch(ARTICULOS_URL);
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const articuloEncontrado = articulos.find(art => art._id === articulo._id);
        if (articuloEncontrado) {
            articulo = { ...articulo };

            // Línea mágica que hace que ahora funcione
            if (articulo.alta) {
                articulo.alta = articulo.alta.split('T')[0];
            }

            return articulo;
        } else {
            mostrarAlerta('Error', 'Artículo no encontrado en el servidor.', 'error');
        }
    } catch (error) {
        console.error(error);
        mostrarAlerta('Error', 'No se pudo cargar el artículo desde el servidor.', 'error');
        throw error;
    }
}

export async function guardarArticulo(articulo) {
    try {
        const response = await fetch(ARTICULOS_URL);
        if (!response.ok) {
            throw new Error("Error al obtener los articulos: " + response.statusText);
        }

        if (articulo._id) {
            const editarResponse = await fetch(ARTICULOS_URL + articulo._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(articulo)
            })

            if (!editarResponse.ok) {
                throw new Error("Error al guardar el artículo: " + editarResponse.statusText);
            }

            mostrarAlerta("Aviso", "Artículo editado correctamente", "success");
        } else {
            const crearResponse = await fetch(ARTICULOS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(articulo)
            })

            if (!crearResponse.ok) {
                throw new Error("Error al guardar el artículo: " + crearResponse.statusText);
            }

            mostrarAlerta("Aviso", "Artículo guardado correctamente", "success");
        }

    } catch (error) {
        console.log(error);
        mostrarAlerta("Error", "No se pudo guardar el artículo.", "error");
        throw error;
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

            mostrarAlerta("Artículo eliminado", "Artículo eliminado correctamente", "success")
        } catch (error) {
            console.error(error);
            mostrarAlerta('Error', 'No se pudo cargar el articulo desde el servidor.', 'error');
        }
    }
}

// Métodos para la paginación en la tabla
export function siguientePagina(paginaActual, porPagina, articulos) {
    if (paginaActual * porPagina < articulos.length) {
        return ++paginaActual;
    }
}
export function paginaAnterior(paginaActual) {
    if (paginaActual > 1) {
        return --paginaActual;
    }
}
