import {Container} from "../core/factory";
import {FileSystemHelper} from "../core/helper";
import {Promise} from "../core";

import {RouteRegistrar} from "../router/registrar";

import {ILogger, IFramework, IDataAdapter, ITask} from "../core/interfaces";
import {Context} from "../core/context";
import {Configuration} from "../config/configuration";

import * as fs from "fs";
import * as path from "path";

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

    this.initializeAdapter();
    this.initializeController();
    this.initializeRequestHandler();
    this.initializeTasks();

    this.initializeContext();
    this.initializeRoutes();

    this.executeTasks()
      .then(() => { this.startWebServer(); });
  }

  private initializeConfiguration(): void {
    this.config = Container.get(Configuration);
  }

  private initializeAdapter(): void {

    this.registerAdapter(IFramework, "framework");
    this.registerAdapter(ILogger, "logger");
    this.registerAdapter(IDataAdapter, "data");
  }

  private registerAdapter(typeOfAdapter: Function, name?: string): void {

    let modulePath = this.resolveModulePath("/adapter", name);
    let module: any = require(modulePath[0]);
    Container.bind(typeOfAdapter).to(module.Adapter);
  }

  private initializeController(): void {

    let pathToControllers: string = "/controller";
    this.resolveModules(pathToControllers);
  }

  private initializeRequestHandler(): void {

    let pathToControllers: string = "/handler";
    this.resolveModules(pathToControllers);
  }

  private resolveModules(pathFragment: string): any[] {
    let modules: any[] = [];

    let fullModulePaths: string[] = this.resolveModulePath(pathFragment, "");
    fullModulePaths.forEach(fullModulePath => {
      if (FileSystemHelper.isFolder(fullModulePath)) {

        let filenamesInFolder: Array<string> = fs.readdirSync(fullModulePath);
        filenamesInFolder.forEach(filename => {

          if (filename.match(/[^\.]*\.js$/i)) {

            let fullFilePath: string = path.posix.resolve(fullModulePath, filename);
            // this.resolveModulePath(fullModulePath, filename);

            console.log(fullFilePath);

            let module = require(fullFilePath);
            console.log(module);

            modules.push(module);
          }
        });
      } else {
        throw new Error("Modules could not be resolved by path. Path does not exists [" + pathFragment + "].");
      }
    });

    return modules;
  }

  private resolveModulePath(path: string, filename: string): string[] {

    let paths: string[] = [];

    // TODO: Improve the resolution of dynamic module binding!
    // TODO: Create a strategy to search folders!

    let filePath = (filename !== "") ? "/" + filename : "";
    if (path.indexOf(this.config.settings.basePath) === -1) {
      let foldersToSearch: Array<string> = [];

      foldersToSearch.push(this.config.coreBasePath + "/system/" + path);
      foldersToSearch.push(this.config.coreBasePath + "/" + path);
      foldersToSearch.push(this.config.appBasePath + "/system/" + path);
      foldersToSearch.push(this.config.appBasePath + "/" + path);

      let newPath = "";
      while (foldersToSearch.length !== 0/*!FileSystemHelper.fileOrFolderExists(newPath + filePath) && path !== newPath*/) {

        newPath = foldersToSearch.pop();
        if (FileSystemHelper.fileOrFolderExists(newPath + filePath)) {
          path = newPath;

          let absoluteFilePath: string = path + filePath;
          paths.push(fs.realpathSync(absoluteFilePath));
        }
      }
      if (paths.length === 0/*path !== newPath*/) {
        throw new Error("Path could not be determined. Path [" + path + "], File [" + filename + "].");
      }
    }

    return paths;
  }

  private initializeTasks(): void {

    let pathToInitializers: string = "/initializers";
    this.resolveModules(pathToInitializers).forEach(module => {
      for (let key in module) {
        if (module.hasOwnProperty(key)) {
          this.tasks.push({ name: key, instance: module[key] });
        }
      }
    });
  }

  private initializeContext(): void {
    this._context = Container.get(Context);
  }

  private initializeRoutes(): void {
    let registrar: RouteRegistrar = Container.get(RouteRegistrar);
    registrar.registerRoutes();
  }

  private executeTasks(): Promise<any> {
    let promises: any[] = [];

    this.tasks.forEach(task => {
      let promise = (<ITask>Container.get(task.instance)).execute();
      promise
        .then((data: any) => { this.onTaskSuccess({ name: task.name, data: data }); })
        .catch((error: any) => { this.onTaskError({ name: task.name, error: error }); });

      promises.push(promise);
    });

    return Promise.all(promises);
  }

  private onTaskSuccess(task: any): void {
    this.context.logger.log("Task executed", task.name);
  }
  private onTaskError(task: any): void {
    this.context.logger.log("Task failed", task.name, task.error);
    throw task.error;
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
