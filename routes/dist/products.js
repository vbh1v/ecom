"use strict";
exports.__esModule = true;
var products_1 = require("@/backend/controllers/products");
var error_handler_1 = require("@/backend/error-handler");
var auth_1 = require("@/backend/middlewares/auth");
var express_1 = require("express");
var productRoutes = express_1.Router();
productRoutes.post('/', [auth_1["default"]], error_handler_1.errorHandler(products_1.createProduct));
exports["default"] = productRoutes;
