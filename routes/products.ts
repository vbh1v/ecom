import { createProduct, deleteProduct, getProductById, listProduct, updateProduct } from "@/backend/controllers/products";
import { errorHandler } from "@/backend/error-handler";
import adminMiddleware from "@/backend/middlewares/admin";
import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const productRoutes: Router = Router()



productRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct))
productRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct))
productRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct))
productRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listProduct))
productRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById))

export default productRoutes