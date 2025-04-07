import { Hono } from "hono";
import { addDocument, getDocumentById, getAllDocument } from "../controllers/documentControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const documentsRoute = new Hono();

documentsRoute.post("/add", addDocument);
documentsRoute.get("/", getDocumentById);
documentsRoute.get("/all",authMiddleware, getAllDocument);

export default documentsRoute;
