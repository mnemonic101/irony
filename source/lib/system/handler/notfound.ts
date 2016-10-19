import {RequestHandler} from "../core";
import {Handler} from "../router";

@Handler("/2" /* HACK!!!!!! */)
export class NotFoundRequestHandler extends RequestHandler {

  constructor(request: any, response: any, next?: any) {
    super(request, response, next);

    this.context.logger.log("Unhandled request:", this.request.url);

    this.response.writeHead(404, { "Content-Type": "text/plain" });
    this.response.end("404 - Content Not Found!");

    if (next) { next(); } else { this.response.end(); }
  }
}
