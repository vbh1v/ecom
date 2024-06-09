"use strict";
exports.__esModule = true;
exports.SignupSchema = void 0;
var zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
