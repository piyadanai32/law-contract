import { Context } from "hono";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

export const authMiddleware = async (c: Context, next: Function) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const payload = jwt.verify(token, jwtSecret) as any;
    if (!payload) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", payload);
    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ error: "Unauthorized" }, 401);
  }
};