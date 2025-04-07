import { Hono } from "hono";
import { getAllDocumentTypes, getDocumentTypesById } from "../controllers/documentTypesControllers";

const documentTypesRoute = new Hono();

documentTypesRoute.get("/all", getAllDocumentTypes);
documentTypesRoute.get("/", getDocumentTypesById);

export default documentTypesRoute;