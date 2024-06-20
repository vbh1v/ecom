"use strict";
exports.__esModule = true;
exports.prismaClient = void 0;
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var secrets_1 = require("./secrets");
var routes_1 = require("@/routes");
var client_1 = require("@prisma/client");
var errors_1 = require("./middlewares/errors");
dotenv_1["default"].config({ path: ".env" });
var app = express_1["default"]();
console.log(secrets_1.PORT);
app.use(express_1["default"].json());
app.use('/api', routes_1["default"]);
exports.prismaClient = new client_1.PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: function (addr) {
                    return addr.lineOne + ", " + addr.lineTwo + ", " + addr.city + ", " + addr.country + "-" + addr.pincode;
                }
            }
        }
    }
});
app.use(errors_1.errorMiddleware);
app.listen(secrets_1.PORT, function () {
    console.log("[server]: Server is running at http://localhost:" + secrets_1.PORT);
});
