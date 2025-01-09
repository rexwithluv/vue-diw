import express from "express";
import http from "http";
import morgan from "morgan";
import mongoose from "mongoose";
import rutas from "../src/router/rutas.mjs";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(rutas);

app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Servidor para MongoDB."));

app.set("port", process.env.PORT || 5000);

server.listen(app.get("port"), () => {
    console.log("Servidor corriendo en el puerto: ", app.get("port"));
});

mongoose.connect("mongodb://root:renaido@localhost:27017/bbdd?authSource=admin")
    .then(() => console.log("Conectado a MongoDB"))
    .catch(error => console.error("Error: ", error));