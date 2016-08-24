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
var helper_1 = require("../core/helper");
var package_1 = require("../config/package");
var settings_1 = require("../config/settings");
var Configuration = (function () {
    function Configuration(pconfig, sconfig) {
        this._package = pconfig;
        this._settings = sconfig;
        this.checkBasePath();
    }
    Object.defineProperty(Configuration.prototype, "package", {
        get: function () {
            return this._package;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "appBasePath", {
        get: function () {
            return this._appBasePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "coreBasePath", {
        get: function () {
            return this._coreBasePath;
        },
        enumerable: true,
        configurable: true
    });
    Configuration.prototype.checkBasePath = function () {
        this._coreBasePath = helper_1.FileSystemHelper.locateFolderOf(this.settings.basePath, false);
        this._appBasePath = this.package.srcFolder + this.settings.basePath;
    };
    Configuration = __decorate([
        factory_1.AutoWired,
        factory_1.Singleton,
        __param(0, factory_1.Inject),
        __param(1, factory_1.Inject), 
        __metadata('design:paramtypes', [package_1.Package, settings_1.Settings])
    ], Configuration);
    return Configuration;
}());
exports.Configuration = Configuration;

//# sourceMappingURL=../../../../maps/src/system/config/configuration.js.map
