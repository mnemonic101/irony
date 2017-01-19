import { Container } from "../../core/factory";
import { RouteRegistrar } from "../../router/registrar";
import { ParamType } from "../../router/enums";
import { MethodParamData } from "../../router/metadata";
import { RouteHandler } from "../../router/handler";

export function PathParam(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.path, name);
  };
}

export function FileParam(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.file, name);
  };
}

export function FilesParam(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.files, name);
  };
}

export function QueryParam(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.query, name);
  };
}

export function HeaderParam(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.header, name);
  };
}
export function CookieParam(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.cookie, name);
  };
}

export function FormParam(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.form, name);
  };
}

export function BodyParam() {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.body, name);
  };
}

export function Param(name: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    processDecoratedParameter(target, propertyKey, parameterIndex, ParamType.param, name);
  };
}

function processDecoratedParameter(
  target: Object,
  propertyKey: string,
  parameterIndex: number,
  paramType: ParamType,
  name: string) {

  let registrar: RouteRegistrar = Container.get(RouteRegistrar);
  let routeHandler: RouteHandler = registrar.addRouteHandler(target.constructor, propertyKey);

  if (routeHandler) { // does not intercept constructor
    let paramTypes = Reflect.getOwnMetadata("design:paramtypes", target, propertyKey);

    while (routeHandler.parameters.length < paramTypes.length) {
      routeHandler.parameters.push(new MethodParamData(null,
        paramTypes[routeHandler.parameters.length], ParamType.body));
    }
    routeHandler.parameters[parameterIndex] = new MethodParamData(name, paramTypes[parameterIndex], paramType);
  }
}
