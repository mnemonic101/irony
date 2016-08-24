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
var interfaces_1 = require("../core/interfaces");
var settings_1 = require("../config/settings");
var Context = (function () {
    function Context(framework, logger, settings) {
        this.routings = {};
        this._framework = framework;
        this._logger = logger;
        this._settings = settings;
    }
    Object.defineProperty(Context.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "framework", {
        get: function () {
            return this._framework;
        },
        enumerable: true,
        configurable: true
    });
    Context = __decorate([
        factory_1.AutoWired,
        factory_1.Singleton,
        __param(0, factory_1.Inject),
        __param(1, factory_1.Inject),
        __param(2, factory_1.Inject), 
        __metadata('design:paramtypes', [interfaces_1.IFramework, interfaces_1.ILogger, settings_1.Settings])
    ], Context);
    return Context;
}());
exports.Context = Context;

//# sourceMappingURL=../../../../maps/src/system/core/context.js.map
