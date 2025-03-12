import Swal from "sweetalert2";

const API_URL = "http://localhost:5000/facturas";

export async function obtenerFacturas() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      Swal.fire("Error", "No se pudo obtener el listado de facturas", "error");
      throw new Error("Error al obtener los facturas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    Swal.fire("Error", "Fallo conexión", "error");
    throw error;
  }
}

export async function agregarFactura(datosFactura) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosFactura),
    });

    if (!response.ok) {
      Swal.fire("Error", "No se pudo agregar el factura", "error");
      throw new Error("Error al agregar la factura");
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

export async function actualizarFactura(id, factura) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factura),
    });

    if (!response.ok) {
      Swal.fire("Error", "No se pudo actualizar el factura", "error");
      throw new Error("Error al actualizar el factura");
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

export async function eliminarFactura(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      Swal.fire("Error", "No se pudo eliminar el factura", "error");
      throw new Error("Error al eliminar el factura");
    }

    return await response.json();
  } catch (error) {
    console.error("error");
    Swal.fire(
      "Error",
      "No se pudo conectar al servidor para eliminar el factura",
      "error"
    );
    throw error;
  }
}
