import {
  cancelOrder,
  createOrder,
  getOrderById,
  listOrders,
} from "@/backend/controllers/orders";
import {
  changeStatus,
  listAllOrders,
  listUserOrders,
} from "@/backend/controllers/orders";
import { errorHandler } from "@/backend/error-handler";
import adminMiddleware from "@/backend/middlewares/admin";
import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const orderRoutes: Router = Router();

orderRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createOrder)
);
orderRoutes.put(
  "/:id/cancel",
  [authMiddleware, adminMiddleware],
  errorHandler(cancelOrder)
);
orderRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(listOrders)
);
orderRoutes.get(
  "/index",
  [authMiddleware, adminMiddleware],
  errorHandler(listAllOrders)
);
orderRoutes.get(
  "/users/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(listUserOrders)
);
orderRoutes.put(
  "/:id/status",
  [authMiddleware, adminMiddleware],
  errorHandler(changeStatus)
);
orderRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getOrderById)
);

export default orderRoutes;
