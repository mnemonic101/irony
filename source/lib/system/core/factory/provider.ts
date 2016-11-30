import { Provided, Provider } from "../factory";

import { FileSystemHelper } from "../../core/utils";

import { TypedJSON } from "typedjson-npm";

export function ProvidedByJson(): Function {
  return function (target: Function): Function {
    return Provided(new ConfigurationProvider(target));
  };
}

export class ConfigurationProvider implements Provider {
  private type: any;

  constructor(type: any) {
    this.type = type;
  }

  public get(): Object {
    let fileName: string = this.type.name.toLowerCase() + ".json";
    let configJson: Buffer = FileSystemHelper.locateAndReadFile(fileName);

    let folderName = FileSystemHelper.locateFolderOf(fileName);
    // TODO: inject logger into ConfigurationProvider
    console.log("Load configuration: [" + folderName + "/" + fileName + "]");

    let config: any = TypedJSON.parse(configJson.toString(), this.type);

    return config;
  }
}
