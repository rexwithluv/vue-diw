import Swal from "sweetalert2";

const ARTICULOS_URL = "http://localhost:5000/articulos/";

export async function obtenerArticulos() {
  try {
    const response = await fetch(ARTICULOS_URL);
    if (!response.ok) {
      Swal.fire("Error", "No se pudo obtener el listado de artículos", "error");
      throw new Error("Error al obtener los artículos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    Swal.fire("Error", "Fallo conexión", "error");
    throw error;
  }
}

export async function agregarArticulo(datosArticulo) {
  try {
    const response = await fetch(ARTICULOS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosArticulo),
    });

    if (!response.ok) {
      Swal.fire("Error", "No se pudo agregar el artículo", "error");
      throw new Error("Error al agregar el artículo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    Swal.fire(
      "Error",
      "No se pudo conectar al servidor o campos vacíos",
      "error"
    );
    throw error;
  }
}

export async function actualizarArticulo(id, articulo) {
  try {
    const response = await fetch(`${ARTICULOS_URL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articulo),
    });

    if (!response.ok) {
      Swal.fire("Error", "No se pudo actualizar el artículo", "error");
      throw new Error("Error al actualizar el artículo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    Swal.fire(
      "Error",
      "No se pudo conectar al servidor o nada que actualizar",
      "error"
    );
    throw error;
  }
}

export async function eliminarArticulo(id) {
  try {
    const response = await fetch(`${ARTICULOS_URL}${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      Swal.fire("Error", "No se pudo eliminar el artículo", "error");
      throw new Error("Error al eliminar el artículo");
    }

    return await response.json();
  } catch (error) {
    console.error("error");
    Swal.fire(
      "Error",
      "No se pudo conectar al servidor para eliminar el artículo",
      "error"
    );
    throw error;
  }
}
