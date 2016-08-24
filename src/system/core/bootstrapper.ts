import {Container} from "../core/factory";
import {FileSystemHelper} from "../core/helper";

import {RouteRegistrar} from "../router/registrar";

import {ILogger, IFramework} from "../core/interfaces";
import {Context} from "../core/context";
import {Configuration} from "../config/configuration";

import * as fs from "fs";

export abstract class Bootstrapper {

  private _context: Context;
  public get context(): Context {
    return this._context;
  }

  private config: Configuration;

  public abstract execute(): void;

  public initialize() {

    this.initializeConfiguration();

    this.registerAdapters();
    this.registerControllers();

    this.initializeContext();

    this.initializeRoutes();

    this.execute();
  }

  private initializeConfiguration(): void {
    this.config = Container.get(Configuration);
  }

  private registerAdapters(): void {

    this.registerAdapter(IFramework, "framework");
    this.registerAdapter(ILogger, "logger");
  }

  private registerAdapter(typeOfAdapter: Function, name?: string): void {

    let modulePath = this.resolveAbsolutePath("/adapter", name);
    let module: any = require(modulePath);
    Container.bind(typeOfAdapter).to(module.Adapter);
  }

  private registerControllers(): void {

    let pathToControllers: string = "/controller";
    this.resolveModules(pathToControllers);
  }

  private resolveModules(pathFragment: string): void {

    let fullModulePath: string = this.resolveAbsolutePath(pathFragment, "");

    if (FileSystemHelper.isFolder(fullModulePath)) {

      let filenamesInFolder: Array<string> = fs.readdirSync(fullModulePath);
      for (let filename of filenamesInFolder) {
        let fullFilePath: string = this.resolveAbsolutePath(fullModulePath, filename);
        console.log(fullFilePath);

        let module = require(fullFilePath);
        console.log(module);
      }
    } else {
      throw new Error("Modules could not be resolved by path. Path does not exists [" + pathFragment + "].");
    }
  }

  private resolveAbsolutePath(path: string, filename: string): string {

    // TODO: Improve the resolution of dynamic module binding!
    // TODO: Create a strategy to search folders!
    if (path.indexOf(this.config.settings.basePath) === -1) {
      let newPath = this.config.appBasePath + "/" + path;

      if (!FileSystemHelper.fileOrFolderExists(newPath)) {
        newPath = this.config.appBasePath + "/system/" + path;

        if (!FileSystemHelper.fileOrFolderExists(newPath)) {
          newPath = this.config.coreBasePath + "/" + path;

          if (!FileSystemHelper.fileOrFolderExists(newPath)) {
            newPath = this.config.coreBasePath + "/system/" + path;

            if (!FileSystemHelper.fileOrFolderExists(newPath)) {
              throw new Error("Path could not be determined. Path [" + path + "], File [" + filename + "].");
            }
          }
        }
      }
      path = newPath;
    }

    let absoluteFilePath: string = fs.realpathSync(path + "/" + filename);
    return absoluteFilePath;
  }

  private initializeContext(): void {
    this._context = Container.get(Context);
  }

  private initializeRoutes(): void {
    let registrar: RouteRegistrar = Container.get(RouteRegistrar);
    registrar.registerRoutes();
  }
}
