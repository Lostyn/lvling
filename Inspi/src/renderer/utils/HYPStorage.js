import fs from "fs";

export default class HYPStorage {
  static get(dataPath) {
    return new Promise((resolve) => {
      fs.readFile(dataPath, "utf-8", (err, data) => {
        if (!err) {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  static set(dataPath, content) {
    return new Promise((resolve) => {
      fs.writeFile(dataPath, JSON.stringify(content), (err, data) => {
        if (!err) {
          resolve();
        }
      });
    });
  }
}
