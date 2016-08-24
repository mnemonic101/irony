"use strict";
var factory_1 = require("../factory");
var helper_1 = require("../../core/helper");
var typedjson_1 = require("typedjson");
function ProvidedByJson() {
    return function (target) {
        return factory_1.Provided(new ConfigurationProvider(target));
    };
}
exports.ProvidedByJson = ProvidedByJson;
var ConfigurationProvider = (function () {
    function ConfigurationProvider(type) {
        this.type = type;
    }
    ConfigurationProvider.prototype.get = function () {
        var name = this.type.name.toLowerCase() + ".json";
        var configJson = helper_1.FileSystemHelper.locateAndReadFile(name);
        var config = typedjson_1.TypedJSON.parse(configJson.toString(), this.type);
        config["_srcFile"] = helper_1.FileSystemHelper.locateFolderOf(name) + "/" + name;
        return config;
    };
    return ConfigurationProvider;
}());
exports.ConfigurationProvider = ConfigurationProvider;

//# sourceMappingURL=../../../../../maps/src/system/core/factory/provider.js.map
