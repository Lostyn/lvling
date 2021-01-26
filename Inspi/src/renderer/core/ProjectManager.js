import HYPEventEmitter from "../utils/HYPEventEmitter";
import fs from "fs";
import store from "../store";
import { openProject, createProject } from "../store/actions/AppActionCreator";

const { dialog } = require("electron").remote;
export const ProjectManagerEvent = {
  PROJECT_OPENED: "PROJECT_OPENED",
  PROJECT_CREATED: "PROJECT_CREATED",
};

class ProjectService extends HYPEventEmitter {
  constructor() {
    super();
  }

  projectExist = path => fs.existsSync(path);

  openProjectFromPath = (path) => {
    return new Promise( resolve => {
      if (this.projectExist(path)) {
        fs.readFile(path, "utf-8", (err, data) => {
          const fileContents = JSON.parse(data);
          store.dispatch(openProject(fileContents, path));
          resolve();
        });
      }
    });
  }
  //open scenario from a .cgu file
  openProject = () => {
    return new Promise( resolve => {
      dialog.showOpenDialog(
        {
          properties: ["openFile"],
          filters: [
            {
              name: "kioskvr",
              extensions: ["kioskvr"],
            },
          ],
        },
        (fileName) => {
          if (!fileName || fileName.length === 0) return;
          fs.readFile(fileName[0], "utf-8", (err, data) => {
            const fileContents = JSON.parse(data);
            store.dispatch(openProject(fileContents, fileName[0]));
            resolve();
          });
        }
      );
    });
  }

  //create a blank scenario
  createProject = () => {
    return new Promise( resolve => {
      dialog.showSaveDialog(
        {
          properties: ["saveFile"],
          filters: [
            {
              name: "kioskvr",
              extensions: ["kioskvr"],
            },
          ],
        },
        (fileName) => {
          if (!fileName || fileName.length === 0) return;
          store.dispatch(createProject(fileName));
          resolve();
        }
      );
    });
  }
}

export default new ProjectService();
