import {ParamType} from "../router/enums";
import {RouteHandler} from "../router/handler";

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

export class FileParam {
  constructor(
    public name: string,
    public singleFile: boolean) {
  }
}

export class MethodParam {
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
  /**
   * The resolved language to be used in the current request handling. 
   */
  public language: string;
  /**
   * The preferred media type to be used in the current request handling. 
   */
  public preferredMedia: string;
  /**
   * The request object. 
   */
  public request: any; // TODO: express.Request;
  /**
   * The response object 
   */
  public response: any; // TODO: express.Response; 
  /**
   * The next function. It can be used to delegate to the next middleware
   * registered the processing of the current request. 
   */
  public next: any; // TODO: express.NextFunction;
}

export abstract class ReferencedResource {
  /**
   * Constructor. Receives the location of the resource.
   * @param location To be added to the Location header on response
   * @param statusCode the response status code to be sent
   */
  constructor(public location: string, public statusCode: number) { }
}
