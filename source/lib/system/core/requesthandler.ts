import {Container} from "../core/factory";
import {Context} from "../core/context";

// TODO: RequestHandlerBase should be the base class for Controller and RequestHandler classes.
//       The difference between Controller and RequestHandler classes is, that 
//       A 'Controller' provides specific ActionMethods to handle http requests finally 
//       and my return specific ActionResult objects.  
//       A 'RequestHandler' intercepts the http request, may modify the response object 
//       and may also finish the request, e.g. in case of insufficient permissions.
//       There are normal RequestHandler and ErrorRequestHandler implementations. 
//       (1) RequestHandler are intercepting at the beginning of the http request processing. 
//       (2) Then all ActionMethods are executed. 
//       (3) At least the ErrorRequestHandler are executed, in case of any failure.

export abstract class RequestHandler/* TODO: Base*/ {

  private _request: any;
  public get request(): any {
    return this._request;
  }

  private _response: any;
  public get response(): any {
    return this._response;
  }

  private _next: any;
  public get next(): any {
    return this._next;
  }

  private _context: Context;
  public get context(): Context {
    return this._context;
  }

  // TODO: The RequestHandlerBase arguments should be resolved by IoC!

  constructor(request: any, response: any, next?: any) {
    this._request = request;
    this._response = response;
    this._next = next;

    // HACK!!!!
    this._context = Container.get(Context);
  }
}
