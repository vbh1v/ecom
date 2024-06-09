"use strict";
exports.__esModule = true;
exports.errorMiddleware = void 0;
exports.errorMiddleware = function (error, req, res, next) {
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
        errors: error.errors
    });
};
