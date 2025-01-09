import mongoose from "mongoose";

const articuloSchema = new mongoose.Schema({
    nombre: { type: String, require: true },
    categoria: { type: String, require: true },
    descripcion: { type: String },
    precio: { type: Number, require: true },
    stock: { type: Number, require: true },
    personalizacion: { type: String },
    alta: { type: Date, require: true },
}, {
    versionKey: false
});

const Articulo = mongoose.model("Articulo", articuloSchema);
export default Articulo;