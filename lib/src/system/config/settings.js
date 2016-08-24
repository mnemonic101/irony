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
var factory_1 = require("../core/factory");
var typedjson_1 = require("typedjson");
var Settings = (function () {
    function Settings() {
        this.defaultProtocol = "http";
        this.defaultHostname = "127.0.0.1";
        this.defaultPort = 80;
        this.defaultRoot = "/";
        this.defaultBasePath = "/lib/src";
    }
    Object.defineProperty(Settings.prototype, "protocol", {
        get: function () {
            return this._protocol || this.defaultProtocol;
        },
        set: function (v) {
            this._protocol = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "hostname", {
        get: function () {
            return this._hostname || this.defaultHostname;
        },
        set: function (v) {
            this._hostname = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "port", {
        get: function () {
            return this._port || this.defaultPort;
        },
        set: function (v) {
            this._port = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "root", {
        get: function () {
            return this._root || this.defaultRoot;
        },
        set: function (v) {
            this._root = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "basePath", {
        get: function () {
            return this._basePath || this.defaultBasePath;
        },
        set: function (v) {
            this._basePath = v;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Settings.prototype, "protocol", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Settings.prototype, "hostname", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Number)
    ], Settings.prototype, "port", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Settings.prototype, "root", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Settings.prototype, "basePath", null);
    Settings = __decorate([
        typedjson_1.JsonObject,
        factory_1.Singleton,
        factory_1.Provided(new factory_1.ConfigurationProvider(Settings)), 
        __metadata('design:paramtypes', [])
    ], Settings);
    return Settings;
}());
exports.Settings = Settings;

//# sourceMappingURL=../../../../maps/src/system/config/settings.js.map
