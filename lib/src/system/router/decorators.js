"use strict";
var factory_1 = require("../core/factory");
var registrar_1 = require("../router/registrar");
var enums_1 = require("../router/enums");
function Route(path) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length === 1) {
            return RouteTypeDecorator.apply(this, [args[0], path]);
        }
        else if (args.length === 3 && typeof args[2] === "object") {
            return RouteMethodDecorator.apply(this, [args[0], args[1], args[2], path]);
        }
        throw new Error("Invalid @Route Decorator declaration.");
    };
}
exports.Route = Route;
function RouteTypeDecorator(target, path) {
    var registrar = factory_1.Container.get(registrar_1.RouteRegistrar);
    var routeArea = registrar.addRouteArea(target);
    routeArea.path = path;
}
function RouteMethodDecorator(target, propertyKey, descriptor, path) {
    var registrar = factory_1.Container.get(registrar_1.RouteRegistrar);
    var routeHandler = registrar.addRouteHandler(target, propertyKey);
    if (routeHandler) {
        routeHandler.path = path;
        routeHandler.httpVerb = enums_1.HttpVerb.GET;
        routeHandler.name = propertyKey;
    }
}

//# sourceMappingURL=../../../../maps/src/system/router/decorators.js.map
