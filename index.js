import app from "./app.js";

const port = process.env.PORT || 5200;

const server = app.listen(port, () => {
    console.log(`API listening on port http://localhost:${port}`);
});

export default server;