import express from 'express';

const PORT = 3000;

const app = express();
app.disable('x-powered-by');

const tasks = [
    { id: 1, title: "Read a bible", done: true },
    { id: 2, title: "Build an app", done: true },
    { id: 3, title: "Go for lecture", done: false }
];

app.get("/", (req, res) => {
    res.send("Hello  Server!");
});


app.get("/", (req, res) => {
    res.status(200).json({"name": "Task API", "version": "1.0", "endpoints": ["/tasks"]})
});


app.get("/health", (req, res) => {
    res.status(200).json({"status": "ok"})
});

app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = tasks.find(t => t.id === Number.parseInt(id));
    if (!task) {
        res.status(404).json({"error": "Task not found"});
        return;
    }
    res.status(200).json(task);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});