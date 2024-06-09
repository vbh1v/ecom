import { login, me, signup } from "@/backend/controllers/auth";
import { errorHandler } from "@/backend/error-handler";
import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const authRoutes: Router = Router();

authRoutes.post("/signup", errorHandler(signup));
authRoutes.post("/login", errorHandler(login));
authRoutes.get("/me", [authMiddleware], errorHandler(me));

export default authRoutes;
