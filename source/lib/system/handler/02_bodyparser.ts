import { RequestHandler } from "../core";
import { Handler } from "../router";

import * as bodyParser from "body-parser";

// HINT: body-parser is hard coded in registrar.ts for now
// @Handler("/1" /* HACK!!!!!! */)
export class BodyParserHandler extends RequestHandler {

  constructor(request: any, response: any, next?: any) {
    super(request, response, next);

    this.context.logger.log("Parse body...");

    // HACK: parse body as simple text by default.
    // TODO: enable selective param parsing on controller level with decorators.
    bodyParser.text({ type: "application/json" })(request, response, () => {
      if (next) next();
      else this.response.end();
    });
  }
}
