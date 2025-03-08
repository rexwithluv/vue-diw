import fs from "node:fs";
import path from "node:path";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import Articulo from "../modelos/modelos.js";

const rutas = express.Router();

const storageImg = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/images/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Obtener la extensión del archivo
    const originalName = file.originalname.split(".")[0]; // Obtener el nombre original sin la extensión
    const filename = `${originalName}${fileExtension}`; // Ejemplo: 1234567890-nombreOriginal.pdf
    cb(null, filename); // Guardar el archivo con el nombre generado
  },
});

const uploadImg = multer({
  storage: storageImg,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Tipo de archivo no permitido"), false);
    }
    cb(null, true);
  },
});

rutas.post("/subirimg", uploadImg.single("img"), (req, res) => {
  console.log("Imagen recibida:", req.file);
  if (!req.file) {
    return res.status(400).json({ mensaje: "No se subió ninguna imagen" });
  }
  // Responder con el archivo subido y su ubicación
  res.status(200).json({
    mensaje: "Imagen subida con éxito",
    archivo: req.file,
  });
});

rutas.delete("/deleteimg/:nombre", (req, res) => {
  const nombreArchivo = req.params.nombre;
  const rutaArchivo = path.join("uploads/img", nombreArchivo);
  if (fs.existsSync(rutaArchivo)) {
    fs.unlinkSync(rutaArchivo);

    res.status(200).json({
      mensaje: "Archivo eliminado con exito",
    });
  } else {
    res.status(404).json({
      mensaje: "Archivo no encontrado",
    });
  }
});

rutas.get("/articulos", async (req, res) => {
  try {
    const articulos = await Articulo.find({});
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error al obtener artículos:", error);
  }
});

rutas.post("/articulos", async (req, res) => {
  try {
    const articulo = new Articulo(req.body);
    await articulo.save();
    res.status(201).json(articulo);
    console.log("Artículo guardado correctamente");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error al guardar artículo:", error);
  }
});

rutas.put("/articulos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido:", id);

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("No hay artículo con ese ID");
    }

    // Intentar encontrar y actualizar el artículo
    const articulo = await Articulo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Si no se encuentra el artículo
    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    // Responder con el artículo actualizado
    res.json(articulo);
    console.log("Artículo actualizado correctamente");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error al actualizar artículo:", error);
  }
});

rutas.delete("/articulos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido:", id);

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("No hay artículo con ese ID");
    }

    // Intentar encontrar y eliminar el artículo
    const articulo = await Articulo.findByIdAndDelete(id);

    // Si no se encuentra el artículo
    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    // Responder con el artículo eliminado
    res.json(articulo);
    console.log("Artículo eliminado correctamente");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error al eliminar artículo:", error);
  }
});

export default rutas;
