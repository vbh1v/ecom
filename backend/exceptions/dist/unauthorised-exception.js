"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.UnauthorisedException = void 0;
var root_1 = require("./root");
var UnauthorisedException = /** @class */ (function (_super) {
    __extends(UnauthorisedException, _super);
    function UnauthorisedException(message, errorCode, errors) {
        return _super.call(this, message, errorCode, 401, errors) || this;
    }
    return UnauthorisedException;
}(root_1.HttpException));
exports.UnauthorisedException = UnauthorisedException;
