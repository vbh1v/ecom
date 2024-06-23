"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getOrderById = exports.cancelOrder = exports.listOrder = exports.createOrder = void 0;
var server_1 = require("../server");
var not_found_1 = require("../exceptions/not-found");
var root_1 = require("../exceptions/root");
exports.createOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server_1.prismaClient.$transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                    var cartItems, price, address, order, orderEvent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tx.cartItem.findMany({
                                    where: {
                                        userId: req.user.id
                                    },
                                    include: {
                                        product: true
                                    }
                                })];
                            case 1:
                                cartItems = _a.sent();
                                if (cartItems.length == 0) {
                                    return [2 /*return*/, res.json({ message: "cart is empty" })];
                                }
                                price = cartItems.reduce(function (prev, current) {
                                    return prev + current.quantity * +current.product.price;
                                }, 0);
                                return [4 /*yield*/, tx.address.findFirst({
                                        where: {
                                            id: req.user.defaultShippingAddress
                                        }
                                    })];
                            case 2:
                                address = _a.sent();
                                return [4 /*yield*/, tx.order.create({
                                        data: {
                                            userId: req.user.id,
                                            netAmount: price,
                                            address: address.formattedAddress,
                                            products: {
                                                create: cartItems.map(function (cart) {
                                                    return {
                                                        productId: cart.productId,
                                                        quantity: cart.quantity
                                                    };
                                                })
                                            }
                                        }
                                    })];
                            case 3:
                                order = _a.sent();
                                return [4 /*yield*/, tx.orderEvent.create({
                                        data: {
                                            orderId: order.id
                                        }
                                    })];
                            case 4:
                                orderEvent = _a.sent();
                                return [4 /*yield*/, tx.cartItem.deleteMany({
                                        where: {
                                            userId: req.user.id
                                        }
                                    })];
                            case 5:
                                _a.sent();
                                return [2 /*return*/, res.json(order)];
                        }
                    });
                }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.listOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server_1.prismaClient.order.findMany({
                    where: {
                        userId: req.user.id
                    }
                })];
            case 1:
                order = _a.sent();
                res.json(order);
                return [2 /*return*/];
        }
    });
}); };
exports.cancelOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, server_1.prismaClient.order.update({
                        where: {
                            id: +req.params.id
                        },
                        data: {
                            status: "CANCELLED"
                        }
                    })];
            case 1:
                order = _a.sent();
                return [4 /*yield*/, server_1.prismaClient.orderEvent.create({
                        data: {
                            orderId: order.id,
                            status: "CANCELLED"
                        }
                    })];
            case 2:
                _a.sent();
                res.json(order);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                throw new not_found_1.NotFoundException('Order not found!', root_1.ErrorCode.ORDER_NOT_FOUND);
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getOrderById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, server_1.prismaClient.order.findFirstOrThrow({
                        where: {
                            id: +req.params.id
                        },
                        include: {
                            products: true,
                            events: true
                        }
                    })];
            case 1:
                order = _a.sent();
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                throw new not_found_1.NotFoundException("Order not found!", root_1.ErrorCode.ORDER_NOT_FOUND);
            case 3: return [2 /*return*/];
        }
    });
}); };
