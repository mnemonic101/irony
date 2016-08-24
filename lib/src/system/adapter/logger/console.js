"use strict";
var Adapter = (function () {
    function Adapter() {
    }
    Adapter.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        console.log(message, optionalParams);
    };
    return Adapter;
}());
exports.Adapter = Adapter;

//# sourceMappingURL=../../../../../maps/src/system/adapter/logger/console.js.map
