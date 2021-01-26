import fs from "fs";
import path from "path";

export const getAllFiles = (dir) => {
  var stats = fs.statSync(dir);
  if (stats.isFile()) return [dir];

  return fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);
};

export const getFolder = (dir) => {
  return dir.substring(
    0,
    Math.max(dir.lastIndexOf("/"), dir.lastIndexOf("\\"))
  );
};

export const getSize = (path) => {
  var stats = fs.statSync(path);
  return stats.size;
};
