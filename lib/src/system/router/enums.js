"use strict";
(function (HttpVerb) {
    HttpVerb[HttpVerb["GET"] = 1] = "GET";
    HttpVerb[HttpVerb["POST"] = 2] = "POST";
    HttpVerb[HttpVerb["PUT"] = 3] = "PUT";
    HttpVerb[HttpVerb["DELETE"] = 4] = "DELETE";
    HttpVerb[HttpVerb["OPTIONS"] = 5] = "OPTIONS";
    HttpVerb[HttpVerb["PATCH"] = 6] = "PATCH";
    HttpVerb[HttpVerb["HEAD"] = 7] = "HEAD";
})(exports.HttpVerb || (exports.HttpVerb = {}));
var HttpVerb = exports.HttpVerb;
(function (ParamType) {
    ParamType[ParamType["path"] = 1] = "path";
    ParamType[ParamType["query"] = 2] = "query";
    ParamType[ParamType["header"] = 3] = "header";
    ParamType[ParamType["cookie"] = 4] = "cookie";
    ParamType[ParamType["form"] = 5] = "form";
    ParamType[ParamType["body"] = 6] = "body";
    ParamType[ParamType["file"] = 7] = "file";
    ParamType[ParamType["files"] = 8] = "files";
    ParamType[ParamType["context"] = 9] = "context";
    ParamType[ParamType["context_request"] = 10] = "context_request";
    ParamType[ParamType["context_response"] = 11] = "context_response";
    ParamType[ParamType["context_next"] = 12] = "context_next";
    ParamType[ParamType["context_accept"] = 13] = "context_accept";
    ParamType[ParamType["context_accept_language"] = 14] = "context_accept_language";
})(exports.ParamType || (exports.ParamType = {}));
var ParamType = exports.ParamType;

//# sourceMappingURL=../../../../maps/src/system/router/enums.js.map
