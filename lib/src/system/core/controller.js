"use strict";
var Controller = (function () {
    function Controller(request, response, next) {
        this._request = request;
        this._response = response;
        this._next = next;
    }
    Object.defineProperty(Controller.prototype, "request", {
        get: function () {
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "response", {
        get: function () {
            return this._response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "next", {
        get: function () {
            return this._next;
        },
        enumerable: true,
        configurable: true
    });
    return Controller;
}());
exports.Controller = Controller;

//# sourceMappingURL=../../../../maps/src/system/core/controller.js.map
