import {
  mysqlTable,
  serial,
  varchar,
  timestamp,
  json,
  int,
  bigint,
} from "drizzle-orm/mysql-core";


export const documentTypes = mysqlTable("document_types", {
  id: serial("id").primaryKey(),  // Primary Key เป็น auto increment
  name: varchar("name", { length: 255 }).notNull().unique(), // ชื่อประเภทเอกสาร
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const documents = mysqlTable("documents", {
  id: serial("id").primaryKey(),  // Primary Key เป็น auto increment
  document_type_id: bigint("document_type_id",{ mode: "number", unsigned: true })
    .notNull()
    .references(() => documentTypes.id), // Foreign Key ไปที่ `document_types.id`
  data: json("data").notNull(), // ข้อมูล JSON
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(), // Primary Key เป็น auto increment
  name: varchar("name", { length: 255 }).notNull(), // ชื่อผู้ใช้
  email: varchar("email", { length: 255 }).notNull().unique(), // อีเมล (ต้องไม่ซ้ำ)
  picture: varchar("picture", { length: 512 }), // URL รูปโปรไฟล์
  google_id: varchar("google_id", { length: 255 }), // Google ID (ถ้ามี)
  facebook_id: varchar("facebook_id", { length: 255 }), // Facebook ID (ถ้ามี)
  created_at: timestamp("created_at").defaultNow().notNull(), // วันที่สร้าง
});