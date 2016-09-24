import {Container} from "../core/factory";
import {Context} from "../core/context";

export abstract class Controller/* TODO: extends RequestHandlerBase*/ {

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

  // TODO: The Controller arguments should be resolved by IoC!

  constructor(request: any, response: any, next?: any) {
    this._request = request;
    this._response = response;
    this._next = next;

    // HACK!!!!
    this._context = Container.get(Context);
  }
}
