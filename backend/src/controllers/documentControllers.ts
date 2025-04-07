import conMysql from "../ultis/connectDB";
import { documents } from "../db/schema";
import { sql } from "drizzle-orm";

const db = await conMysql();

// add document
export const addDocument = async (c: any) => {
    try{
        const { document_type_id, data } = await c.req.json();
        
        if (!document_type_id || !data) {
            return c.json({ error: "document_type_id and data are required" }, 400);
        }
        const result = await db.insert(documents).values({  
            document_type_id,
            data,   
        }).$returningId();
        return c.json({message: "success", data: result});
    } catch (error) {
        return c.json({error: "Error"}, 500);
    } 
};

// get document by id
export const getDocumentById = async (c: any) => {
    try{
        const document_id = c.req.query("document_id");
        
        if (!document_id) {
            return c.json({ error: "document_id is required" }, 400);
        }
        const result = await db.select().from(documents).where(sql`id = ${document_id}`);
        return c.json({message: "success", data: result});
    } catch (error) {
        return c.json({error: "Error"}, 500);
    } 
};

// get all document
export const getAllDocument = async (c: any) => {
    try{
        const result = await db.select().from(documents);
        return c.json({message: "success", data: result});
    } catch (error) {
        return c.json({error: "Error"}, 500);
    } 
};