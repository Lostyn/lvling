//image assets sizes

import imageSize from "image-size";
var path = require("path");

export default {
  PREVIEW_FRAME: {
    extensions: ["jpg"],
    height: 993,
    width: 462,
  },
  PREVIEW_GRID: {
    extensions: ["jpg"],
    height: 280,
    width: 240
  },
  POSTER: {
    extensions: ["png", "jpg"],
    height: 412,
    width: 296,
  },
  PANORAMA: {
    extensions: ["jpg"],
    height: 2048,
    width: 4096,
  },
  SLOGAN: {
    extensions: ["jpg", "png"],
    height: 288,
    width: 288,
  },
  SUBTITLES: {
    extensions: ["srt"],
  },
  VIDEO: {
    extensions: ["mp4"],
  },
};

export const formatContentSizeAndType = (asset) => {
  let resolution = "";

  if (asset.width && asset.height) {
    resolution = `${asset.width}x${asset.height}`;
  }
  return `${resolution} ${asset.extensions.join("/")}`;
};

export const validateFromExtension = (assetPath, assetProperties) =>
  assetProperties.extensions.includes(path.extname(assetPath).replace(".", ""));

export const validateImage = (imagePath, assetProperties) => {
  if (
    assetProperties.width !== undefined &&
    assetProperties.height !== undefined
  ) {
    try {
      const { width, height } = imageSize(imagePath);
      return (
        width === assetProperties.width &&
        height === assetProperties.height &&
        assetProperties.extensions.includes(
          path.extname(imagePath).replace(".", "")
        )
      );
    } catch (e) {
      return false;
    }
  }

  return true;
};
