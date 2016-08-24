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
var factory_1 = require("../../core/factory");
var interfaces_1 = require("../../core/interfaces");
var enums_1 = require("../../router/enums");
var express = require("express");
var RouterAdapter = (function () {
    function RouterAdapter() {
        console.log("RouteAdapter constructed...");
        this.router = express();
    }
    RouterAdapter.prototype.addRequestHandler = function (name, handler) {
        this.router.use(name, handler);
    };
    RouterAdapter.prototype.startWebServer = function (port, hostname, callback) {
        return this.router.listen(port, hostname, callback);
    };
    RouterAdapter.prototype.register = function (httpVerb, path, handler) {
        var args = [];
        args.push(path);
        args.push(handler);
        switch (httpVerb) {
            case enums_1.HttpVerb.GET:
                this.router.get.apply(this.router, args);
                break;
            case enums_1.HttpVerb.POST:
                this.router.post.apply(this.router, args);
                break;
            case enums_1.HttpVerb.PUT:
                this.router.put.apply(this.router, args);
                break;
            case enums_1.HttpVerb.DELETE:
                this.router.delete.apply(this.router, args);
                break;
            case enums_1.HttpVerb.HEAD:
                this.router.head.apply(this.router, args);
                break;
            case enums_1.HttpVerb.OPTIONS:
                this.router.options.apply(this.router, args);
                break;
            case enums_1.HttpVerb.PATCH:
                this.router.patch.apply(this.router, args);
                break;
            default:
                throw Error("Invalid http method registration. Http verb [" + httpVerb + "], Handler [" + path + "]");
        }
    };
    RouterAdapter = __decorate([
        factory_1.AutoWired,
        factory_1.Singleton,
        factory_1.Provides(interfaces_1.IRouter), 
        __metadata('design:paramtypes', [])
    ], RouterAdapter);
    return RouterAdapter;
}());
exports.RouterAdapter = RouterAdapter;

//# sourceMappingURL=../../../../../maps/src/system/adapter/framework/router.js.map
