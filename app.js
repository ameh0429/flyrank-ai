import express from 'express';

const PORT = 3000;

const app = express();
app.disable('x-powered-by');
app.get("/", (req, res) => {
    res.send("Hello  Server!");
});

app.get("/health", (req, res) => {
    res.send("OK")
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});