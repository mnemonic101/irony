import { Provided, Singleton, ConfigurationProvider/*, ProvidedByJson*/ } from "../core/factory";

import { JsonObject, JsonMember } from "typedjson-npm";

@JsonObject
@Singleton
@Provided(new ConfigurationProvider(Package))
// TODO: wrap with @ProvidedByJson
export class Package {

  @JsonMember
  public readonly name: String;

  @JsonMember
  public readonly version: string;

  @JsonMember
  public readonly description: string;

  @JsonMember({ elements: String })
  public readonly keywords: string[];

  @JsonMember
  public readonly homepage: string;

  @JsonMember
  public readonly bugs: { url: string, email: string };

  @JsonMember
  public readonly license: string;

  @JsonMember
  public readonly author: { name: string, email?: string, url?: string };

  @JsonMember({ elements: Object })
  public readonly contributors: { name: string, email?: string, url?: string }[];

  @JsonMember({ elements: String })
  public readonly files: string[];

  @JsonMember
  public readonly main: string;

  @JsonMember
  public readonly directories: { lib: string, bin: string, doc: string, example: string };

  @JsonMember
  public readonly repository: string | { type: string, url: string };

  @JsonMember
  public readonly scripts: {};

  @JsonMember
  public readonly config: {};

  @JsonMember
  public readonly dependencies: {};

  @JsonMember
  public readonly devDependencies: {};

  @JsonMember
  public readonly peerDependencies: {};

  @JsonMember
  public readonly bundledDependencies: {};

  @JsonMember
  public readonly optionalDependencies: {};
}
