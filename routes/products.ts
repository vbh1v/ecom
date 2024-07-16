import {
  createProduct,
  deleteProduct,
  getProductByCategory,
  getProductById,
  getProductBySlug,
  listProduct,
  updateProduct,
} from "@/backend/controllers/products";
import { errorHandler } from "@/backend/error-handler";
import adminMiddleware from "@/backend/middlewares/admin";
import authMiddleware from "@/backend/middlewares/auth";
import { Router } from "express";

const productRoutes: Router = Router();

productRoutes.get(
  "/:id",
  [authMiddleware],
  errorHandler(getProductById)
);

productRoutes.get(
  "/",
  errorHandler(getProductBySlug)
);

productRoutes.get(
  "/",
  [authMiddleware],
  errorHandler(getProductByCategory)
);

productRoutes.get(
  "/",
  [authMiddleware],
  errorHandler(listProduct)
);

productRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

productRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);

productRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);

export default productRoutes;
