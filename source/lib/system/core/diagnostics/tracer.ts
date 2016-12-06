import { Container } from "../../core/factory";
import { ILogger } from "../../core/interfaces";

interface String {
  repeat(count: number): string;
  /*substr(from: number, length?: number): string;*/
}

export class Tracer {

  private nativeCodeEx: RegExp = /\[native code\]/;
  private indentCount: Number = -4;
  private tracing: any[] = [];
  private logger: ILogger;

  public traceMe(func, methodName) {
    let traceOn = function () {
      this.logger = Container.get(ILogger);
      let sTime = process.hrtime();
      let indentString = (<any>"::").repeat(this.indentCount += 4);
      // this.logger.debug(indentString + methodName + "(" + Array.prototype.slice.call(arguments).join(", ") + ")");
      this.logger.debug(`TRACE :: [${indentString + methodName}]`);
      let result = func.apply(this, arguments);
      const fTime = process.hrtime(sTime);
      // this.logger.debug(indentString + methodName, "-> ", result, "(", fTime[0] + fTime[1] / 1000000, "ms", ")");
      this.logger.debug(`TRACE :: [${indentString + methodName}] [${fTime[0] + fTime[1] / 1000000} ms]`);
      this.indentCount -= 4;
      return result;
    };

    traceOn["traceOff"] = func;
    for (let prop in func) {
      traceOn[prop] = func[prop];
    }

    // TODO: Make ILogger available as soon as possible!
    console.log(`Tracing enabled for method [${methodName}]`);
    return traceOn;
  }

  public traceAll(root, recurse) {
    if (!((typeof root === "object") || (typeof root === "function"))) { return; }
    for (let key in root) {
      if ((root.hasOwnProperty(key)) && (root[key] !== root)) {
        let thisObj = root[key];
        if (typeof thisObj === "function") {
          if ((this !== root) && !thisObj.traceOff && !this.nativeCodeEx.test(thisObj)) {
            root[key] = this.traceMe(root[key], key);
            this.tracing.push({ obj: root, methodName: key });
          }
        }
        if (recurse) { this.traceAll(thisObj, true); }
      }
    }
  };

  public untraceAll() {
    for (let i = 0; i < this.tracing.length; ++i) {
      let thisTracing = this.tracing[i];
      thisTracing.obj[thisTracing.methodName] =
        thisTracing.obj[thisTracing.methodName].traceOff;
    }
    console.log("tracing disabled");
    this.tracing = [];
  };
}
