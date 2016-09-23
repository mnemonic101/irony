import {Container} from "../core/factory";

import {RouteRegistrar} from "../router/registrar";
import {HttpVerb, ParamType} from "../router/enums";

import {RouteArea, MethodParam, FileParam} from "../router/metadata";
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
    if (!routeHandler.httpVerb) {
      // Set default
      routeHandler.httpVerb = HttpVerb.GET;
    }
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

function processDecoratedParameter(
  target: Object, propertyKey: string, parameterIndex: number, paramType: ParamType, name: string) {
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

export function GET(target: any, propertyKey: string, descriptor: PropertyDescriptor){
    processHttpVerb(target, propertyKey, HttpVerb.GET);
}

export function POST(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    processHttpVerb(target, propertyKey, HttpVerb.POST);
}

export function PUT(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    processHttpVerb(target, propertyKey, HttpVerb.PUT);
}

export function DELETE(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    processHttpVerb(target, propertyKey, HttpVerb.DELETE);
}

export function HEAD(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    processHttpVerb(target, propertyKey, HttpVerb.HEAD);
}

export function OPTIONS(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  processHttpVerb(target, propertyKey, HttpVerb.OPTIONS);
}

export function PATCH(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    processHttpVerb(target, propertyKey, HttpVerb.PATCH);
}

function processHttpVerb(target: any, propertyKey: string, httpVerb: HttpVerb) {
  let registrar = Container.get(RouteRegistrar);
  let routeHandler: RouteHandler = registrar.addRouteHandler(target, propertyKey);
  if (routeHandler) { // does not intercept constructor
    if (routeHandler.httpVerb) {
      throw new Error("Method is already annotated with @" +
        routeHandler.httpVerb +
        ". You can only map a method to one HTTP verb.");
    }
    routeHandler.httpVerb = httpVerb;
    processRouteHandler(target, propertyKey, routeHandler);
  }
}

function processRouteHandler(target: any, propertyKey: string, routeHandler: RouteHandler) {
  routeHandler.name = propertyKey;
  let paramTypes = Reflect.getOwnMetadata("design:paramtypes", target, propertyKey);
  while (paramTypes.length > routeHandler.parameters.length) {
    routeHandler.parameters.push(new MethodParam(null,
      paramTypes[routeHandler.parameters.length], ParamType.body));
  }

  routeHandler.parameters.forEach(param => {
    if (param.paramType === ParamType.cookie) {
      routeHandler.mustParseCookies = true;
    }
    else if (param.paramType === ParamType.file) {
      routeHandler.files.push(new FileParam(param.name, true));
    }
    else if (param.paramType === ParamType.files) {
      routeHandler.files.push(new FileParam(param.name, false));
    }
    else if (param.paramType === ParamType.form) {
      if (routeHandler.mustParseBody) {
        throw Error("Can not use form parameters with a body parameter on the same method.");
      }
      routeHandler.mustParseForms = true;
    }
    else if (param.paramType === ParamType.body) {
      if (routeHandler.mustParseForms) {
        throw Error("Can not use form parameters with a body parameter on the same method.");
      }
      if (routeHandler.mustParseBody) {
        throw Error("Can not use more than one body parameter on the same method.");
      }
      routeHandler.mustParseBody = true;
    }
  });
}
