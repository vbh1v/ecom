"use strict";
exports.__esModule = true;
var express_1 = require("express");
var auth_1 = require("./auth");
var products_1 = require("./products");
var rootRouter = express_1.Router();
rootRouter.use('/auth', auth_1["default"]);
rootRouter.use('/products', products_1["default"]);
exports["default"] = rootRouter;
