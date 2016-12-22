import {ParamType} from "../router/enums";
import {RouteHandler} from "../router/handler";

// TODO: Clarify wording: 
//       RouteArea ==> RouteData
//       A 'RouteData' object describes a specific range of routes.
//       It is created by decorating a class (with @Controller or @Handler).
//       It could contain RouteAction(Data) to describe specific actions.
//       RouteHandler ==> RouteAction(Data)

export class RouteArea {
  public targetClass: Function;
  public path: string;
  public handlers: Array<RouteHandler>;
  public languages: Array<string>;
  public accepts: Array<string>;
  public properties: Array<ParamType>;

  constructor(targetClass: Function) {
    this.targetClass = targetClass;
    this.handlers = new Array<RouteHandler>();
  }

  public addProperty(key: string, paramType: ParamType) {
    if (!this.hasProperties()) {
      this.properties = new Array<ParamType>();
    }
    this.properties[key] = paramType;
  }

  public hasProperties(): boolean {
    return (this.properties && this.properties.length > 0);
  }
}

export class FileParamData {
  constructor(
    public name: string,
    public singleFile: boolean) {
  }
}

export class MethodParamData {
  constructor(
    public name: string,
    public type: Function,
    public paramType: ParamType) {
  }
}

export class ResponseData {
  public body: string;
  public code: number;
  public headers: { [id: string]: string } = {};
}

export class RequestContext {

  public language: string;
  public accept: string;
  public preferredMedia: string;
  public request: any; // TODO: express.Request;
  public response: any; // TODO: express.Response; 
  public next: any; // TODO: express.NextFunction;
}
