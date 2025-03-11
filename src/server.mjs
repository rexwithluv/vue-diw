import express from "express";
import http from "node:http";
import morgan from "morgan";
import mongoose from "mongoose";
import rutas from "../src/router/rutas.mjs";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(rutas);

app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Servidor para MongoDB."));

app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads/images/",
  express.static(path.join(__dirname, "../uploads/images"))
);
app.use("/uploads/cv/", express.static(path.join(__dirname, "../uploads/cv")));

app.set("port", process.env.PORT || 5000);

server.listen(app.get("port"), () => {
  console.log("Servidor corriendo en el puerto: ", app.get("port"));
});

mongoose
  .connect("mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error: ", error));
