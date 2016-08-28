"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var factory_1 = require("../core/factory");
var metadata_1 = require("../router/metadata");
var handler_1 = require("../router/handler");
var interfaces_1 = require("../core/interfaces");
var RouteRegistrar = (function () {
    function RouteRegistrar(router) {
        this.routeAreas = new Array();
        this.pathsResolved = false;
        this.router = router;
    }
    RouteRegistrar.prototype.addRouteArea = function (target) {
        this.pathsResolved = false;
        var name = target.name || target.constructor.name;
        if (!this.routeAreas.hasOwnProperty(name)) {
            this.routeAreas[name] = new metadata_1.RouteArea(target);
        }
        var routeArea = this.routeAreas[name];
        return routeArea;
    };
    RouteRegistrar.prototype.addRouteHandler = function (target, methodName) {
        if (methodName) {
            this.pathsResolved = false;
            var routeArea = this.addRouteArea(target);
            if (!routeArea.handlers.hasOwnProperty(methodName)) {
                routeArea.handlers[methodName] = new handler_1.RouteHandler(routeArea);
            }
            var routeHandler = routeArea.handlers[methodName];
            return routeHandler;
        }
        return null;
    };
    RouteRegistrar.prototype.registerRoutes = function () {
        for (var controller in this.routeAreas) {
            if (this.routeAreas.hasOwnProperty(controller)) {
                var routeArea = this.routeAreas[controller];
                for (var method in routeArea.handlers) {
                    if (routeArea.handlers.hasOwnProperty(method)) {
                        var routeHandler = routeArea.handlers[method];
                        this.buildRoute(routeArea, routeHandler);
                    }
                }
            }
        }
        this.pathsResolved = true;
    };
    RouteRegistrar.prototype.buildRoute = function (routeArea, routeHandler) {
        var handlerCallback = function (req, res, next) {
            var rh = routeHandler;
            rh.execute(req, res, next);
        };
        if (!routeHandler.resolvedPath) {
            this.resolveProperties(routeArea, routeHandler);
        }
        this.router.register(routeHandler.httpVerb, routeHandler.resolvedPath, handlerCallback);
    };
    RouteRegistrar.prototype.resolveProperties = function (routeArea, routeHandler) {
        this.resolvePath(routeArea, routeHandler);
    };
    RouteRegistrar.prototype.resolvePath = function (routeArea, routeHandler) {
        var classPath = routeArea.path ? routeArea.path.trim() : "";
        var resolvedPath = "";
        if (routeHandler.path) {
            var methodPath = routeHandler.path.trim();
            resolvedPath = classPath + (methodPath);
        }
        var declaredHttpMethods = [];
        declaredHttpMethods[routeHandler.httpVerb];
        routeHandler.resolvedPath = resolvedPath;
    };
    RouteRegistrar = __decorate([
        factory_1.AutoWired,
        factory_1.Singleton,
        __param(0, factory_1.Inject), 
        __metadata('design:paramtypes', [interfaces_1.IRouter])
    ], RouteRegistrar);
    return RouteRegistrar;
}());
exports.RouteRegistrar = RouteRegistrar;

//# sourceMappingURL=../../../../maps/src/system/router/registrar.js.map
