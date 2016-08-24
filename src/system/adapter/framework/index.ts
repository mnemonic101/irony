import {AutoWired, Inject} from "../../core/factory";
import {IFramework, IRouter} from "../../core/interfaces";

import {RouterAdapter} from "./router";

import * as http from "http";

@AutoWired
export class Adapter implements IFramework {

 public router: IRouter;

 constructor(@Inject router: RouterAdapter) {
 this.router = router;
 }

 public startWebServer(port: number, hostname: string, callback?: Function): http.Server {
 return (<any> this.router).router.listen(port, hostname, callback);
 }
}
