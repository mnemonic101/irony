// Fake interfaces for DI!
// Those needs to be an 'abstract class' for now, 
// because interfaces have no runtime representation yet, that could be used for type registration.

import {Promise} from "es6-promise";

export class IActionResult<T> {
  public promise: Promise<T>;
  public data: T;
}
