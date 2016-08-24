import {AutoWired, Inject, Singleton} from "../core/factory";

import {HttpVerb, ParamType} from "../router/enums";
import {RouteArea, RouteHandler, RequestContext, ReferencedResource} from "../router";

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
        routeArea.handlers[methodName] = new RouteHandler();
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
      this.callRouteHandler(routeArea, routeHandler, req, res, next);
    };

    if (!routeHandler.resolvedPath) {
      this.resolveProperties(routeArea, routeHandler);
    }

    this.router.register(routeHandler.httpVerb, routeHandler.resolvedPath, handlerCallback);
  }

  private callRouteHandler(routeArea: RouteArea, routeHandler: RouteHandler, req: any, res: any, next: any) {
    // req: express.Request, res: express.Response, next: express.NextFunction) {
    let context: RequestContext = new RequestContext();
    context.request = req;
    context.response = res;
    context.next = next;

    /* TODO: this.checkAcceptance(serviceMethod, context);*/
    let serviceObject = this.createRouteHandler(routeArea, context);
    let args = [];/* TODO: this.buildArgumentsList(serviceMethod, context);*/
    let result = routeArea.targetClass.constructor.prototype[routeHandler.name].apply(serviceObject, args);
    this.processResponseHeaders(routeHandler, context);
    this.sendValue(result, res, next);
  }

  private sendValue(value: any, res: any/*express.Response*/, next: any/*express.NextFunction*/) {
    switch (typeof value) {
      case "number":
        res.send(value.toString());
        break;
      case "string":
        res.send(value);
        break;
      case "boolean":
        res.send(value.toString());
        break;
      case "undefined":
        if (!res.headersSent) {
          res.sendStatus(204);
        }
        break;
      default:
        if (value.location && value instanceof ReferencedResource) {
          res.set("Location", value.location);
          res.sendStatus(value.statusCode);
        }
        /*else if (value.then && value instanceof Promise) {
        let self = this;
        value.then(function(val) {
        self.sendValue(val, res, next);
        }).catch(function(err) {
        next(err);
        });
        }*/
        else {
          res.json(value);
        }
    }
  }

  private processResponseHeaders(routeHandler: RouteHandler, context: RequestContext) {
    if (routeHandler.resolvedLanguages) {
      if (routeHandler.httpVerb === HttpVerb.GET) {
        context.response.vary("Accept-Language");
      }
      context.response.set("Content-Language", context.language);
    }
    if (routeHandler.resolvedAccepts) {
      context.response.vary("Accept");
    }
  }

  private createRouteHandler(routeArea: RouteArea, context: RequestContext) {

    let routeHandler = Object.create(routeArea.targetClass);
    let result = routeArea.targetClass.constructor.apply(routeHandler, [context.request, context.response, context.next]);

    if (routeArea.hasProperties()) {
      routeArea.properties.forEach((paramType, key) => {
        switch (paramType) {
          case ParamType.context:
            routeHandler[key] = context;
            break;
          case ParamType.context_accept_language:
            routeHandler[key] = context.language;
            break;
          case ParamType.context_accept:
            routeHandler[key] = context.preferredMedia;
            break;
          case ParamType.context_request:
            routeHandler[key] = context.request;
            break;
          case ParamType.context_response:
            routeHandler[key] = context.response;
            break;
          case ParamType.context_next:
            routeHandler[key] = context.next;
            break;
          default:
            break;
        }
      })
    }
    return routeHandler;
  }

  private resolveProperties(routeArea: RouteArea, routeHandler: RouteHandler): void {
    /* TODO: InternalServer.resolveLanguages(serviceClass, serviceMethod);
    InternalServer.resolveAccepts(serviceClass, serviceMethod);*/
    this.resolvePath(routeArea, routeHandler);
  }

  private resolvePath(routeArea: RouteArea, routeHandler: RouteHandler): void {
    let classPath: string = routeArea.path ? routeArea.path.trim() : "";
    let resolvedPath = '';/* TODO: classPath.startsWith('/') ? classPath : '/' + classPath;
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