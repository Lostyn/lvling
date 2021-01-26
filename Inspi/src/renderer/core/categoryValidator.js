import fs from "fs";
const ERRORS = {
  EMPTY_NAME: "Le nom de la catégorie ne peut être vide",
  EMPTY_PREVIEW:
    "Au moins une des deux miniatures de la catégorie doit être rempli/valide",
  INVALID_PANORAMA: "Le panorama est invalide",
};

export default class CategoryValidator {
  static validate(video) {
    const errors = {};

    if (!video.name || video.name.trim().length === 0) {
      errors["name"] = ERRORS.EMPTY_NAME;
    }

    if (
      (!video.gridPreview ||
        video.gridPreview.trim().length === 0 ||
        !fs.existsSync(video.gridPreview)) &&
      (!video.framePreview ||
        video.framePreview.trim().length === 0 ||
        !fs.existsSync(video.framePreview))
    ) {
      errors["preview"] = ERRORS.EMPTY_PREVIEW;
    }

    if (video.panorama && !fs.existsSync(video.panorama)) {
      errors["panorama"] = ERRORS.INVALID_PANORAMA;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
