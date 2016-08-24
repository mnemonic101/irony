"use strict";
var fs = require("fs");
var path = require("path");
var FileSystemHelper = (function () {
    function FileSystemHelper() {
    }
    FileSystemHelper.locateFolderOf = function (pathSegemnt, relocate, startpath, searchUp) {
        if (relocate === void 0) { relocate = true; }
        if (startpath === void 0) { startpath = ""; }
        if (searchUp === void 0) { searchUp = true; }
        if (!searchUp) {
            throw new Error("Traversing down the path to locate a file is not supported yet!");
        }
        startpath = path.posix.resolve(startpath || __dirname);
        if (startpath.indexOf("/") === 0) {
            startpath = startpath.substr(1);
        }
        var pathSegments = startpath.split("/");
        if (relocate) {
            var index = pathSegments.indexOf("node_modules");
            if (index > 0) {
                pathSegments.splice(index, 2);
            }
        }
        var resolvedPath = "";
        while (resolvedPath === "" && pathSegments.length > 0) {
            var tmp = path.posix.resolve("/", pathSegments.join("/") + "/" + pathSegemnt);
            if (FileSystemHelper.fileOrFolderExists(tmp)) {
                resolvedPath = (FileSystemHelper.isFolder(tmp)) ? tmp : path.posix.parse(tmp).dir;
            }
            else {
                pathSegments.pop();
            }
        }
        if (resolvedPath === "") {
            throw new Error("Could not locate any file traversing up the path. File [" + pathSegemnt + "] Path [" + startpath + "]");
        }
        return resolvedPath;
    };
    FileSystemHelper.locateAndReadFile = function (filename, relocate, startpath, searchUp) {
        var libRoot = FileSystemHelper.locateFolderOf(filename, relocate, startpath, searchUp);
        var buffer = fs.readFileSync(libRoot + "/" + filename);
        return buffer;
    };
    FileSystemHelper.fileOrFolderExists = function (fileOrFolderName) {
        try {
            fs.statSync(fileOrFolderName);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    FileSystemHelper.isFolder = function (path) {
        try {
            var fileStatus = fs.statSync(path);
            return fileStatus.isDirectory();
        }
        catch (error) {
            return false;
        }
    };
    return FileSystemHelper;
}());
exports.FileSystemHelper = FileSystemHelper;

//# sourceMappingURL=../../../../maps/src/system/core/helper.js.map
