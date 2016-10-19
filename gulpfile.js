"use strict";
var fs = require("fs");
var path = require("path");
var gulp = require("gulp"),
  runSequence = require("run-sequence"),
  del = require("del"),
  jasmine = require("gulp-jasmine"),
  tslint = require("gulp-tslint"),
  typescript = require("gulp-typescript"),
  sourcemaps = require("gulp-sourcemaps");

gulp.task("lint", function () {
  return gulp.src([
    "src/**/**.ts",
    "spec/**.ts",
    "typings/**.d.ts",
    "!lib/**",
    "!maps/**"
  ])
    .pipe(tslint({}))
    .pipe(tslint.report("verbose"));
});

var tsProjectForJs = typescript.createProject("tsconfig.json");
var tsProjectForDts = typescript.createProject("tsconfig.json");
gulp.task("build-js", function () {
  return gulp.src([
    "./**/**.ts",
    "!./spec/**",
    "!./lib/**",
    "!./node_modules/**"
  ])
    .pipe(sourcemaps.init())
    .pipe(tsProjectForJs(typescript.reporter.longReporter()))
    .js
    .pipe(sourcemaps.write("maps", {
      includeContent: false,
      sourceRoot: function (file) {
        // needed to fix relative path in sourceMaps
        var path = "../".repeat((file.relative.match(/\//g) || []).length + 1);
        return path;
      }
    }))
    .pipe(gulp.dest("lib"));
})
gulp.task("build-dts", function () {
  return gulp.src([
    "./**/**.ts",
    "!./spec/**",
    "!./lib/**",
    "!./node_modules/**"
  ])
    .pipe(tsProjectForDts())
    .dts
    .pipe(gulp.dest("lib"));
})
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
  fs.mkdirSync(path.join(__dirname, "lib"));
  fs.mkdirSync(path.join(__dirname, "lib", "src"));
  fs.writeFileSync(path.join(__dirname, "lib", "src", "package.json"), JSON.stringify(npmPackageJson, null, 2));
});

gulp.task("copy", function () {
  return gulp.src([
    "README.md",
    "LICENSE"
  ])
    .pipe(gulp.dest("lib/src"));
});

gulp.task("build", function (cb) {
  return runSequence(
    "clean-all",
    ["build-js", "build-dts", "copy", "build-package.json"],
    cb
  );
});

gulp.task("build-spec", function (cb) {
  return gulp.src([
    "./**/**.ts",
    "!./src/**",
    "!./lib/**",
    "!./node_modules/**"
  ])
    .pipe(sourcemaps.init())
    .pipe(tsProjectForJs())
    .js
    .pipe(sourcemaps.write("../maps", {
      includeContent: false,
      sourceRoot: function (file) {
        // needed to fix relative path in sourceMaps
        var path = "../".repeat((file.relative.match(/\//g) || []).length + 1);
        return path;
      }
    }))
    .pipe(gulp.dest("lib"));
});

gulp.task("clean-all", function () {
  return del(["./maps", "./lib"]);
});

gulp.task("specs");

gulp.task("server", function () {
  require("./lib/src/server");
});
