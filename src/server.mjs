import express from "express";
import http from "http";
import morgan from "morgan"

const app = express();
const server = http.createServer();

app.use(morgan("dev"));
app.use(express.json());
app.set("port", process.env.PORT || 5000);
app.get("/", (req, res) => res.send("Servidor en marcha"));

server.listen(app.get("port"), () => {
    console.log("Servidor corriendo en el puerto: ", app.get("port"));
});