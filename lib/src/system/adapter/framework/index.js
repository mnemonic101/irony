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
var factory_1 = require("../../core/factory");
var router_1 = require("./router");
var Adapter = (function () {
    function Adapter(router) {
        this.router = router;
    }
    Adapter.prototype.startWebServer = function (port, hostname, callback) {
        return this.router.router.listen(port, hostname, callback);
    };
    Adapter = __decorate([
        factory_1.AutoWired,
        __param(0, factory_1.Inject), 
        __metadata('design:paramtypes', [router_1.RouterAdapter])
    ], Adapter);
    return Adapter;
}());
exports.Adapter = Adapter;

//# sourceMappingURL=../../../../../maps/src/system/adapter/framework/index.js.map
