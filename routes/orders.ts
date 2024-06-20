import { createOrder } from "@/backend/controllers/orders";
import { errorHandler } from "@/backend/error-handler";
import adminMiddleware from "@/backend/middlewares/admin";
import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const orderRoutes: Router = Router()



orderRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createOrder))
// orderRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct))
// orderRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct))
// orderRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listProduct))
// orderRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById))

export default orderRoutes