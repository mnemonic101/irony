import {Container} from "../core/factory";

import {RouteRegistrar} from "../router/registrar";
import {HttpVerb, ParamType} from "../router/enums";

import {RouteArea} from "../router/metadata";
import {RouteHandler} from "../router/handler";

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
  let registrar = Container.get(RouteRegistrar);
  let routeArea: RouteArea = registrar.addRouteArea(target);
  routeArea.path = path;
}

function RouteActionDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor, path: string) {
  let registrar = Container.get(RouteRegistrar);
  let routeHandler: RouteHandler = registrar.addRouteHandler(target, propertyKey);
  if (routeHandler) { // does not intercept constructor
    routeHandler.path = path;
    routeHandler.httpVerb = HttpVerb.GET; // ???
    routeHandler.name = propertyKey; // ???
  }

  // TODO: process parameters of action method!
  /*  for (let index = 0; index < descriptor.value.length; index++) {
      let param = descriptor.value[index];
      ;
    }*/
}

export function Param(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.path, name);
  };
}

function processDecoratedParameter(target: Object, propertyKey: string, parameterIndex: number, paramType: ParamType, name: string) {
  // let serviceMethod: metadata.ServiceMethod = InternalServer.registerServiceMethod(target.constructor, propertyKey);
/*  if (serviceMethod) { // does not intercept constructor
    let paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);

    while (serviceMethod.parameters.length < paramTypes.length) {
      serviceMethod.parameters.push(new metadata.MethodParam(null,
        paramTypes[serviceMethod.parameters.length], metadata.ParamType.body));
    }
    serviceMethod.parameters[parameterIndex] = new metadata.MethodParam(name, paramTypes[parameterIndex], paramType);
  }*/
}
