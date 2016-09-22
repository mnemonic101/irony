import {RequestHandler} from "../core";
import {Route} from "../router";

export class UnhandledRequestHandler extends RequestHandler {

  @Route("/\*")
  public Index(): void {

    this.context.logger.log("Unhandled request:", this.request.url);

    this.response.writeHead(404, { "Content-Type": "text/plain" });
    this.response.end("Unhandled request!");
  }
}
