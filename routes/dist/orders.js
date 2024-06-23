"use strict";
exports.__esModule = true;
var orders_1 = require("@/backend/controllers/orders");
var error_handler_1 = require("@/backend/error-handler");
var admin_1 = require("@/backend/middlewares/admin");
var auth_1 = require("@/backend/middlewares/auth");
var express_1 = require("express");
var orderRoutes = express_1.Router();
orderRoutes.post('/', [auth_1["default"], admin_1["default"]], error_handler_1.errorHandler(orders_1.createOrder));
orderRoutes.put('/:id/cancel', [auth_1["default"], admin_1["default"]], error_handler_1.errorHandler(orders_1.cancelOrder));
orderRoutes.get('/', [auth_1["default"], admin_1["default"]], error_handler_1.errorHandler(orders_1.listOrder));
orderRoutes.get('/:id', [auth_1["default"], admin_1["default"]], error_handler_1.errorHandler(orders_1.getOrderById));
exports["default"] = orderRoutes;
