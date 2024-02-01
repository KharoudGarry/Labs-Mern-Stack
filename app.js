import express from "express";
import dotenv from "dotenv";
import RouteSetup from "./lib/RouteSetup.js";
import MongooseSetup from "./lib/MongooseSetup.js";
import session from "express-session";
import PassportSetup from "./lib/PassportSetup.js";

dotenv.config();

MongooseSetup();

const app = express();

app.use(session({
  secret: process.env.SECRET_KEY,
  resave:false,
  saveUninitialized: false,
  cookie: {
    httpOnly: {
      secure: (process.env.NODE_ENV === "production"),
      samesite: (process.env.NODE_ENV === "production" ? "strict" : "lax")
    }
  }
}));

PassportSetup(app);

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

RouteSetup(app);

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
