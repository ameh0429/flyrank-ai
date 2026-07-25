import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import { Task } from './db.js';

const PORT = 3000;

const app = express();
app.disable('x-powered-by');

// Serve Swagger UI
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json())

// const tasks = [
//     { id: 1, title: "Read a bible", done: true },
//     { id: 2, title: "Build an app", done: true },
//     { id: 3, title: "Go for lecture", done: false }
// ];

app.get("/", (req, res) => {
    res.send("Hello  Server!");
});


app.get("/", (req, res) => {
    res.status(200).json({"name": "Task API", "version": "1.0", "endpoints": ["/tasks"]})
});


app.get("/health", (req, res) => {
    res.status(200).json({"status": "ok"})
});

// Get all tasks
// app.get("/tasks", (req, res) => {
//     res.status(200).json(tasks);
// });

app.get('/tasks', async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

// // Update a task
// app.get("/tasks/:id", (req, res) => {
//     const id = req.params.id;
//     const task = tasks.find(t => t.id === Number.parseInt(id));
//     if (!task) {
//         res.status(404).json({"error": "Task not found"});
//         return;
//     }
//     res.status(200).json(task);
// });

// // Create a new task
// app.post('/tasks', (req, res) => {
//   const { title } = req.body;

//   // Validation
//   if (!title || title.trim() === '') {
//     return res.status(400).json({ error: 'Title is required' });
//   }

//   const newTask = {
//     id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
//     title,
//     done: false,
//   };

//   tasks.push(newTask);
//   res.status(201).json(newTask);
// });

// //  Update a task
// app.put('/tasks/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const task = tasks.find(t => t.id === id);

//   if (!task) {
//     return res.status(404).json({ error: `Task ${id} not found` });
//   }

//   const { title, done } = req.body;

//   if (title === undefined && done === undefined) {
//     return res.status(400).json({ error: 'Nothing to update' });
//   }

//   if (title !== undefined) task.title = title;
//   if (done !== undefined) task.done = done;

//   res.json(task);
// });

// // Delete a task
// app.delete('/tasks/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const index = tasks.findIndex(t => t.id === id);

//   if (index === -1) {
//     return res.status(404).json({ error: `Task ${id} not found` });
//   }

//   tasks.splice(index, 1);
//   res.status(204).json("Task deleted successfully");
// });

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});



// import express from 'express';
// import db from './db.mjs';

// const app = express();
// const PORT = 3000;

// app.use(express.json());

// // GET /tasks
// app.get('/tasks', (req, res) => {
//   const tasks = db.prepare('SELECT * FROM tasks').all();
//   res.json(tasks);
// });

// // GET /tasks/:id
// app.get('/tasks/:id', (req, res) => {
//   const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
//   if (!task) return res.status(404).json({ error: 'Task not found' });
//   res.json(task);
// });

// // POST /tasks
// app.post('/tasks', (req, res) => {
//   const { title } = req.body;
//   if (!title || title.trim() === '') {
//     return res.status(400).json({ error: 'Title is required' });
//   }
//   const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)').run(title, 0);
//   const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
//   res.status(201).json(newTask);
// });

// // PUT /tasks/:id
// app.put('/tasks/:id', (req, res) => {
//   const { title, done } = req.body;
//   const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
//   if (!task) return res.status(404).json({ error: 'Task not found' });

//   db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?')
//     .run(title ?? task.title, done ?? task.done, req.params.id);

//   const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
//   res.json(updated);
// });

// // DELETE /tasks/:id
// app.delete('/tasks/:id', (req, res) => {
//   const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
//   if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
//   res.status(204).send();
// });

// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
