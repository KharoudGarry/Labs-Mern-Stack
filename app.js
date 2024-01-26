import express from "express";
import dotenv from "dotenv";
import PageRoutes from "./routes/PagesRoutes.js";
import CardRoutes from "./routes/CardRoutes.js";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}.8md1ukj.mongodb.net/inclass?retryWrites=true&w=majority`)
.then(() => console.log("MongoDb connected"))
.catch((error) => console.error(error))

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());

// Middleware for parsing url-encoded requests
app.use(express.urlencoded({ extended: true }));

app.use((req, _, next) => {
  if(req.body && typeof req.body === "object" && "_method" in req.body)
  {
    const method = req.body._method;
    delete req.body.method;

    req.method = method;
  }

  next();
})

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => { 
    const duration = Date.now() - start;
    console.log(`Request to ${req.path} took ${duration}ms`);
  });
  next();
});


// Register your routes
app.use("/", PageRoutes);
app.use("/cards", CardRoutes);

// Error-handling middleware
app.use((error, req, res, next) => {
  if (typeof error === "string") {
    error = new Error(error);
  }

  if (!error.status) error.status = 404;
  console.error(error);

  res.status(error.status).send(error.message);
});

export default app;
