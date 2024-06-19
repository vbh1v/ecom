"use strict";
exports.__esModule = true;
exports.UpdateUserSchema = exports.AddressSchema = exports.SignupSchema = void 0;
var zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.AddressSchema = zod_1.z.object({
    lineOne: zod_1.z.string(),
    lineTwo: zod_1.z.string().nullable(),
    country: zod_1.z.string(),
    pincode: zod_1.z.string().length(6),
    city: zod_1.z.string()
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    defaultShippingAddress: zod_1.z.number().optional(),
    defaultBillingAddress: zod_1.z.number().optional()
});
