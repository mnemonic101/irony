import { HttpVerb, ParamType, BodyParserType } from "../router/enums";
import { RouteArea, RequestContext, MethodParamData, FileParamData } from "../router/metadata";
import { ReferencedResource } from "../router/resources";

// TODO: Clarify wording: 
//       RouteHandler ==> RouteAction(Data)
//       A 'RouteAction(Data)' object describes a action to be execute for specific http requests.
//       It is created by decorating a method (with @Action or @HttpVerb (GET, POST, PUT usw.)).

export class RouteHandler {
  public name: string;
  public path: string;
  public resolvedPath: string;
  public httpVerb: HttpVerb;
  public parameters: Array<MethodParamData> = new Array<MethodParamData>();
  public files: Array<FileParamData> = new Array<FileParamData>();
  public mustParseCookies: boolean = false;
  public mustParseBody: BodyParserType = BodyParserType.None;
  public mustParseForms: boolean = false;
  public acceptMultiTypedParam: boolean = false;
  public languages: Array<string>;
  public accepts: Array<string>;
  public resolvedLanguages: Array<string>;
  public resolvedAccepts: Array<string>;

  private routeArea: RouteArea;
  private context: RequestContext;
  private handler: RouteHandler;

  constructor(routeArea: RouteArea) {
    this.routeArea = routeArea;
  }

  public execute(req: any, res: any, next: any) {
    // req: express.Request, res: express.Response, next: express.NextFunction) {
    let context: RequestContext = new RequestContext();
    context.request = req;
    context.response = res;
    context.next = next;
    this.context = context;

    /* TODO: this.checkAcceptance(serviceMethod, context);*/
    // Call handlers ctor
    this.handler = this.createRouteHandler(this.routeArea, context);

    // Automatically bind parameters
    let args = this.buildArgumentsList(context);

    // Call controllers action method
    let result = this.routeArea.targetClass[this.name].apply(this.handler, args);

    this.processResponseHeaders(this, this.context);
    this.sendValue(result, this.context.response, this.context.next);
  }

  private sendValue(value: any, response: any/*express.Response*/, next: any/*express.NextFunction*/): void {
    switch (typeof value) {
      case "number":
        response.send(value.toString());
        break;
      case "string":
        response.send(value);
        break;
      case "boolean":
        response.send(value.toString());
        break;
      case "undefined":
        if (!response.headersSent) {
          response.sendStatus(204);
        }
        break;
      case "object":
        let isHandled = false;
        switch (value.constructor.name) {
          case "ResponseData":
            response.writeHeader(value.code, value.headers);
            response.end(value.body);
            isHandled = true;
            break;
          case "Promise":
            let self = this;
            value.then(function (data) {
              self.sendValue(data, response, next);
            }).catch(function (err) {
              next(err);
            });
            isHandled = true;
            break;
          default:
          // Fall Through
        }
        if (isHandled) break;
      default:
        if (value.location && value instanceof ReferencedResource) {
          response.set("Location", value.location);
          response.sendStatus(value.statusCode);
        }
        /*else if (value.promise) {
          let self = this;
          value.promise.then(function (data) {
            self.sendValue(data, response, next);
          }).catch(function (err) {
            next(err);
          });
        }*/
        else {
          response.json(value);
        }
    }
  }

  private buildArgumentsList(context: RequestContext) {
    let result: Array<any> = new Array<any>();

    this.parameters.forEach(param => {
      switch (param.paramType) {
        case ParamType.path:
          result.push(this.convertType(context.request.params[param.name], param.type));
          break;
        case ParamType.query:
          result.push(this.convertType(context.request.query[param.name], param.type));
          break;
        case ParamType.header:
          result.push(this.convertType(context.request.header(param.name), param.type));
          break;
        case ParamType.cookie:
          result.push(this.convertType(context.request.cookies[param.name], param.type));
          break;
        case ParamType.body:
          result.push(this.convertType(context.request.body, param.type));
          break;
        case ParamType.file:
          let files: Array<any> = context.request.files[param.name];
          if (files && files.length > 0) {
            result.push(files[0]);
          }
          break;
        case ParamType.files:
          result.push(context.request.files[param.name]);
          break;
        case ParamType.form:
          result.push(this.convertType(context.request.body[param.name], param.type));
          break;
        case ParamType.param:
          let paramValue = context.request.body[param.name] ||
            context.request.query[param.name];
          result.push(this.convertType(paramValue, param.type));
          break;
        case ParamType.context:
          result.push(context);
          break;
        case ParamType.context_request:
          result.push(context.request);
          break;
        case ParamType.context_response:
          result.push(context.response);
          break;
        case ParamType.context_next:
          result.push(context.next);
          break;
        case ParamType.context_accept:
          result.push(context.accept);
          break;
        case ParamType.context_accept_language:
          result.push(context.language);
          break;
        default:
          throw Error("Invalid parameter type");
      }
    });

    return result;
  }

  private convertType(paramValue: string, paramType: Function): any {
    let serializedType = paramType["name"];
    switch (serializedType) {
      case "Number":
        return paramValue ? parseFloat(paramValue) : 0;
      case "Boolean":
        return paramValue === "true";
      default:
        return paramValue;
    }
  }

  private processResponseHeaders(routeHandler: RouteHandler, context: RequestContext): void {
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

  private createRouteHandler(routeArea: RouteArea, context: RequestContext): any {

    // TODO: The RequestHandler should be resolved by IoC!
    let routeHandler = Object.create(routeArea.targetClass);
    routeArea.targetClass.constructor.apply(routeHandler, [context.request, context.response, context.next]);

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
      });
    }
    return routeHandler;
  }

}
