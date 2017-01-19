import { Container } from "../../core/factory";
import { RouteRegistrar } from "../../router/registrar";
import { RouteArea } from "../../router/metadata";

export function Handler(path: string) {

  return function (...args: any[]) {

    if (args.length === 1) {
      return HandlerDecorator.apply(this, [args[0], path]);
    }

    throw new Error("Invalid @Handler Decorator declaration.");
  };
}

function HandlerDecorator(target: Function, path: string) {
  let registrar: RouteRegistrar = Container.get(RouteRegistrar);
  let routeHandler: RouteArea = registrar.addHttpHandler(target);
  if (routeHandler) { // does not intercept constructor
    routeHandler.path = path;
  }
}
