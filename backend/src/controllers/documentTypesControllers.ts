import conMysql from "../ultis/connectDB";
import { documentTypes } from "../db/schema";
import { sql } from "drizzle-orm";

const db = await conMysql();

export const getAllDocumentTypes = async (c: any) => {
    try {
        const result = await db.select(
            {
                id: documentTypes.id,
                name: documentTypes.name,
            }
        ).from(documentTypes);
        return c.json({ message: "success", data: result });
    } catch (error) {
        return c.json({ error: "Error" }, 500);
    }
}

export const getDocumentTypesById = async (c: any) => {
    try {
        const document_type_id = c.req.query("document_type_id");
        
        if (!document_type_id) {
            return c.json({ error: "document_type_id is required" }, 400);
        }
        const result = await db.select(
            {
                id: documentTypes.id,
                name: documentTypes.name,
            }
        ).from(documentTypes).where(sql`id = ${document_type_id}`);
        return c.json({ message: "success", data: result });
    } catch (error) {
        return c.json({ error: "Error" }, 500);
    }
}