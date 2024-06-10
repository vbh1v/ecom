import { createProduct } from "@/backend/controllers/products";
import { errorHandler } from "@/backend/error-handler";
import adminMiddleware from "@/backend/middlewares/admin";
import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const productRoutes: Router = Router()



productRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct))

export default productRoutes