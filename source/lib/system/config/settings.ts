import {Provided, Singleton, ConfigurationProvider/*, ProvidedByJson*/} from "../core/factory";

import {JsonObject, JsonMember} from "typedjson-npm";

@JsonObject
@Singleton
@Provided(new ConfigurationProvider(Settings))
// TODO: wrap with @ProvidedByJson
export class Settings {

  @JsonMember
  public readonly protocol: string = "http";

  @JsonMember
  public readonly hostname: string = "127.0.0.1";

  @JsonMember
  public readonly port: number = 80;

  @JsonMember
  public readonly root: string = "/";

  @JsonMember
  public readonly basePath: string = "/build/lib"; // HACK: Hardcoded parts of the path!

  public get rootUrl(): string {
    return this.protocol
      + "://" + this.hostname
      + ":" + this.port
      + this.root + "/";
  }
}
