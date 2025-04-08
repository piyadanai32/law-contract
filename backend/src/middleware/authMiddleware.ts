import jwt from "jsonwebtoken";

export const authMiddleware = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // เก็บข้อมูลผู้ใช้ใน context
    c.set("user", decoded);
    
    await next();
  } catch (error) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
};