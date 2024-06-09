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
exports.UnprocessableEntity = void 0;
var root_1 = require("./root");
var UnprocessableEntity = /** @class */ (function (_super) {
    __extends(UnprocessableEntity, _super);
    function UnprocessableEntity(error, message, errorCode) {
        return _super.call(this, message, errorCode, 422, error) || this;
    }
    return UnprocessableEntity;
}(root_1.HttpException));
exports.UnprocessableEntity = UnprocessableEntity;
