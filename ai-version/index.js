import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import { sequelize } from "./db.js";
import { Task } from "./models/Task.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = 3001;

app.use(express.json());

// Root and health endpoints
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Read endpoints
app.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.findAll({ order: [["id", "ASC"]] });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

app.get("/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// Stage 3 - Create endpoint
app.post("/tasks", async (req, res, next) => {
  try {
    const { title } = req.body ?? {};
 
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }
 
    const task = await Task.create({ title: title.trim(), done: false });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// Update & delete endpoints
app.put("/tasks/:id", async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
 
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
 
    const { title, done } = req.body ?? {};
    const hasTitle = title !== undefined;
    const hasDone = done !== undefined;
 
    if (!hasTitle && !hasDone) {
      return res
        .status(400)
        .json({ error: "Provide at least one of: title, done" });
    }
 
    if (hasTitle && (typeof title !== "string" || title.trim() === "")) {
      return res
        .status(400)
        .json({ error: "Title must be a non-empty string" });
    }
 
    if (hasDone && typeof done !== "boolean") {
      return res.status(400).json({ error: "Done must be a boolean" });
    }
 
    await task.update({
      ...(hasTitle && { title: title.trim() }),
      ...(hasDone && { done }),
    });
 
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

app.delete("/tasks/:id", async (req, res, next) => {
  try {
    const deletedCount = await Task.destroy({
      where: { id: req.params.id },
    });
 
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
 
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Swagger UI docs at /docs
const openapiPath = path.join(__dirname, "openapi.json");
const openapiDocument = JSON.parse(fs.readFileSync(openapiPath, "utf-8"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

// 404 fallback for anything else
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
// app.listen(PORT, () => {
//   console.log(`Task API listening on http://localhost:${PORT}`);
//   console.log(`Swagger docs at http://localhost:${PORT}/docs`);
// });

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL.");
 
    // Creates the `tasks` table automatically if it doesn't exist yet.
    // For production, prefer migrations over sync({ alter: true }).
    await sequelize.sync();
    console.log("Models synced.");
 
    app.listen(PORT, () => {
      console.log(`Task API listening on http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/docs`);
    });
  } catch (err) {
    console.error("Unable to start the server:", err);
    process.exit(1);
  }
}
 
start();