"use strict";
var factory_1 = require("../core/factory");
var registrar_1 = require("../router/registrar");
var interfaces_1 = require("../core/interfaces");
var context_1 = require("../core/context");
var configuration_1 = require("../config/configuration");
var fs = require("fs");
var Bootstrapper = (function () {
    function Bootstrapper() {
    }
    Object.defineProperty(Bootstrapper.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Bootstrapper.prototype.initialize = function () {
        this.initializeConfiguration();
        this.registerAdapters();
        this.registerControllers();
        this.initializeContext();
        this.initializeRoutes();
        this.execute();
    };
    Bootstrapper.prototype.initializeConfiguration = function () {
        this.config = factory_1.Container.get(configuration_1.Configuration);
    };
    Bootstrapper.prototype.registerAdapters = function () {
        this.registerAdapter(interfaces_1.IFramework, "framework");
        this.registerAdapter(interfaces_1.ILogger, "logger");
    };
    Bootstrapper.prototype.registerAdapter = function (typeOfAdapter, name) {
        var modulePath = this.resolveAbsolutePath("../adapter", name);
        var module = require(modulePath);
        factory_1.Container.bind(typeOfAdapter).to(module.Adapter);
    };
    Bootstrapper.prototype.registerControllers = function () {
        var pathToControllers = "../../controller";
        this.resolveModules(pathToControllers);
    };
    Bootstrapper.prototype.resolveModules = function (pathFragment) {
        var fullModulePath = this.resolveAbsolutePath(pathFragment, "");
        var fileStatus = fs.statSync(fullModulePath);
        if (fileStatus.isDirectory()) {
            var filenamesInFolder = fs.readdirSync(fullModulePath);
            for (var _i = 0, filenamesInFolder_1 = filenamesInFolder; _i < filenamesInFolder_1.length; _i++) {
                var filename = filenamesInFolder_1[_i];
                var fullFilePath = this.resolveAbsolutePath(fullModulePath, filename);
                console.log(fullFilePath);
                var module_1 = require(fullFilePath);
                console.log(module_1);
            }
        }
        else {
            throw new Error("Modules could not be resolved by path. Path does not exists [" + pathFragment + "].");
        }
    };
    Bootstrapper.prototype.resolveAbsolutePath = function (path, filename) {
        if (path.indexOf(this.config.settings.basePath) === -1) {
            path = __dirname + "/" + path;
        }
        var tempPath = path + "/" + filename;
        var absoluteFilePath = fs.realpathSync(tempPath);
        return absoluteFilePath;
    };
    Bootstrapper.prototype.initializeContext = function () {
        this._context = factory_1.Container.get(context_1.Context);
    };
    Bootstrapper.prototype.initializeRoutes = function () {
        var registrar = factory_1.Container.get(registrar_1.RouteRegistrar);
        registrar.registerRoutes();
    };
    return Bootstrapper;
}());
exports.Bootstrapper = Bootstrapper;

//# sourceMappingURL=../../../../maps/src/system/core/bootstrapper.js.map
