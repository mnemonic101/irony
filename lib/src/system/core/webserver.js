"use strict";
var factory_1 = require("../core/factory");
var helper_1 = require("../core/helper");
var registrar_1 = require("../router/registrar");
var interfaces_1 = require("../core/interfaces");
var context_1 = require("../core/context");
var configuration_1 = require("../config/configuration");
var fs = require("fs");
var WebServer = (function () {
    function WebServer() {
    }
    Object.defineProperty(WebServer.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    WebServer.prototype.initialize = function () {
        this.initializeConfiguration();
        this.registerAdapters();
        this.registerControllers();
        this.initializeContext();
        this.initializeRoutes();
        this.execute();
    };
    WebServer.prototype.initializeConfiguration = function () {
        this.config = factory_1.Container.get(configuration_1.Configuration);
    };
    WebServer.prototype.registerAdapters = function () {
        this.registerAdapter(interfaces_1.IFramework, "framework");
        this.registerAdapter(interfaces_1.ILogger, "logger");
    };
    WebServer.prototype.registerAdapter = function (typeOfAdapter, name) {
        var modulePath = this.resolveAbsolutePath("/adapter", name);
        var module = require(modulePath);
        factory_1.Container.bind(typeOfAdapter).to(module.Adapter);
    };
    WebServer.prototype.registerControllers = function () {
        var pathToControllers = "/controller";
        this.resolveModules(pathToControllers);
    };
    WebServer.prototype.resolveModules = function (pathFragment) {
        var fullModulePath = this.resolveAbsolutePath(pathFragment, "");
        if (helper_1.FileSystemHelper.isFolder(fullModulePath)) {
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
    WebServer.prototype.resolveAbsolutePath = function (path, filename) {
        if (path.indexOf(this.config.settings.basePath) === -1) {
            var newPath = this.config.appBasePath + "/" + path;
            if (!helper_1.FileSystemHelper.fileOrFolderExists(newPath)) {
                newPath = this.config.appBasePath + "/system/" + path;
                if (!helper_1.FileSystemHelper.fileOrFolderExists(newPath)) {
                    newPath = this.config.coreBasePath + "/" + path;
                    if (!helper_1.FileSystemHelper.fileOrFolderExists(newPath)) {
                        newPath = this.config.coreBasePath + "/system/" + path;
                        if (!helper_1.FileSystemHelper.fileOrFolderExists(newPath)) {
                            throw new Error("Path could not be determined. Path [" + path + "], File [" + filename + "].");
                        }
                    }
                }
            }
            path = newPath;
        }
        var absoluteFilePath = fs.realpathSync(path + "/" + filename);
        return absoluteFilePath;
    };
    WebServer.prototype.initializeContext = function () {
        this._context = factory_1.Container.get(context_1.Context);
    };
    WebServer.prototype.initializeRoutes = function () {
        var registrar = factory_1.Container.get(registrar_1.RouteRegistrar);
        registrar.registerRoutes();
    };
    return WebServer;
}());
exports.WebServer = WebServer;

//# sourceMappingURL=../../../../maps/src/system/core/webserver.js.map
