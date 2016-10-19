import {HttpVerb, ParamType} from "../router/enums";
import {RouteArea, RequestContext, ReferencedResource, MethodParam, FileParam} from "../router/metadata";

// TODO: Clarify wording: 
//       RouteHandler ==> RouteAction(Data)
//       A 'RouteAction(Data)' object describes a action to be execute for specific http requests.
//       It is created by decorating a method (with @Action or @HttpVerb (GET, POST, PUT usw.)).

export class RouteHandler {
  public name: string;
  public path: string;
  public resolvedPath: string;
  public httpVerb: HttpVerb;
  public parameters: Array<MethodParam> = new Array<MethodParam>();
  public mustParseCookies: boolean = false;
  public files: Array<FileParam> = new Array<FileParam>();
  public mustParseBody: boolean = false;
  public mustParseForms: boolean = false;
  public languages: Array<string>;
  public accepts: Array<string>;
  public resolvedLanguages: Array<string>;
  public resolvedAccepts: Array<string>;

  private routeArea: RouteArea;
  private context: RequestContext;
  private handler: Object;

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

    // TODO: Automatically bind parameters
    let args = []; /* TODO: this.buildArgumentsList(serviceMethod, context);*/

    // Call controllers action method
    let result = this.routeArea.targetClass.constructor.prototype[this.name].apply(this.handler, args);


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
