import { cancelOrder, createOrder, getOrderById, listOrder } from "@/backend/controllers/orders";
import { errorHandler } from "@/backend/error-handler";
import adminMiddleware from "@/backend/middlewares/admin";
import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const orderRoutes: Router = Router()



orderRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createOrder))
orderRoutes.put('/:id/cancel', [authMiddleware, adminMiddleware], errorHandler(cancelOrder))
orderRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listOrder))
orderRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getOrderById))

export default orderRoutes