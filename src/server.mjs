import express from "express";
import http from "http";
import morgan from "morgan";
// import mongoose from "mongoose";
import rutas from "../src/router/rutas.mjs";

const app = express();
const server = http.createServer(app);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", rutas);

app.set("port", process.env.PORT || 5000);

app.get("/", (req, res) => res.send("Servidor para MongoDB."));


server.listen(app.get("port"), () => {
    console.log("Servidor corriendo en el puerto: ", app.get("port"));
});