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

const Articulo = mongoose.model("Articulo", articuloSchema);
export default Articulo;
