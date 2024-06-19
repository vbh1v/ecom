"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.updateUser = exports.listAddress = exports.deleteAddress = exports.addAddress = void 0;
var users_1 = require("../schema/users");
var server_1 = require("../server");
var not_found_1 = require("../exceptions/not-found");
var root_1 = require("../exceptions/root");
var bad_requests_1 = require("../exceptions/bad-requests");
exports.addAddress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                users_1.AddressSchema.parse(req.body);
                return [4 /*yield*/, server_1.prismaClient.address.create({
                        data: __assign(__assign({}, req.body), { userId: req.user.id })
                    })];
            case 1:
                address = _a.sent();
                res.json(address);
                return [2 /*return*/];
        }
    });
}); };
exports.deleteAddress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, server_1.prismaClient.address["delete"]({
                        where: {
                            id: +req.params.id
                        }
                    })];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.listAddress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var addresses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server_1.prismaClient.address.findMany({
                    where: {
                        userId: req.user.id
                    }
                })];
            case 1:
                addresses = _a.sent();
                res.json(addresses);
                return [2 /*return*/];
        }
    });
}); };
//------------------------------------/-------------------/------------------------------------------
exports.updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, shippingAddress, billingAddress, err_2, err_3, updatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validatedData = users_1.UpdateUserSchema.parse(req.body);
                if (!validatedData.defaultShippingAddress) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, server_1.prismaClient.address.findFirstOrThrow({
                        where: {
                            id: validatedData.defaultShippingAddress
                        }
                    })];
            case 2:
                shippingAddress = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
            case 4:
                if (shippingAddress.userId != req.user.id) {
                    throw new bad_requests_1.BadRequestsException("Address does not belong to user!", root_1.ErrorCode.ADDRESS_DOES_NOT_MATCH);
                }
                _a.label = 5;
            case 5:
                if (!validatedData.defaultBillingAddress) return [3 /*break*/, 10];
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, server_1.prismaClient.address.findFirstOrThrow({
                        where: {
                            id: validatedData.defaultBillingAddress
                        }
                    })];
            case 7:
                billingAddress = _a.sent();
                return [3 /*break*/, 9];
            case 8:
                err_3 = _a.sent();
                throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
            case 9:
                if (billingAddress.userId != req.user.id) {
                    throw new bad_requests_1.BadRequestsException("Address does not belong to user!", root_1.ErrorCode.ADDRESS_DOES_NOT_MATCH);
                }
                _a.label = 10;
            case 10: return [4 /*yield*/, server_1.prismaClient.user.update({
                    where: {
                        id: req.user.id
                    },
                    data: validatedData
                })];
            case 11:
                updatedUser = _a.sent();
                res.json(updatedUser);
                return [2 /*return*/];
        }
    });
}); };
