import {Container} from "../core/factory";
import {FileSystemHelper} from "../core/helper";

import {RouteRegistrar} from "../router/registrar";

import {ILogger, IFramework} from "../core/interfaces";
import {Context} from "../core/context";
import {Configuration} from "../config/configuration";

import * as fs from "fs";

export abstract class WebServer {

  private static _instance: WebServer;
  public static start() {
    if (WebServer._instance == null) {
      WebServer._instance = Container.get(WebServer);
    }
  }

  private _context: Context;
  public get context(): Context {
    return this._context;
  }

  private config: Configuration;

  private tasks: any[] = [];

  constructor() {
    this.execute();
  }

  public execute() {

    this.initializeConfiguration();

    this.initializeAdapters();
    this.initializeControllers();
    this.initializeTasks();

    this.initializeContext();
    this.initializeRoutes();

    this.executeTasks();

    this.startWebServer();
  }

  private initializeConfiguration(): void {
    this.config = Container.get(Configuration);
  }

  private initializeAdapters(): void {

    this.registerAdapter(IFramework, "framework");
    this.registerAdapter(ILogger, "logger");
  }

  private registerAdapter(typeOfAdapter: Function, name?: string): void {

    let modulePath = this.resolveModulePath("/adapter", name);
    let module: any = require(modulePath);
    Container.bind(typeOfAdapter).to(module.Adapter);
  }

  private initializeControllers(): void {

    let pathToControllers: string = "/controller";
    this.resolveModules(pathToControllers);
  }

  private resolveModules(pathFragment: string): any[] {
    let modules: any[] = [];

    let fullModulePath: string = this.resolveModulePath(pathFragment, "");

    if (FileSystemHelper.isFolder(fullModulePath)) {

      let filenamesInFolder: Array<string> = fs.readdirSync(fullModulePath);
      for (let filename of filenamesInFolder) {
        if (filename.match(/[^\.]*\.js$/i)) {
          let fullFilePath: string = this.resolveModulePath(fullModulePath, filename);
          console.log(fullFilePath);

          let module = require(fullFilePath);
          console.log(module);

          modules.push(module);
        }
      }
    } else {
      throw new Error("Modules could not be resolved by path. Path does not exists [" + pathFragment + "].");
    }

    return modules;
  }

  private resolveModulePath(path: string, filename: string): string {

    // TODO: Improve the resolution of dynamic module binding!
    // TODO: Create a strategy to search folders!

    if (path.indexOf(this.config.settings.basePath) === -1) {
      let foldersToSearch: Array<string> = [];

      foldersToSearch.push(this.config.appBasePath + "/" + path);
      foldersToSearch.push(this.config.appBasePath + "/system/" + path);
      foldersToSearch.push(this.config.coreBasePath + "/" + path);
      foldersToSearch.push(this.config.coreBasePath + "/system/" + path);

      let newPath = "";
      while (!FileSystemHelper.fileOrFolderExists(newPath) && path !== newPath) {

        newPath = foldersToSearch.pop();
        if (FileSystemHelper.fileOrFolderExists(newPath + "/" + filename)) {
          path = newPath;
        }
      }
      if (path !== newPath) {
        throw new Error("Path could not be determined. Path [" + path + "], File [" + filename + "].");
      }
    }

    let absoluteFilePath: string = path + "/" + filename;
    return fs.realpathSync(absoluteFilePath);
  }

  private initializeTasks(): void {

    let pathToInitializers: string = "/initializers";
    this.tasks = this.resolveModules(pathToInitializers);
  }

  private initializeContext(): void {
    this._context = Container.get(Context);
  }

  private initializeRoutes(): void {
    let registrar: RouteRegistrar = Container.get(RouteRegistrar);
    registrar.registerRoutes();
  }

  private executeTasks(): void {
    this.tasks.forEach(task => {
      let that = this;
      task.Initializer.prototype.execute((error: any, data: any) => {
        that.onTaskExecuted(error, data);
      });
    });
  }

  private onTaskExecuted(error: any, data: any): void {
    if (error) {
      this.context.logger.log("Task failed", error);
      throw error;
    } else {
      // HACK!!!
      this.context.dataProvider = data;
      this.context.logger.log("Task executed", data);
    }
  }

  public onBeforeServerStart(): void {
    // Eventhandler for custom code!
  };

  public onAfterServerStart(): void {
    // Eventhandler for custom code!
  };

  private startWebServer() {
    this.onBeforeServerStart();

    this.context.framework.startWebServer(
      this.context.settings.port,
      this.context.settings.hostname,
      () => { this.onServerStarted(); });
  }

  private onServerStarted() {
    let url = this.context.settings.protocol
      + "://" + this.context.settings.hostname
      + ":" + this.context.settings.port
      + this.context.settings.root;

    this.context.logger.log("Web Server is running at", url);

    this.onAfterServerStart();
  }

}
