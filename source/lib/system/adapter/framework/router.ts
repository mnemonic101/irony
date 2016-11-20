import {AutoWired, Inject, Singleton, Provides} from "../../core/factory";

import {ILogger} from "../../core/interfaces";
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

  private context: { logger: ILogger };

  constructor(@Inject logger: ILogger) {
    this.router = express();

    this.context = { logger: logger };
  }

  public addMiddleware(path: string, handler: coreExpress.RequestHandler): void {
    this.context.logger.log("addMiddleware => [%s]", path );
    if (path !== null && path !== undefined && path !== "") {
      this.router.use(path, handler);
    } else {
      this.router.use(handler);
    }
  }

  public addRequestHandler(path: string, handler: coreExpress.RequestHandler): void {
    this.context.logger.log("addRequestHandler => [%s]", path );
    this.router.all(path, handler);
  }
  public startWebServer(port: number, hostname: string, callback?: Function): http.Server {
    return this.router.listen(port, hostname, callback);
  }

  public register(httpVerb: HttpVerb, path: string, handler: any) {
    this.context.logger.log("register => [%s] [%s]", httpVerb, path );

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
        // TODO: Improve error handling: http://expressjs.com/en/guide/error-handling.html
        throw Error("Invalid http method registration. Http verb [" + httpVerb + "], Handler [" + path + "]");
    }
  }
}
