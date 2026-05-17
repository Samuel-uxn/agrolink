const http = require("http");
const fs = require("fs");
const path = require("path");

const servidor = http.createServer((req, res) => {

    let archivo = "." + req.url;

    if (archivo === "./") {
        archivo = "./index.html";
    }

    const ext = path.extname(archivo);

    let tipo = "text/html";

    if (ext === ".css") {
        tipo = "text/css";
    }

    fs.readFile(archivo, (error, contenido) => {

        if (error) {
            res.writeHead(404);
            res.end("Archivo no encontrado");
            return;
        }

        res.writeHead(200, { "Content-Type": tipo });
        res.end(contenido);
    });
});

servidor.listen(5000, () => {
    console.log("Servidor en http://localhost:3000");
});