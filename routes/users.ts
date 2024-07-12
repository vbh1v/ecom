import { Router } from "express";
import { errorHandler } from "@/backend/error-handler";
import authMiddleware from "@/backend/middlewares/auth";
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getUserById,
  listAddress,
  listUsers,
  updateUser,
} from "@/backend/controllers/users";
import adminMiddleware from "@/backend/middlewares/admin";

const usersRoutes: Router = Router();

usersRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
usersRoutes.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);
usersRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
usersRoutes.get("/address", [authMiddleware], errorHandler(listAddress));

usersRoutes.put("/", [authMiddleware], errorHandler(updateUser));
usersRoutes.put("/:id/role", [authMiddleware, adminMiddleware], errorHandler(changeUserRole));
usersRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers));
usersRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getUserById));

export default usersRoutes;
