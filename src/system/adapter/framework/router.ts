import {AutoWired, Singleton, Provides} from "../../core/factory";

import {IRouter} from "../../core/interfaces";
import {HttpVerb} from "../../router/enums";

import * as http from "http";
import * as express from "express";
import * as coreExpress from "express-serve-static-core";

@AutoWired
@Singleton
@Provides(IRouter)
export class RouterAdapter implements IRouter {

  public router: express.Application;

  constructor() {
    console.log("RouteAdapter constructed...");
    this.router = express();
  }

  public addRequestHandler(name: string, handler: coreExpress.RequestHandler): void {
    this.router.use(name, handler);
  }
  public startWebServer(port: number, hostname: string, callback?: Function): http.Server {
    return this.router.listen(port, hostname, callback);
  }

  public register(httpVerb: HttpVerb, path: string, handler: any) {

    let args: any[] = [];
    args.push(path);
    args.push(handler);

    switch (httpVerb) {
      case HttpVerb.GET:
        this.router.get.apply(this.router, args);
        break;
      case HttpVerb.POST:
        this.router.post.apply(this.router, args);
        break;
      case HttpVerb.PUT:
        this.router.put.apply(this.router, args);
        break;
      case HttpVerb.DELETE:
        this.router.delete.apply(this.router, args);
        break;
      case HttpVerb.HEAD:
        this.router.head.apply(this.router, args);
        break;
      case HttpVerb.OPTIONS:
        this.router.options.apply(this.router, args);
        break;
      case HttpVerb.PATCH:
        this.router.patch.apply(this.router, args);
        break;

      default:
        throw Error("Invalid http method registration. Http verb [" + httpVerb + "], Handler [" + path + "]");
    }
  }
}
