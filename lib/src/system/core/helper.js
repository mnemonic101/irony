"use strict";
var fs = require("fs");
var path = require("path");
var FileSystemHelper = (function () {
    function FileSystemHelper() {
    }
    FileSystemHelper.locateFolderOf = function (filename, startpath, searchUp) {
        searchUp = searchUp || true;
        if (!searchUp) {
            throw new Error("Traversing down the path to locate a file is not supported yet!");
        }
        startpath = path.posix.resolve(startpath || __dirname);
        if (startpath.indexOf("/") === 0) {
            startpath = startpath.substr(1);
        }
        var pathsegments = startpath.split("/");
        var resolvedPath = "";
        while (resolvedPath === "" && pathsegments.length > 0) {
            var tmp = path.posix.resolve("/", pathsegments.join("/"), filename);
            try {
                fs.readFileSync(tmp);
                resolvedPath = tmp;
            }
            catch (error) {
                pathsegments.pop();
            }
        }
        if (resolvedPath === "") {
            throw new Error("Could not locate any file traversing up the path. File [" + filename + "] Path [" + startpath + "]");
        }
        return path.posix.parse(resolvedPath).dir;
    };
    FileSystemHelper.locateAndReadFile = function (filename, startpath, searchUp) {
        var libRoot = FileSystemHelper.locateFolderOf(filename, startpath, searchUp);
        var buffer = fs.readFileSync(libRoot + "/" + filename);
        return buffer;
    };
    return FileSystemHelper;
}());
exports.FileSystemHelper = FileSystemHelper;

//# sourceMappingURL=../../../../maps/src/system/core/helper.js.map
