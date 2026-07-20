import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3001;

app.use(express.json());

// In-memory data
let tasks = [
  { id: 1, title: "Buy milk", done: false },
  { id: 2, title: "Write report", done: true },
  { id: 3, title: "Walk the dog", done: false },
];

// Tracks the next id to assign, independent of array length so ids stay
// unique even after deletions.
let nextId = tasks.length + 1;

// Stage 1 - Root and health endpoints
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
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});

// Stage 3 - Create endpoint
app.post("/tasks", (req, res) => {
  const { title } = req.body ?? {};

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);

  res.status(201).json(task);
});

// Update & delete endpoints
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

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
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  if (hasDone && typeof done !== "boolean") {
    return res.status(400).json({ error: "Done must be a boolean" });
  }

  if (hasTitle) task.title = title.trim();
  if (hasDone) task.done = done;

  res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);
  res.status(204).send();
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
app.listen(PORT, () => {
  console.log(`Task API listening on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/docs`);
});