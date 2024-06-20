"use strict";
exports.__esModule = true;
var orders_1 = require("@/backend/controllers/orders");
var error_handler_1 = require("@/backend/error-handler");
var admin_1 = require("@/backend/middlewares/admin");
var auth_1 = require("@/backend/middlewares/auth");
var express_1 = require("express");
var orderRoutes = express_1.Router();
orderRoutes.post('/', [auth_1["default"], admin_1["default"]], error_handler_1.errorHandler(orders_1.createOrder));
// orderRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct))
// orderRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct))
// orderRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listProduct))
// orderRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById))
exports["default"] = orderRoutes;
