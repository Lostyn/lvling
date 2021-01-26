import fs from "fs";

const ERRORS = {
  INVALID_PANORAMA: "Le panorama est invalide",
  INVALID_LOGO: "Le logo est invalide",
};

export default class SettingsValidator {
  static validate(settings) {
    const errors = {};

    if (!settings.panorama || !fs.existsSync(settings.panorama)) {
      errors["panorama"] = ERRORS.INVALID_PANORAMA;
    }

    if (!settings.logo || !fs.existsSync(settings.logo)) {
      errors["logo"] = ERRORS.INVALID_LOGO;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
