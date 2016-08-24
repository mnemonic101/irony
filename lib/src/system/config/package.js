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
var Package = (function () {
    function Package() {
    }
    Object.defineProperty(Package.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "version", {
        get: function () {
            return this._version;
        },
        set: function (v) {
            this._version = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (v) {
            this._description = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "homepage", {
        get: function () {
            return this._homepage;
        },
        set: function (v) {
            this._homepage = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "bugs", {
        get: function () {
            return this._bugs;
        },
        set: function (v) {
            this._bugs = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "license", {
        get: function () {
            return this._license;
        },
        set: function (v) {
            this._license = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "author", {
        get: function () {
            return this._author;
        },
        set: function (v) {
            this._author = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "main", {
        get: function () {
            return this._main;
        },
        set: function (v) {
            this._main = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "directories", {
        get: function () {
            return this._directories;
        },
        set: function (v) {
            this._directories = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "repository", {
        get: function () {
            return this._repository;
        },
        set: function (v) {
            this._repository = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "scripts", {
        get: function () {
            return this._scripts;
        },
        set: function (v) {
            this._scripts = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (v) {
            this._config = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "dependencies", {
        get: function () {
            return this._dependencies;
        },
        set: function (v) {
            this._dependencies = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "devDependencies", {
        get: function () {
            return this._devDependencies;
        },
        set: function (v) {
            this._devDependencies = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "peerDependencies", {
        get: function () {
            return this._peerDependencies;
        },
        set: function (v) {
            this._peerDependencies = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "bundledDependencies", {
        get: function () {
            return this._bundledDependencies;
        },
        set: function (v) {
            this._bundledDependencies = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "optionalDependencies", {
        get: function () {
            return this._optionalDependencies;
        },
        set: function (v) {
            this._optionalDependencies = v;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Package.prototype, "name", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Package.prototype, "version", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Package.prototype, "description", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Package.prototype, "homepage", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "bugs", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Package.prototype, "license", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "author", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', String)
    ], Package.prototype, "main", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "directories", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "repository", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "scripts", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "config", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "dependencies", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "devDependencies", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "peerDependencies", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "bundledDependencies", null);
    __decorate([
        typedjson_1.JsonMember, 
        __metadata('design:type', Object)
    ], Package.prototype, "optionalDependencies", null);
    Package = __decorate([
        typedjson_1.JsonObject,
        factory_1.Singleton,
        factory_1.Provided(new factory_1.ConfigurationProvider(Package)), 
        __metadata('design:paramtypes', [])
    ], Package);
    return Package;
}());
exports.Package = Package;

//# sourceMappingURL=../../../../maps/src/system/config/package.js.map
