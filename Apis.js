// Inicializamos express y colocamos por defecto el puerto 3000
const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para leer JSON en el body
app.use(express.json());

// "Base de datos" temporal en memoria
let tareas = [
    { id: 1, titulo: "Estudiar Express", completada: false },
    { id: 2, titulo: "Avanzar en UniSport", completada: true }
];

// Calcula el siguiente id al iniciar (por si ya hay datos):
let nextId = tareas.length ? Math.max(...tareas.map(t => t.id)) + 1 : 1;


// GET → Listar todas las tareas
app.get("/api/tareas", (req, res) => {
    res.json(tareas);
});

// POST → Crear una nueva tarea
app.post("/api/tareas", (req, res) => {
    const { titulo } = req.body;
    if (typeof titulo !== "string" || !titulo.trim()) {
        return res.status(400).json({ error: "El campo 'titulo' es requerido y no puede estar vacío" });
    }

    // Evitar títulos duplicados (ya que en tus otras rutas lo haces)
    const dup = tareas.some(t => t.titulo.toLowerCase() === titulo.trim().toLowerCase());
    if (dup) {
        return res.status(409).json({ error: "Ya existe una tarea con ese título" });
    }

    const nuevaTarea = { id: nextId++, titulo: titulo.trim(), completada: false };
    tareas.push(nuevaTarea);
    return res.status(201).json(nuevaTarea);
});


// DELETE → Eliminar una tarea por id
app.delete("/api/tareas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    tareas = tareas.filter(t => t.id !== id);
    res.json({ mensaje: `Tarea ${id} eliminada` });
});

// PUT /api/tareas/:id  -> reemplaza completamente (requiere 'titulo' y 'completada')
app.put("/api/tareas/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "El parámetro :id debe ser un número entero" });
    }

    const { titulo, completada } = req.body || {};
    if (typeof titulo !== "string" || !titulo.trim()) {
        return res.status(400).json({ error: "El campo 'titulo' es requerido y no puede estar vacío" });
    }
    if (typeof completada !== "boolean") {
        return res.status(400).json({ error: "El campo 'completada' es requerido y debe ser boolean" });
    }

    const idx = tareas.findIndex(t => Number(t.id) === id);
    if (idx === -1) {
        return res.status(404).json({ error: `No existe la tarea ${id}` });
    }

    //Evitar títulos duplicados (ignorando mayúsculas)
    const dup = tareas.some(t => Number(t.id) !== id && t.titulo.toLowerCase() === titulo.trim().toLowerCase());
    if (dup) {
        return res.status(409).json({ error: "Ya existe una tarea con ese título" });
    }

    tareas[idx] = { id, titulo: titulo.trim(), completada };
    return res.json(tareas[idx]);
    });

    // PATCH /api/tareas/:id  -> actualización parcial (puedes enviar 'titulo' y/o 'completada')
    app.patch("/api/tareas/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "El parámetro :id debe ser un número entero" });
    }

    const idx = tareas.findIndex(t => Number(t.id) === id);
    if (idx === -1) {
        return res.status(404).json({ error: `No existe la tarea ${id}` });
    }

    let { titulo, completada } = req.body || {};
    const tarea = { ...tareas[idx] };

    if (titulo !== undefined) {
        if (typeof titulo !== "string" || !titulo.trim()) {
        return res.status(400).json({ error: "Si envías 'titulo', debe ser string no vacío" });
        }
        const dup = tareas.some(t => Number(t.id) !== id && t.titulo.toLowerCase() === titulo.trim().toLowerCase());
        if (dup) {
        return res.status(409).json({ error: "Ya existe una tarea con ese título" });
        }
        tarea.titulo = titulo.trim();
    }

    if (completada !== undefined) {
        if (typeof completada !== "boolean") {
        return res.status(400).json({ error: "Si envías 'completada', debe ser boolean" });
        }
        tarea.completada = completada;
    }

    tareas[idx] = tarea;
    return res.json(tarea);
    });

    //PATCH rápido para alternar completada
    app.patch("/api/tareas/:id/toggle", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "El parámetro :id debe ser un número entero" });
    }
    const idx = tareas.findIndex(t => Number(t.id) === id);
    if (idx === -1) {
        return res.status(404).json({ error: `No existe la tarea ${id}` });
    }
    tareas[idx].completada = !tareas[idx].completada;
    res.json(tareas[idx]);
});


//Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});