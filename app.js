import express from 'express';

const PORT = 3000;

const app = express();
app.disable('x-powered-by');

app.get("/", (req, res) => {
    res.send("Hello  Server!");
});


app.get("/", (req, res) => {
    res.send({"name": "Task API", "version": "1.0", "endpoints": ["/tasks"]})
});


app.get("/health", (req, res) => {
    res.send({"status": "ok"})
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});