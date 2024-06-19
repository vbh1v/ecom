import {
  addItemToCart,
  changeQuantity,
  deleteItemFromCart,
  getCart,
} from "@/backend/controllers/cart";
import { errorHandler } from "@/backend/error-handler";

import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const cartRoutes: Router = Router();

cartRoutes.post("/", [authMiddleware], errorHandler(addItemToCart));
cartRoutes.get("/", [authMiddleware], errorHandler(getCart));
cartRoutes.delete("/:id", [authMiddleware], errorHandler(deleteItemFromCart));
cartRoutes.put("/:id", [authMiddleware], errorHandler(changeQuantity));

export default cartRoutes;
