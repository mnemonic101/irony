import { Container, Scope } from "../core/factory";
import { FileSystemHelper } from "../core/utils";
import { Promise } from "../core";

import { RouteRegistrar } from "../router/registrar";

import { ILogger, IFramework, IDataAdapter, ITask } from "../core/interfaces";
import { Context } from "../core/context";
import { Configuration } from "../config/configuration";
import { Adapter as IntermediateLogger } from "../adapter/logger";

import * as fs from "fs";
import * as path from "path";

export abstract class WebServer {

  private static instance: WebServer;
  public static start() {
    if (WebServer.instance == null) {
      WebServer.instance = Container.get(WebServer);
    }
  }

  private logger: ILogger = new IntermediateLogger(true);

  private internalContext: Context;
  public get context(): Context {
    return this.internalContext;
  }

  private config: Configuration;

  private tasks: any[] = [];

  constructor() {
    this.logger.info("Application is starting...", typeof (this));

    this.execute();
  }

  public execute() {

    this.initializeHooks();
    this.initializeSystem();
    this.initializeApplication();
  }

  private initializeHooks() {
    (<any>process.stdout).write = (write => {
      return (...args) => {
        let message = args[0];
        if (this.logger.isLogLine(message)) {
          write.apply(process.stdout, args);
        } else {
          this.logger.log(message);
        }
      };
    })(process.stdout.write);
  }

  private initializeSystem() {

    this.initializeConfiguration();
    this.initializeAdapter();
    this.initializeContext();
  }

  private initializeApplication() {

    this.initializeController();
    this.initializeRequestHandler();
    this.initializeTasks();

    this.initializeRoutes();

    this.executeTasks()
      .then(() => { this.startWebServer(); });
  }

  private initializeConfiguration(): void {
    this.config = Container.get(Configuration);
  }

  private initializeAdapter(): void {

    this.registerAdapter(ILogger, "logger", true);
    this.registerAdapter(IFramework, "framework");
    this.registerAdapter(IDataAdapter, "data");
  }

  private registerAdapter(
    typeOfAdapter: Function,
    name?: string,
    isSingleton: boolean = false): void {

    let modulePath: string[] = this.resolveModulePath("/adapter", name);
    let module: any = require(modulePath[0]);

    let config = Container.bind(typeOfAdapter).to(module.Adapter);
    if (isSingleton) config.scope(Scope.Singleton);
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
            this.logger.debug(`Load Module: [${fullFilePath}]`);

            let module = require(fullFilePath);
            modules.push(module);
          }
        });
      } else {
        throw new Error("Modules could not be resolved by path. Path does not exists [" + pathFragment + "].");
      }
    });

    return modules;
  }

  private resolveModulePath(startPath: string, filename: string): string[] {

    let paths: string[] = [];

    // TODO: Improve the resolution of dynamic module binding!
    // TODO: Create a strategy to search folders!

    let filePath = (filename !== "") ? "/" + filename : "";
    if (startPath.indexOf(this.config.settings.basePath) === -1) {
      let foldersToSearch: Array<string> = [];

      foldersToSearch.push(this.config.coreBasePath + "/system/" + startPath);
      foldersToSearch.push(this.config.coreBasePath + "/" + startPath);
      foldersToSearch.push(this.config.appBasePath + "/system/" + startPath);
      foldersToSearch.push(this.config.appBasePath + "/" + startPath);

      let newPath = "";
      while (foldersToSearch.length !== 0) {

        newPath = foldersToSearch.pop();
        if (FileSystemHelper.fileOrFolderExists(newPath + filePath)) {
          startPath = newPath;

          let absoluteFilePath: string = startPath + filePath;
          paths.push(fs.realpathSync(absoluteFilePath));
        }
      }
      if (paths.length === 0) {
        throw new Error("Path could not be determined. Path [" + startPath + "], File [" + filename + "].");
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
    this.internalContext = Container.get(Context);

    this.switchLogger();
  }

  private switchLogger() {

    let intermediateLogger = <IntermediateLogger>this.logger;
    this.logger = this.context.logger;

    intermediateLogger.flushBuffer(logData => {
      this.logger.log(logData);
    });
  }

  private initializeRoutes(): void {
    let registrar: RouteRegistrar = Container.get(RouteRegistrar);
    // HACK!!!!!!!!!
    registrar.registerHttpHandler("/0");
    registrar.registerHttpHandler("/1");
    registrar.registerRoutes();
    registrar.registerHttpHandler("/2");
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
    this.logger.log("Task executed", task.name);
  }
  private onTaskError(task: any): void {
    this.logger.warn("Task failed", task.name, task.error, task.error.stack);
    throw new Error(task.error);
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
    let url = this.context.settings.rootUrl;
    this.logger.info("Application Web Server is running at", url);

    this.onAfterServerStart();
  }

}
