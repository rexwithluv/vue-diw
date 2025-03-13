import mongoose from "mongoose";

const facturaSchema = new mongoose.Schema({
  clienteID: { type: String, required: true },
  items: [
    {
      productoId: { type: String, required: true },
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  totalFactura: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

export const Factura = mongoose.model("Factura", facturaSchema);
