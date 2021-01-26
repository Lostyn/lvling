import store from "../store";
import path from "path";
import SettingsValidator from "./settingsValidator";
import CategoryValidator from "./categoryValidator";
import VideoValidator from "./videoValidator";
import { cloneDeep } from "lodash";
import fs from "fs";
import os from "os";

class ManifestManager {
  export() {
    const { dialog } = require("electron").remote;
    dialog.showSaveDialog(
      {
        properties: ["saveFile"],
        filters: [
          {
            name: "json",
            extensions: ["json"],
          },
        ],
      },
      (fileName) => {
        if (!fileName || fileName.length === 0) return;
        var manifest = this.formatManifest();
        fs.writeFile(fileName, JSON.stringify(manifest), () => {
          console.log("writed");
        });
      }
    );
  }

  formatManifest() {
    const project = cloneDeep(store.getState().manifest);
    const manifest = {
      settings: {...project.settings},
      items: project.items.filter( o => o.visible).map( this.formatItem )
    };
    
    this.formatPath(manifest.settings);
    return manifest;
  }

  formatPath = (obj) => {
    if (obj.logo)      obj.logo = path.basename(obj.logo);
    if (obj.panorama)  obj.panorama = path.basename(obj.panorama);

    if (obj.details && obj.details.affiche)   obj.details.affiche = path.basename(obj.details.affiche);

    if (obj.preview)     obj.preview = path.basename(obj.preview);
    if (obj.srt)         obj.srt = path.basename(obj.srt);
    if (obj.url)         obj.url = path.basename(obj.url);

    return obj;
  }

  createManifestFile() {
    return new Promise((resolve) => {
      const manifestPath = path.join(os.tmpdir(), "manifest.json");
      fs.writeFile(manifestPath, JSON.stringify(this.formatManifest()), () => {
        resolve(manifestPath);
      });
    });
  }

  formatItem = (item) => {
    if (item.items) return this.formatCategorie(item);
    else return this.formatVideo(item);
  }

  formatCategorie = (cat) => {
    var isFrame = store.getState().manifest.settings.ui_mode == "Frame";
    
    const {
      framePreview, gridPreview, visible, items, ...other
    } = cat;

    return this.formatPath({
      ...other,
      preview: isFrame ? cat.framePreview : cat.gridPreview,
      items: cat.items.filter(o => o.visible).map(this.formatItem)
    });
  }

  formatVideo = (video) => {
    var isFrame = store.getState().manifest.settings.ui_mode == "Frame";
    
    const {
      framePreview, gridPreview, visible, ...other
    } = video;

    return this.formatPath({
      ...other,
      preview: isFrame ? video.framePreview : video.gridPreview,
    });
  }

  getFilesToCopyFromFlatTree(flatTree) {
    const files = [];

    for (let item of flatTree) {
      if (item.settings) {
        if (item.settings.panorama) {
          files.push({
            from: item.settings.panorama,
            to: "",
          });
        }

        if (item.settings.logo) {
          files.push({
            from: item.settings.logo,
            to: "",
          });
        }
      }
      
      if (item.framePreview) {
        files.push({
          from: item.framePreview,
          to: "",
        });
      }

      if (item.gridPreview) {
        files.push({
          from: item.gridPreview,
          to: "",
        });
      }

      if (item.panorama) {
        files.push({ from: item.panorama, to: "" });
      }

      if (item.url) {
        files.push({ from: item.url, to: "" });
      }

      if (item.srt) {
        files.push({ from: item.srt, to: "" });
      }

      if (item.details && item.details.affiche) {
        files.push({
          from: item.details.affiche,
          to: "",
        });
      }
    }

    return files.map((file) => {
      var fileName = file.from.replace(/^.*[\\\/]/, '');
      return {
        ...file,
        to: `/storage/emulated/0/HFDatas/360/${file.to}${fileName}`,
      };
    });
  }

  getFilesToCopy(copyDisabledContent) {
    const files = [];

    const manifest = cloneDeep(store.getState().manifest);

    if (manifest.settings.panorama) {
      files.push({
        from: manifest.settings.panorama,
        to: "",
      });
    }

    if (manifest.settings.logo) {
      files.push({
        from: manifest.settings.logo,
        to: "",
      });
    }

    this.parseFile(manifest, files, copyDisabledContent);

    return files.map((file) => ({
      ...file,
      to: `/storage/emulated/0/HFDatas/${file.to}`,
    }));
  }

  parseFile(tree, files, copyDisabledContent) {
    if (tree.visible == undefined) {
      tree.visible = true;
    }
    if (tree.visible || (!tree.visible && copyDisabledContent)) {
      if (tree.preview) {
        files.push({
          from: tree.preview,
          to: `${POSTER_PATHS}/`,
        });
      }

      if (tree.panorama) {
        files.push({ from: tree.panorama, to: "" });
      }

      if (tree.url) {
        files.push({ from: tree.url, to: "" });
      }

      if (tree.srt) {
        files.push({ from: tree.srt, to: "" });
      }

      if (tree.details && tree.details.affiche) {
        files.push({
          from: tree.details.affiche,
          to: "",
        });
      }

      if (tree.items) {
        for (let item of tree.items) {
          this.parseFile(item, files, copyDisabledContent);
        }
      }
    }

    return files;
  }

  validate() {
    const manifest = cloneDeep(store.getState().manifest);
    return this.validateNode(manifest);
  }

  validateNode(tree) {
    if (tree.items) {
      let isNodeValid;
      if (tree.settings) {
        isNodeValid = SettingsValidator.validate(tree.settings).isValid;
      } else {
        isNodeValid = CategoryValidator.validate(tree).isValid;
      }
      for (let item of tree.items) {
        isNodeValid = isNodeValid && this.validateNode(item);
      }
      return isNodeValid;
    }
    return VideoValidator.validate(tree).isValid;
  }

  getInvalidNodes() {
    const manifest = cloneDeep(store.getState().manifest);
    const invalids = [];
    this.getInvalidNodeItem(manifest, invalids);
    return invalids;
  }

  getInvalidNodeItem(node, invalids) {
    if (node.items) {
      for (let subNode of node.items) {
        this.getInvalidNodeItem(subNode, invalids);
      }

      if (!node.settings) {
        if (!CategoryValidator.validate(node).isValid) {
          invalids.push(node);
        }
      }
    } else {
      if (!VideoValidator.validate(node).isValid) {
        invalids.push(node);
      }
    }
  }
}

export default new ManifestManager();
