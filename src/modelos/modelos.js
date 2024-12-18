import mongoose from "mongoose";

const articuloSchema = new mongoose.Schema({
    nombre: { type: String, require: true },
    precio: { type: String, require: true },
    descripcion: { type: String }
}, {
    versionKey: false
});

const Articulo = mongoose.model("Articulo", articuloSchema);
export default Articulo;