import {HttpVerb, ParamType} from "../router/enums";
import {RouteArea, RequestContext, ReferencedResource, MethodParam, FileParam} from "../router/metadata";

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

  private sendValue(value: any, res: any/*express.Response*/, next: any/*express.NextFunction*/): void {
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
      });
    }
    return routeHandler;
  }

}
