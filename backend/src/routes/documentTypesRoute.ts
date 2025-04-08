import { Hono } from "hono";
import { getAllDocumentTypes, getDocumentTypesById } from "../controllers/documentTypesControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const documentTypesRoute = new Hono();

documentTypesRoute.get("/all",authMiddleware, getAllDocumentTypes);
documentTypesRoute.get("/",authMiddleware, getDocumentTypesById);

export default documentTypesRoute;