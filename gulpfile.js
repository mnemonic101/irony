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

var tsProjectForJs = ts.createProject("tsconfig.json");
var tsProjectForDts = ts.createProject("tsconfig.json");
gulp.task("build-js", function () {
  var tsResult = gulp.src([
    "source/lib/**/*.ts",
    "typings/**.d.ts",
    "!./spec/**",
    "!./lib/**",
    "!./node_modules/**"
  ])
    .pipe(sourcemaps.init())
    .pipe(tsProjectForJs(ts.reporter.longReporter()));

  return merge([
    tsResult.dts
      .pipe(gulp.dest("build/typings")),
    tsResult.js
      .pipe(sourcemaps.write("../maps", {
        includeContent: false
      }))
      .pipe(gulp.dest("build/lib"))
  ]);
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
    "typings": "../typings/system/index.d.ts", // TODO: generate this from app package.json
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
    ["build-js", "copy", "build-package.json"],
    cb
  );
});

gulp.task("clean-all", function () {
  return del(["./build"]);
});

gulp.task("specs");

gulp.task("server", function () {
  require("./build/lib/server");
});
