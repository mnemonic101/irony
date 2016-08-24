import {Provided, Singleton, ConfigurationProvider/*, ProvidedByJson*/} from "../core/factory";

import {JsonObject, JsonMember} from "typedjson";

@JsonObject
@Singleton
@Provided(new ConfigurationProvider(Package))
// TODO: wrap with @ProvidedByJson
export class Package {

  private _name: string;
  public get name(): string {
    return this._name;
  }
  @JsonMember
  public set name(v: string) {
    this._name = v;
  }

  private _version: string;
  public get version(): string {
    return this._version;
  }
  @JsonMember
  public set version(v: string) {
    this._version = v;
  }

  private _description: string;
  public get description(): string {
    return this._description;
  }
  @JsonMember
  public set description(v: string) {
    this._description = v;
  }

  // TODO: make arrays work with typedjson
  /*private _keywords: string[];
  public get keywords(): string[] {
    return this._keywords;
  }
  @JsonMember
  public set keywords(v: string[]) {
    this._keywords = v;
  }*/

  private _homepage: string;
  public get homepage(): string {
    return this._homepage;
  }
  @JsonMember
  public set homepage(v: string) {
    this._homepage = v;
  }

  private _bugs: { url: string, email: string };
  public get bugs(): { url: string, email: string } {
    return this._bugs;
  }
  @JsonMember
  public set bugs(v: { url: string, email: string }) {
    this._bugs = v;
  }

  private _license: string;
  public get license(): string {
    return this._license;
  }
  @JsonMember
  public set license(v: string) {
    this._license = v;
  }

  private _author: { name: string, email?: string, url?: string };
  public get author(): { name: string, email?: string, url?: string } {
    return this._author;
  }
  @JsonMember
  public set author(v: { name: string, email?: string, url?: string }) {
    this._author = v;
  }

  // TODO: make arrays work with typedjson
  /*private _contributors: { name: string, email?: string, url?: string }[];
  public get contributors(): { name: string, email?: string, url?: string }[] {
    return this._contributors;
  }
  @JsonMember
  public set contributors(v: { name: string, email?: string, url?: string }[]) {
    this._contributors = v;
  }*/

  // TODO: make arrays work with typedjson
  /*private _files: string[];
  public get files(): string[] {
    return this._files;
  }
  @JsonMember
  public set files(v: string[]) {
    this._files = v;
  }*/

  private _main: string;
  public get main(): string {
    return this._main;
  }
  @JsonMember
  public set main(v: string) {
    this._main = v;
  }

  private _directories: { lib: string, bin: string, doc: string, example: string };
  public get directories(): { lib: string, bin: string, doc: string, example: string } {
    return this._directories;
  }
  @JsonMember
  public set directories(v: { lib: string, bin: string, doc: string, example: string }) {
    this._directories = v;
  }

  private _repository: string | { type: string, url: string };
  public get repository(): string | { type: string, url: string } {
    return this._repository;
  }
  @JsonMember
  public set repository(v: string | { type: string, url: string }) {
    this._repository = v;
  }

  private _scripts: {};
  public get scripts(): {} {
    return this._scripts;
  }
  @JsonMember
  public set scripts(v: {}) {
    this._scripts = v;
  }

  private _config: {};
  public get config(): {} {
    return this._config;
  }
  @JsonMember
  public set config(v: {}) {
    this._config = v;
  }

  private _dependencies: {};
  public get dependencies(): {} {
    return this._dependencies;
  }
  @JsonMember
  public set dependencies(v: {}) {
    this._dependencies = v;
  }

  private _devDependencies: {};
  public get devDependencies(): {} {
    return this._devDependencies;
  }
  @JsonMember
  public set devDependencies(v: {}) {
    this._devDependencies = v;
  }

  private _peerDependencies: {};
  public get peerDependencies(): {} {
    return this._peerDependencies;
  }
  @JsonMember
  public set peerDependencies(v: {}) {
    this._peerDependencies = v;
  }

  private _bundledDependencies: {};
  public get bundledDependencies(): {} {
    return this._bundledDependencies;
  }
  @JsonMember
  public set bundledDependencies(v: {}) {
    this._bundledDependencies = v;
  }

  private _optionalDependencies: {};
  public get optionalDependencies(): {} {
    return this._optionalDependencies;
  }
  @JsonMember
  public set optionalDependencies(v: {}) {
    this._optionalDependencies = v;
  }
}
