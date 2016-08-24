import {HttpVerb, ParamType} from "../router/enums";

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
}

export class FileParam {
  public name: string;
  public singleFile: boolean;

  constructor(name: string, singleFile: boolean) {
    this.name = name;
    this.singleFile = singleFile;
  }
}

export class MethodParam {
  public name: string;
  public type: Function;
  public paramType: ParamType;

  constructor(name: string, type: Function, paramType: ParamType) {
    this.name = name;
    this.type = type;
    this.paramType = paramType;
  }
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
