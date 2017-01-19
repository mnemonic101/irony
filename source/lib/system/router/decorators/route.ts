import { Container } from "../../core/factory";
import { RouteRegistrar } from "../../router/registrar";
import { HttpVerb } from "../../router/enums";
import { RouteArea } from "../../router/metadata";
import { RouteHandler } from "../../router/handler";

export function Route(path: string) {
  return function (...args: any[]) {
    if (args.length === 1) {
      return RouteAreaDecorator.apply(this, [args[0], path]);
    }
    else if (args.length === 3 && typeof args[2] === "object") {
      return RouteActionDecorator.apply(this, [args[0], args[1], args[2], path]);
    }

    throw new Error("Invalid @Route Decorator declaration.");
  };
}

function RouteAreaDecorator(target: Function, path: string) {
  let registrar: RouteRegistrar = Container.get(RouteRegistrar);
  let routeArea: RouteArea = registrar.addRouteArea(target);
  routeArea.path = path;
}

function RouteActionDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor, path: string) {
  let registrar: RouteRegistrar = Container.get(RouteRegistrar);
  let routeHandler: RouteHandler = registrar.addRouteHandler(target, propertyKey);
  if (routeHandler) { // does not intercept constructor
    routeHandler.path = path;
    if (!routeHandler.httpVerb) {
      // Set default
      routeHandler.httpVerb = HttpVerb.GET;
    }
    routeHandler.name = propertyKey; // ???
  }
}
