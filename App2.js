// Inicializamos express y colocamos por defecto el puerto 3000
const express = require("express");
const app = express();
const PORT = 3000;

app.get("/App/Saludo", (req, res) => {
    res.send("¡Hola, Alvaro!")
})


//Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});