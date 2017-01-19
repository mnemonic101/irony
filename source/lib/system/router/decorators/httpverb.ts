import { Container } from "../../core/factory";
import { RouteRegistrar } from "../../router/registrar";
import { HttpVerb, ParamType, BodyParserType } from "../../router/enums";
import { MethodParamData, FileParamData } from "../../router/metadata";
import { RouteHandler } from "../../router/handler";

export function GET(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
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
  let registrar: RouteRegistrar = Container.get(RouteRegistrar);
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
    routeHandler.parameters.push(new MethodParamData(null,
      paramTypes[routeHandler.parameters.length], ParamType.body));
  }

  routeHandler.parameters.forEach(param => {
    if (param.paramType === ParamType.cookie) {
      routeHandler.mustParseCookies = true;
    }
    else if (param.paramType === ParamType.file) {
      routeHandler.files.push(new FileParamData(param.name, true));
    }
    else if (param.paramType === ParamType.files) {
      routeHandler.files.push(new FileParamData(param.name, false));
    }
    else if (param.paramType === ParamType.query) {
      routeHandler.acceptMultiTypedParam = true;
    }
    else if (param.paramType === ParamType.param) {
      routeHandler.acceptMultiTypedParam = true;
      routeHandler.mustParseBody = BodyParserType.JSON;
    }
    else if (param.paramType === ParamType.form) {
      if (routeHandler.mustParseBody !== BodyParserType.None) {
        throw Error("Can not use form parameters with a body parameter on the same method.");
      }
      routeHandler.mustParseForms = true;
    }
    else if (param.paramType === ParamType.body) {
      if (routeHandler.mustParseForms) {
        throw Error("Can not use form parameters with a body parameter on the same method.");
      }
      if (routeHandler.mustParseBody !== BodyParserType.None) {
        throw Error("Can not use more than one body parameter on the same method.");
      }
      routeHandler.mustParseBody = BodyParserType.Text;
    }
  });
}
