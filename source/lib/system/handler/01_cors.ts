import {RequestHandler} from "../core";
import {Handler} from "../router";

@Handler("/1" /* HACK!!!!!! */)
export class CorsRequestHandler extends RequestHandler {

  constructor(request: any, response: any, next?: any) {
    super(request, response, next);

    this.context.logger.log("CORS request:", this.request.url);
    this.response.header("Access-Control-Allow-Origin", this.request.headers.origin);

    if (next) { next(); } else { this.response.end(); }
  }
}
