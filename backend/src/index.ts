import { Hono } from "hono";

import documentsRoute from "./routes/documentRoute";
import documentTypesRoute from "./routes/documentTypesRoute";
import authRoute from "./routes/authRoute";
import {authMiddleware}  from "./middleware/authMiddleware";

import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Use user routes
app.get("/", (c) => c.json({ msg: "Hello Hono!" }));
app.route("/document", documentsRoute);
app.route("/documenttype", documentTypesRoute);
app.route("/auth", authRoute);


export default {
  host: "0.0.0.0",
  port: 8000,
  fetch: app.fetch,
};
