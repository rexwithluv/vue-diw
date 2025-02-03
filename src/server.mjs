import express from "express";
import http from "http";
import morgan from "morgan";
import mongoose from "mongoose";
import rutas from "../src/router/rutas.mjs";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(rutas);

app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Servidor para MongoDB."));

// Subida de ficheros
const storage = multer.diskStorage({
    destinatoin: (req, file, cb) => {
        const uploadDir = "uploads/cv";

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix)
    }


})

const upload = multer({ storage: storage });

app.post("/subircv", upload.single("archivo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ mensaje: "No se subió ningún archivo" });
    }
    console.log(req.file);

    res.status(200).json({
        mensaje: "Archivo subido con éxito",
        archivo: req.file
    })
})

app.set("port", process.env.PORT || 5000);

server.listen(app.get("port"), () => {
    console.log("Servidor corriendo en el puerto: ", app.get("port"));
});

mongoose.connect("mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin")
    .then(() => console.log("Conectado a MongoDB"))
    .catch(error => console.error("Error: ", error));