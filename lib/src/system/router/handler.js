"use strict";
var enums_1 = require("../router/enums");
var metadata_1 = require("../router/metadata");
var RouteHandler = (function () {
    function RouteHandler(routeArea) {
        this.parameters = new Array();
        this.mustParseCookies = false;
        this.files = new Array();
        this.mustParseBody = false;
        this.mustParseForms = false;
        this.routeArea = routeArea;
    }
    RouteHandler.prototype.execute = function (req, res, next) {
        var context = new metadata_1.RequestContext();
        context.request = req;
        context.response = res;
        context.next = next;
        this.context = context;
        this.handler = this.createRouteHandler(this.routeArea, context);
        var args = [];
        var result = this.routeArea.targetClass.constructor.prototype[this.name].apply(this.handler, args);
        this.processResponseHeaders(this, this.context);
        this.sendValue(result, this.context.response, this.context.next);
    };
    RouteHandler.prototype.sendValue = function (value, res, next) {
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
                if (value.location && value instanceof metadata_1.ReferencedResource) {
                    res.set("Location", value.location);
                    res.sendStatus(value.statusCode);
                }
                else {
                    res.json(value);
                }
        }
    };
    RouteHandler.prototype.processResponseHeaders = function (routeHandler, context) {
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
    RouteHandler.prototype.createRouteHandler = function (routeArea, context) {
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
    return RouteHandler;
}());
exports.RouteHandler = RouteHandler;

//# sourceMappingURL=../../../../maps/src/system/router/handler.js.map
