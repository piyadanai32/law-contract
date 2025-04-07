import { Hono } from "hono";
import { googleLoginHandler, facebookLoginHandler } from "../controllers/authControllers";

const authRoute = new Hono();

authRoute.post('/google', googleLoginHandler);
authRoute.post('/facebook', facebookLoginHandler);

export default authRoute;