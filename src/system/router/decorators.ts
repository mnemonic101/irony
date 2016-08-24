import {Container} from "../core/factory";

import {RouteRegistrar} from "../router/registrar";
import {HttpVerb} from "../router/enums";

import {RouteArea, RouteHandler} from "../router/metadata";

export function Route(path: string) {
  return function (...args: any[]) {
    if (args.length === 1) {
      return RouteTypeDecorator.apply(this, [args[0], path]);
    }
    else if (args.length === 3 && typeof args[2] === "object") {
      return RouteMethodDecorator.apply(this, [args[0], args[1], args[2], path]);
    }

    throw new Error("Invalid @Route Decorator declaration.");
  }
}

function RouteTypeDecorator(target: Function, path: string) {
  let registrar = Container.get(RouteRegistrar);
  let routeArea: RouteArea = registrar.addRouteArea(target);
  routeArea.path = path;
}

function RouteMethodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor, path: string) {
  let registrar = Container.get(RouteRegistrar);
  let routeHandler: RouteHandler = registrar.addRouteHandler(target, propertyKey);
  if (routeHandler) { // does not intercept constructor
    routeHandler.path = path;
    routeHandler.httpVerb = HttpVerb.GET; // ???
    routeHandler.name = propertyKey; // ???
  }
}
