"use strict";
var fs = require("fs");
var path = require("path");
var merge = require('merge2');
var gulp = require("gulp"),
  runSequence = require("run-sequence"),
  del = require("del"),
  jasmine = require("gulp-jasmine"),
  tslint = require("gulp-tslint"),
  ts = require("gulp-typescript"),
  sourcemaps = require("gulp-sourcemaps");

gulp.task("lint", function () {
  return gulp.src([
    "**",
    "!**/*.d.ts",
    "!**/typings/**"
  ])
    .pipe(tslint({}))
    .pipe(tslint.report("verbose"));
});

var sourceMapsConfig = {
  includeContent: false,
  mapSources: function (sourcePath) {
    // HACK: The sourcemaps do not reference source files correctly!
    // The recieved sourcePath always starts with '../../source/lib/',
    // resulting from the current folder structure!
    // This indeed is not feasable for files nested on different levels.
    // Therefor we need to count the folder depth of the current file.
    // This is done by counting the overall slashes within the path.
    // To get the additional ones, we need to subtract the initial path count.
    // For this project setting it is the magic number of 4. Please adjust 
    // this to your project needs. 
    var initialPathCount = 4;
    var depthCount = (sourcePath.match(/\//g) || []).length;
    var pathUps = "../".repeat(Math.max(depthCount, initialPathCount) - initialPathCount); 
    return pathUps + sourcePath;
  }
};

var tsProject = ts.createProject("tsconfig.json");

function build(sourcePath, base, targetPath) {
  var tsResult = gulp.src(sourcePath, { base: base })
    .pipe(sourcemaps.init())
    .pipe(tsProject(ts.reporter.longReporter()));

  return merge([
    tsResult.dts
      .pipe(gulp.dest("build/")),
    tsResult.js
      .pipe(sourcemaps.write(".", sourceMapsConfig))
      .pipe(gulp.dest("build/"))
  ]);
}

gulp.task("build-spec", function () {
  return build(["source/**/*.ts", "typings/**.d.ts", "!./node_modules/**"], "./source", "");
});
gulp.task("build-lib", function () {
  return build(["source/lib/**/*.ts", "typings/**.d.ts", "!./node_modules/**"], "./source", "lib");
});

gulp.task("build-package.json", function () {
  var appPackageJson = JSON.parse(fs.readFileSync(__dirname + "/package.json", "utf8"));
  var npmPackageJson = {
    "name": appPackageJson.name,
    "description": appPackageJson.description,
    "version": appPackageJson.version,
    "author": appPackageJson.author,
    "repository": appPackageJson.repository,
    "main": "system/index.js",      // TODO: generate this from app package.json
    "typings": "system/index.d.ts", // TODO: generate this from app package.json
    "dependencies": appPackageJson.dependencies,
    "keywords": appPackageJson.keywords,
    "license": appPackageJson.license,
    "bugs": appPackageJson.bugs
  }
  fs.mkdirSync(path.join(__dirname, "build"));
  fs.mkdirSync(path.join(__dirname, "build", "lib"));
  fs.writeFileSync(path.join(__dirname, "build", "lib", "package.json"), JSON.stringify(npmPackageJson, null, 2));
});

gulp.task("copy", function () {
  return gulp.src([
    "README.md",
    "LICENSE"
  ])
    .pipe(gulp.dest("build/lib"));
});

gulp.task("build", function (cb) {
  return runSequence(
    "clean-all",
    ["build-lib", "copy", "build-package.json"],
    cb
  );
});

gulp.task("clean-all", function () {
  return del(["./build"]);
});

gulp.task("specs");
