import * as fs from "fs";
import * as path from "path";

export class FileSystemHelper {

  public static locateFolderOf(filename: string, startpath?: string, searchUp?: boolean): string {
    searchUp = searchUp || true;
    if (!searchUp) { throw new Error("Traversing down the path to locate a file is not supported yet!"); }

    startpath = path.posix.resolve(startpath || __dirname);
    if (startpath.indexOf("/") === 0) { startpath = startpath.substr(1); }

    let pathsegments: string[] = startpath.split("/");

    let resolvedPath = "";
    while (resolvedPath === "" && pathsegments.length > 0) {

      let tmp = path.posix.resolve("/", pathsegments.join("/"), filename);
      try {
        fs.readFileSync(tmp);
        resolvedPath = tmp;
      } catch (error) {
        pathsegments.pop();
      }
    }

    if (resolvedPath === "") {
      throw new Error("Could not locate any file traversing up the path. File [" + filename + "] Path [" + startpath + "]");
    }

    return path.posix.parse(resolvedPath).dir;
  }

  public static locateAndReadFile(filename: string, startpath?: string, searchUp?: boolean): Buffer {
    let libRoot = FileSystemHelper.locateFolderOf(filename, startpath, searchUp);
    let buffer: Buffer = fs.readFileSync(libRoot + "/" + filename);
    return buffer;
  }
}
