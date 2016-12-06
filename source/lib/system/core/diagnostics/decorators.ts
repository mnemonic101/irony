import { Tracer } from "./tracer";

export function Trace(constructor: Function) {
    let tracer: Tracer = new Tracer();
    tracer.traceAll(constructor.prototype, true);
}
