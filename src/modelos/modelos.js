import mongoose from "mongoose";

const articuloSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    descripcion: { type: String, maxlength: 256 },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    personalizacion: { type: String },
    alta: { type: Date, required: true },
    imagen: { type: String, maxlength: 150 },
  },
  { versionKey: false }
);

const facturaSchema = new mongoose.Schema({
  clienteID: { type: String, required: true },
  items: [
    {
      productoId: { type: String, required: true },
      nombre: { type: String, required: true },
      precio_unitario: { type: Number, required: true },
      cantidad: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  totalFactura: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

export const Articulo = mongoose.model("Articulo", articuloSchema);
export const Factura = mongoose.model("Factura", facturaSchema);
