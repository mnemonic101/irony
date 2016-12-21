import { AutoWired, Inject, Singleton } from "../core/factory";
import { Context } from "../core/context";

import { HttpVerb } from "../router/enums";
import { RouteArea } from "../router/metadata";

import { RouteHandler } from "../router/handler";

import { IRouter } from "../core/interfaces";
import { Set, StringMap } from "../core/utils";

import * as StringUtils from "underscore.string";

// TODO: Seperate concerns! The RouteRegistrar class has too many responsibilities!

@AutoWired
@Singleton
export class RouteRegistrar {

  private paths: StringMap<Set<HttpVerb>> = new StringMap<Set<HttpVerb>>();
  private routeAreas: Array<RouteArea> = new Array<RouteArea>();
  private httpHandler: Array<RouteArea> = new Array<RouteArea>();
  private pathsResolved: boolean = false;

  constructor(
    @Inject private router: IRouter,
    @Inject private context: Context) {
  }

  public addHttpHandler(target: any): RouteArea {
    this.pathsResolved = false;
    let name: string = target.name || target.constructor.name;
    if (!this.httpHandler.hasOwnProperty(name)) {
      this.httpHandler[name] = new RouteArea(target);
    }
    let httpHandler: RouteArea = this.httpHandler[name];
    return httpHandler;
  }

  public addRouteArea(target: any): RouteArea {
    this.pathsResolved = false;
    let name: string = target.name || target.constructor.name;
    if (!this.routeAreas.hasOwnProperty(name)) {
      this.routeAreas[name] = new RouteArea(target);
    }
    let routeArea: RouteArea = this.routeAreas[name];
    return routeArea;
  }

  public addRouteHandler(target: Function, methodName: string): RouteHandler {
    if (methodName) {
      this.pathsResolved = false;
      let routeArea: RouteArea = this.addRouteArea(target);
      if (!routeArea.handlers.hasOwnProperty(methodName)) {
        routeArea.handlers[methodName] = new RouteHandler(routeArea);
      }
      let routeHandler: RouteHandler = routeArea.handlers[methodName];
      return routeHandler;
    }
    return null;
  }

  public registerHttpHandler(path: string) {
    // TODO: Enable middleware handlers!
    // HACK: Hardcoded middleware handler:
    if (path === "/0") {
      let timeMeasure = require("response-time");
      this.router.addMiddleware(null, timeMeasure((request, response, time) => {
        let message = `Response time: ${request.method} [${request.url}] [${time}ms]`;
        this.context.logger.debug(message);
      }));
    }

    // HACK!!!!!!!!!!!!!!!!!
    for (let handler in this.httpHandler) {
      if (this.httpHandler.hasOwnProperty(handler)) {

        let routeArea = this.httpHandler[handler];
        if (StringUtils.startsWith(routeArea.path, path)) {
          this.context.logger.log(`Handler registered: [${handler.toString()}]`, );
          this.router.addMiddleware("/", (request, response, next) => {
            // TODO: The RequestHandler should be resolved by IoC!
            let routeHandler = Object.create(routeArea.targetClass.prototype);
            routeArea.targetClass.prototype.constructor.apply(routeHandler, [request, response, next]);
          });
        }
      }
    }

    // TODO: Enable error handlers!
    // HACK: Hardcoded error handler:
    if (path === "/2") {
      this.router.addMiddleware(null, (error, request, response, next) => {
        this.context.logger.error(error.stack);
        response.status(500).send(error.stack);
      });
    }

  }

  public registerRoutes() {

    for (let controller in this.routeAreas) {
      if (this.routeAreas.hasOwnProperty(controller)) {
        let routeArea = this.routeAreas[controller];
        this.context.logger.log(`Controller registered: [${controller.toString()}]`);
        for (let method in routeArea.handlers) {
          if (routeArea.handlers.hasOwnProperty(method)) {
            let routeHandler = routeArea.handlers[method];
            this.context.logger.log(`Action registered: [${method.toString()}]`);
            this.buildRoute(routeArea, routeHandler);
          }
        }
      }
    }

    this.pathsResolved = true;
  }

  private buildRoute(routeArea: RouteArea, routeHandler: RouteHandler) {
    let handlerCallback = async (req, res, next) => {
      let rh: RouteHandler = routeHandler;
      try {
        await rh.execute(req, res, next);
      } catch (error) {
        next(error);
      }
    };

    if (!routeHandler.resolvedPath) {
      this.resolveProperties(routeArea, routeHandler);
    }

    this.router.register(routeHandler.httpVerb, routeHandler.resolvedPath, handlerCallback);
  }

  private resolveProperties(routeArea: RouteArea, routeHandler: RouteHandler): void {
    /* TODO: InternalServer.resolveLanguages(serviceClass, serviceMethod);
    InternalServer.resolveAccepts(serviceClass, serviceMethod);*/
    this.resolvePath(routeArea, routeHandler);
  }

  private resolvePath(routeArea: RouteArea, routeHandler: RouteHandler): void {
    let classPath: string = routeArea.path ? routeArea.path.trim() : "";

    let resolvedPath = StringUtils.startsWith(classPath, "/") ? classPath : "/" + classPath;
    if (StringUtils.endsWith(resolvedPath, "/")) {
      resolvedPath = resolvedPath.slice(0, resolvedPath.length - 1);
    }

    if (routeHandler.path) {
      let methodPath: string = routeHandler.path.trim();
      resolvedPath = classPath + (StringUtils.startsWith(methodPath, "/") ? methodPath : "/" + methodPath);
    }

    let declaredHttpMethods: Set<HttpVerb> = this.paths.get(resolvedPath);
    if (!declaredHttpMethods) {
      declaredHttpMethods = new Set<HttpVerb>();
      this.paths.set(resolvedPath, declaredHttpMethods);
    }
    if (declaredHttpMethods.has(routeHandler.httpVerb)) {
      // TODO: Improve error handling: http://expressjs.com/en/guide/error-handling.html
      throw Error("Duplicated declaration for path [" + resolvedPath + "], method ["
        + routeHandler.httpVerb + "]. ");
    }
    declaredHttpMethods.add(routeHandler.httpVerb);
    routeHandler.resolvedPath = resolvedPath;
  }

  /*private resolveAllPaths() {
    if (!this.pathsResolved) {
      this.paths.clear();
      this.routeAreas.forEach(classData => {
        classData.handlers.forEach(method => {
          if (!method.resolvedPath) {
            this.resolveProperties(classData, method);
          }
        });
      });
      this.pathsResolved = true;
    }
  }

  private handleNotAllowedMethods() {
    let paths: Set<string> = this.getPaths();
    paths.forEach((path) => {
      let supported: Set<HttpVerb> = this.getHttpMethods(path);
      let allowedMethods: Array<string> = new Array<string>();
      supported.forEach((method: HttpVerb) => {
        allowedMethods.push(HttpVerb[method]);
      });
      let allowed: string = allowedMethods.join(", ");
      this.router.all(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.set("Allow", allowed);
        throw new Errors.MethodNotAllowedError();
      });
    });
  }

  private getPaths(): Set<string> {
    this.resolveAllPaths();
    return new Set(this.paths.keys());
  }

  private getHttpMethods(path: string): Set<HttpVerb> {
    this.resolveAllPaths();
    let methods: Set<HttpVerb> = this.paths.get(path);
    return methods || new Set<HttpVerb>();
  }*/

}
