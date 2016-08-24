"use strict";
var ControllerBase = (function () {
    function ControllerBase(request, response, next) {
        this._request = request;
        this._response = response;
        this._next = next;
    }
    Object.defineProperty(ControllerBase.prototype, "request", {
        get: function () {
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControllerBase.prototype, "response", {
        get: function () {
            return this._response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControllerBase.prototype, "next", {
        get: function () {
            return this._next;
        },
        enumerable: true,
        configurable: true
    });
    return ControllerBase;
}());
exports.ControllerBase = ControllerBase;

//# sourceMappingURL=../../../../maps/src/system/core/base.js.map
