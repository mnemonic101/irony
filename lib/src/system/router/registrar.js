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
var enums_1 = require("../router/enums");
var router_1 = require("../router");
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
            this.routeAreas[name] = new router_1.RouteArea(target);
        }
        var routeArea = this.routeAreas[name];
        return routeArea;
    };
    RouteRegistrar.prototype.addRouteHandler = function (target, methodName) {
        if (methodName) {
            this.pathsResolved = false;
            var routeArea = this.addRouteArea(target);
            if (!routeArea.handlers.hasOwnProperty(methodName)) {
                routeArea.handlers[methodName] = new router_1.RouteHandler();
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
        var _this = this;
        var handlerCallback = function (req, res, next) {
            _this.callRouteHandler(routeArea, routeHandler, req, res, next);
        };
        if (!routeHandler.resolvedPath) {
            this.resolveProperties(routeArea, routeHandler);
        }
        this.router.register(routeHandler.httpVerb, routeHandler.resolvedPath, handlerCallback);
    };
    RouteRegistrar.prototype.callRouteHandler = function (routeArea, routeHandler, req, res, next) {
        var context = new router_1.RequestContext();
        context.request = req;
        context.response = res;
        context.next = next;
        var serviceObject = this.createRouteHandler(routeArea, context);
        var args = [];
        var result = routeArea.targetClass.constructor.prototype[routeHandler.name].apply(serviceObject, args);
        this.processResponseHeaders(routeHandler, context);
        this.sendValue(result, res, next);
    };
    RouteRegistrar.prototype.sendValue = function (value, res, next) {
        switch (typeof value) {
            case "number":
                res.send(value.toString());
                break;
            case "string":
                res.send(value);
                break;
            case "boolean":
                res.send(value.toString());
                break;
            case "undefined":
                if (!res.headersSent) {
                    res.sendStatus(204);
                }
                break;
            default:
                if (value.location && value instanceof router_1.ReferencedResource) {
                    res.set("Location", value.location);
                    res.sendStatus(value.statusCode);
                }
                else {
                    res.json(value);
                }
        }
    };
    RouteRegistrar.prototype.processResponseHeaders = function (routeHandler, context) {
        if (routeHandler.resolvedLanguages) {
            if (routeHandler.httpVerb === enums_1.HttpVerb.GET) {
                context.response.vary("Accept-Language");
            }
            context.response.set("Content-Language", context.language);
        }
        if (routeHandler.resolvedAccepts) {
            context.response.vary("Accept");
        }
    };
    RouteRegistrar.prototype.createRouteHandler = function (routeArea, context) {
        var routeHandler = Object.create(routeArea.targetClass);
        var result = routeArea.targetClass.constructor.apply(routeHandler, [context.request, context.response, context.next]);
        if (routeArea.hasProperties()) {
            routeArea.properties.forEach(function (paramType, key) {
                switch (paramType) {
                    case enums_1.ParamType.context:
                        routeHandler[key] = context;
                        break;
                    case enums_1.ParamType.context_accept_language:
                        routeHandler[key] = context.language;
                        break;
                    case enums_1.ParamType.context_accept:
                        routeHandler[key] = context.preferredMedia;
                        break;
                    case enums_1.ParamType.context_request:
                        routeHandler[key] = context.request;
                        break;
                    case enums_1.ParamType.context_response:
                        routeHandler[key] = context.response;
                        break;
                    case enums_1.ParamType.context_next:
                        routeHandler[key] = context.next;
                        break;
                    default:
                        break;
                }
            });
        }
        return routeHandler;
    };
    RouteRegistrar.prototype.resolveProperties = function (routeArea, routeHandler) {
        this.resolvePath(routeArea, routeHandler);
    };
    RouteRegistrar.prototype.resolvePath = function (routeArea, routeHandler) {
        var classPath = routeArea.path ? routeArea.path.trim() : "";
        var resolvedPath = '';
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
