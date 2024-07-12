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
    "/",
    [authMiddleware, adminMiddleware],
    errorHandler(getProductByCategory)
  );
productRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductBySlug)
);
productRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(listProduct)
);

productRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
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
