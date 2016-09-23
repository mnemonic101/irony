import * as ObjectUtils from "underscore";

export class StringMap<V> {
  private data: any = {};

  public has(key: string): boolean {
    return ObjectUtils.has(this.data, key);
  }

  public get(key: string): V {
    return this.data[key];
  }

  public set(key: string, value: V): StringMap<V> {
    this.data[key] = value;
    return this;
  }

  public remove(key: any): V {
    let value: V = this.get(key);
    delete this.data[key];
    return value;
  }

  public keys(): Array<string> {
    return ObjectUtils.keys(this.data);
  }

  public values(): Array<V> {
    return ObjectUtils.values(this.data);
  }

  public clear(): StringMap<V> {
    this.data = {};
    return this;
  }

  public forEach(fn): StringMap<V> {
    ObjectUtils.forEach(this.data, fn);
    return this;
  }

  public size(): number {
    return ObjectUtils.size(this.data);
  }
}

export class Set<V> {
  private data: any = [];

  constructor(data?: Array<V>) {
    if (data) {
      this.data = data;
    }
  }

  public has(value: V): boolean {
    return ObjectUtils.contains(this.data, value);
  }

  public add(value: V): Set<V> {
    if (!this.has(value)) {
      this.data.push(value);
    }
    return this;
  }

  public clear(): Set<V> {
    this.data = [];
    return this;
  }

  public forEach(fn): Set<V> {
    ObjectUtils.forEach(this.data, fn);
    return this;
  }

  public asArray(): Array<V> {
    return ObjectUtils.clone(this.data);
  }
}
