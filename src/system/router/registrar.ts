import {AutoWired, Inject, Singleton} from "../core/factory";

import {HttpVerb} from "../router/enums";
import {RouteArea} from "../router/metadata";

import {RouteHandler} from "../router/handler";

import {IRouter} from "../core/interfaces";
import {Set, StringMap} from "../core/utils";

import * as StringUtils from "underscore.string";

@AutoWired
@Singleton
export class RouteRegistrar {

  private paths: StringMap<Set<HttpVerb>> = new StringMap<Set<HttpVerb>>();
  private routeAreas: Array<RouteArea> = new Array<RouteArea>();
  private pathsResolved: boolean = false;

  private router: IRouter;
  constructor( @Inject router: IRouter) {
    this.router = router;
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

  public registerRoutes() {

    for (let controller in this.routeAreas) {
      if (this.routeAreas.hasOwnProperty(controller)) {
        let routeArea = this.routeAreas[controller];
        for (let method in routeArea.handlers) {
          if (routeArea.handlers.hasOwnProperty(method)) {
            let routeHandler = routeArea.handlers[method];
            this.buildRoute(routeArea, routeHandler);
          }
        }
      }
    }
    this.pathsResolved = true;
  }

  private buildRoute(routeArea: RouteArea, routeHandler: RouteHandler) {
    let handlerCallback = (req, res, next) => {
      let rh: RouteHandler = routeHandler;
      rh.execute(req, res, next);
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
      resolvedPath = classPath + (/* TODO: methodPath.startsWith('/') ? methodPath : '/' + */methodPath);
    }

    let declaredHttpMethods: Set<HttpVerb> = this.paths.get(resolvedPath);
    if (!declaredHttpMethods) {
      declaredHttpMethods = new Set<HttpVerb>();
      this.paths.set(resolvedPath, declaredHttpMethods);
    }
    if (declaredHttpMethods.has(routeHandler.httpVerb)) {
      throw Error("Duplicated declaration for path [" + resolvedPath + "], method ["
        + routeHandler.httpVerb + "]. ");
    }
    declaredHttpMethods.add(routeHandler.httpVerb);
    routeHandler.resolvedPath = resolvedPath;
  }

  private resolveAllPaths() {
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

  /*private handleNotAllowedMethods() {
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
