import {AutoWired, Inject, Singleton} from "../core/factory";

import {HttpVerb} from "../router/enums";
import {RouteArea} from "../router/metadata";

import {RouteHandler} from "../router/handler";

import {IRouter} from "../core/interfaces";

@AutoWired
@Singleton
export class RouteRegistrar {
  public routeAreas: Array<RouteArea> = new Array<RouteArea>();
  public pathsResolved: boolean = false;

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
    let resolvedPath = ""; /* TODO: classPath.startsWith('/') ? classPath : '/' + classPath;
if (resolvedPath.endsWith('/')) {
resolvedPath = resolvedPath.slice(0, resolvedPath.length - 1);
}*/

    if (routeHandler.path) {
      let methodPath: string = routeHandler.path.trim();
      resolvedPath = classPath + (/* TODO: methodPath.startsWith('/') ? methodPath : '/' + */methodPath);
    }

    let declaredHttpMethods: Array<HttpVerb> = []; /* TODO: Set<HttpMethod> = InternalServer.paths.get(resolvedPath);
if (!declaredHttpMethods) {
declaredHttpMethods = new Set<HttpMethod>();
InternalServer.paths.set(resolvedPath, declaredHttpMethods);
}
if (declaredHttpMethods.has(serviceMethod.httpMethod)) {
throw Error("Duplicated declaration for path [" + resolvedPath + "], method ["
+ serviceMethod.httpMethod + "]. ");
}*/
    declaredHttpMethods[routeHandler.httpVerb];
    routeHandler.resolvedPath = resolvedPath;
  }
}
