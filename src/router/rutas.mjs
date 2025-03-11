import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import { Articulo, Factura } from "../modelos/modelos.js";

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

// Para el correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VUE_APP_EMAIL_USER,
    pass: process.env.VUE_APP_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

rutas.post("/enviar-correo", (req, res) => {
  console.log("Datos recibidos: ", req.body.toString());
  const { nombre, telefono, email, mensaje } = req.body;

  const mailOptions = {
    from: email,
    to: "nesflaispendejo@gmail.com",
    subject: "Mensaje de contacto",
    text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\nMensaje: ${mensaje}`,
  };
  // eslint-disable-next-line no-unused-vars
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo", error);
      return res.status(500).json({
        error: "Error al enviar el mensaje, por favor inténtelo de nuevo",
      });
    }
    console.log("Email enviado");
    return res.status(200).json({ message: "Mensaje enviado correctamente" });
  });
});

// CRUD Facturas
rutas.get("/facturas", async (req, res) => {
  try {
    const facturas = await Factura.find({});
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error al obtener factura:", error);
  }
});

rutas.post("/facturas", async (req, res) => {
  try {
    const factura = new Factura(req.body);
    const facturaGuardada = await factura.save();
    res.status(201).json(facturaGuardada);
    console.log("Factura guardado correctamente");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error al guardar factura:", error);
  }
});

rutas.put("/facturas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido:", id);

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("No hay factura con ese ID");
    }

    // Intentar encontrar y actualizar el artículo
    const factura = await Factura.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Si no se encuentra el artículo
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrado" });
    }

    // Responder con el artículo actualizado
    res.json(factura);
    console.log("Factura actualizado correctamente");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error al actualizar factura:", error);
  }
});

rutas.delete("/facturas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido:", id);

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("No hay factura con ese ID");
    }

    // Intentar encontrar y eliminar el artículo
    const factura = await Factura.findByIdAndDelete(id);

    // Si no se encuentra el artículo
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrado" });
    }

    // Responder con el artículo eliminado
    res.json(factura);
    console.log("Factura eliminado correctamente");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error al eliminar factura:", error);
  }
});

rutas.post("/crear-checkout-session", async (req, res) => {
  try {
    const stripe = new Stripe(process.env.VUE_APP_STRIPE_SECRET_KEY);

    const { items, amount } = req.body;
    console.log(items, amount);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Debe haber al menos un producto en el carrito" });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.nombre,
        },
        unit_amount: parseInt(item.precio * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:8080/success",
      cancel_url: "http://localhost:8080/cancel",
    });
    console.log(session);
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error al crear la sesión de pago: ", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default rutas;
