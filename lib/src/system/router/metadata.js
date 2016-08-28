"use strict";
var RouteArea = (function () {
    function RouteArea(targetClass) {
        this.targetClass = targetClass;
        this.handlers = new Array();
    }
    RouteArea.prototype.addProperty = function (key, paramType) {
        if (!this.hasProperties()) {
            this.properties = new Array();
        }
        this.properties[key] = paramType;
    };
    RouteArea.prototype.hasProperties = function () {
        return (this.properties && this.properties.length > 0);
    };
    return RouteArea;
}());
exports.RouteArea = RouteArea;
var FileParam = (function () {
    function FileParam(name, singleFile) {
        this.name = name;
        this.singleFile = singleFile;
    }
    return FileParam;
}());
exports.FileParam = FileParam;
var MethodParam = (function () {
    function MethodParam(name, type, paramType) {
        this.name = name;
        this.type = type;
        this.paramType = paramType;
    }
    return MethodParam;
}());
exports.MethodParam = MethodParam;
var RequestContext = (function () {
    function RequestContext() {
    }
    return RequestContext;
}());
exports.RequestContext = RequestContext;
var ReferencedResource = (function () {
    function ReferencedResource(location, statusCode) {
        this.location = location;
        this.statusCode = statusCode;
    }
    return ReferencedResource;
}());
exports.ReferencedResource = ReferencedResource;

//# sourceMappingURL=../../../../maps/src/system/router/metadata.js.map
