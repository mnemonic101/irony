import { RequestHandler } from "../core";
import { Handler } from "../router";

import * as bodyParser from "body-parser";

@Handler("/1" /* HACK!!!!!! */)
export class BodyParserHandler extends RequestHandler {

  constructor(request: any, response: any, next?: any) {
    super(request, response, next);

    this.context.logger.log("Parse body...");

    // HACK: parse body as JSON by default.
    // TODO: enable selective param parsing on controller level with decorators.
    bodyParser.json()(request, response, () => {
      if (next) next();
      else this.response.end();
    });
  }
}
