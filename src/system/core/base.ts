export abstract class ControllerBase {

  private _request : any;
  public get request(): any {
    return this._request;
  }

  private _response : any;
  public get response(): any {
    return this._response;
  }

  private _next : any;
  public get next(): any {
    return this._next;
  }

  constructor(request: any, response: any, next?: any) {
    this._request = request;
    this._response = response;
    this._next = next;
  }
}
