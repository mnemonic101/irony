import {Provided, Provider} from "../factory";

import {FileSystemHelper} from "../../core/helper";

import {TypedJSON} from "typedjson";

export function ProvidedByJson(): Function {
  return function (target: Function): Function {
    return Provided(new ConfigurationProvider(target))
  };
}

export class ConfigurationProvider implements Provider {
  private type: any;

  constructor(type: any) {
    this.type = type;
  }

  public get(): Object {
    let name: string = this.type.name.toLowerCase() + ".json";
    let configJson: Buffer = FileSystemHelper.locateAndReadFile(name);
    let config: any = TypedJSON.parse(configJson.toString(), this.type);
    return config;
  }
}
