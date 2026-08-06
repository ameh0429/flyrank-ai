import express from "express";
import swaggerUi from "swagger-ui-express";
import { createClient } from '@supabase/supabase-js';
import fs from "node:fs";
import dotenv from 'dotenv';
import { Task } from "./db.js";

dotenv.config();

const PORT = 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.disable("x-powered-by");

// Serve Swagger UI
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

// const tasks = [
//     { id: 1, title: "Read a bible", done: true },
//     { id: 2, title: "Build an app", done: true },
//     { id: 3, title: "Go for lecture", done: false }
// ];

app.get("/", (req, res) => {
  res.send("Hello  Server!");
});

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Signup
app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const signup = await supabase.auth.signUp({
      email: email,
      password: password
    });
    res.status(200).json({ message: 'Signup successful', user: signup.data.user });
  } catch (error) {
    res.status(500).json({ error: 'Error occurred during signup' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const {email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  const {data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({error: 'Invalid login credentials'})
  }

  res.status(200).json({mesage: 'Login successful', access_token: data.session.access_token, refresh_token: data.session.refresh_token})
})

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

// Get task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

// // Create a new task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newTask = await Task.create({ title, done: false });
    res.status(201).json(newTask);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// //  Update a task
app.put('/tasks/:id', async (req, res) => {
  const { title, done } = req.body;

  // Validate input
  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.update({
      title: title ?? task.title,
      done: done ?? task.done,
    });

    res.json(task);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});


// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.destroy();
    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});


// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} and connected to superbase`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});