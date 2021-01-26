import fs from "fs";

const ERRORS = {
  EMPTY_NAME: "Le nom de la vidéo ne peut être vide",
  EMPTY_URL: "L'url de la vidéo est invalide",
  EMPTY_PREVIEW: "Au moins une des deux miniatures doit être rempli/valide",
  INVALID_SRT: "Les sous-titres sont invalides",
  INVALID_POSTER: "L'affiche est invalide",
};

export default class VideoValidator {
  static validate(video) {
    const errors = {};

    if (!video.name || video.name.trim().length === 0) {
      errors["name"] = ERRORS.EMPTY_NAME;
    }

    if (
      !video.url ||
      video.url.trim().length === 0 ||
      !fs.existsSync(video.url)
    ) {
      errors["url"] = ERRORS.EMPTY_URL;
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

    if (video.srt && !fs.existsSync(video.srt)) {
      errors["srt"] = ERRORS.INVALID_SRT;
    }

    if (
      video.details &&
      video.details.affiche &&
      !fs.existsSync(video.details.affiche)
    ) {
      errors["affiche"] = ERRORS.INVALID_POSTER;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
