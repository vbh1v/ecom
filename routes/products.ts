import { createProduct } from "@/backend/controllers/products";
import { errorHandler } from "@/backend/error-handler";
import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const productRoutes: Router = Router()



productRoutes.post('/', [authMiddleware], errorHandler(createProduct))

export default productRoutes