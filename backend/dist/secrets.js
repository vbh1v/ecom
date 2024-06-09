"use strict";
exports.__esModule = true;
exports.JWT_SECRET = exports.PORT = void 0;
var dotenv_1 = require("dotenv");
dotenv_1["default"].config({ path: ".env" });
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
