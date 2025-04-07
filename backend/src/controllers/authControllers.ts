import conMysql from "../ultis/connectDB";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";

const googleUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  picture: z.string().optional(),
  googleId: z.string(),
});

const facebookUserSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  picture: z.string().optional(),
  facebookId: z.string(),
});

const db = await conMysql();

export const googleLoginHandler = async (c: any) => {
  const { credential, userData } = await c.req.json();

  const parsed = googleUserSchema.safeParse(userData);
  if (!parsed.success) return c.json({ error: "Invalid user data" }, 400);

  let user = (
    await db
      .select()
      .from(users)
      .where(eq(users.google_id, userData.googleId))
      .limit(1)
  )[0];

  if (!user) {
    const inserted = await db
      .insert(users)
      .values({
        name: userData.name,
        email: userData.email,
        picture: userData.picture ?? "",
        google_id: userData.googleId,
      })
      .$returningId();

    user = (
      await db
        .select()
        .from(users)
        .where(eq(users.id, inserted[0].id))
        .limit(1)
    )[0];
  }

  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return c.json({ token, user });
};

export const facebookLoginHandler = async (c: any) => {
  try {
    const { accessToken, userData } = await c.req.json();

    const parsed = facebookUserSchema.safeParse(userData);
    if (!parsed.success) return c.json({ error: "Invalid user data" }, 400);

    let user = (
      await db
        .select()
        .from(users)
        .where(eq(users.facebook_id, userData.facebookId))
        .limit(1)
    )[0];

    if (!user) {
      const inserted = await db
        .insert(users)
        .values({
          name: userData.name,
          email: userData.email ?? "",
          picture: userData.picture ?? "",
          facebook_id: userData.facebookId,
        })
        .$returningId();

      user = (
        await db
          .select()
          .from(users)
          .where(eq(users.id, inserted[0].id))
          .limit(1)
      )[0];
    }

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return c.json({ token, user });
  } catch (error) {
    console.error("Facebook login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};