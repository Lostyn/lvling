import * as ActionTypes from "../constants/ActionsConstants";
import storage from "electron-json-storage";
import HYPStorage from "../../utils/HYPStorage";

export const addCategory = (indexes) => ({
  type: ActionTypes.ADD_CATEGORY,
  payload: {
    indexes,
  },
});

export const addVideo = (indexes) => ({
  type: ActionTypes.ADD_VIDEO,
  payload: {
    indexes,
  },
});

export const removeItem = (indexes) => ({
  type: ActionTypes.REMOVE_ITEM,
  payload: {
    indexes,
  },
});

export const setVideoName = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_NAME,
  payload: {
    value,
    indexes,
  },
});

export const setVideoPath = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_PATH,
  payload: {
    value,
    indexes,
  },
});

export const setVideoProjection = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_PROJECTION,
  payload: {
    value,
    indexes,
  },
});

export const setVideoCountry = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_COUNTRY,
  payload: {
    value,
    indexes,
  },
});

export const setVideoDirector = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_DIRECTOR,
  payload: {
    value,
    indexes,
  },
});

export const setVideoOrganization = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_ORGANIZATION,
  payload: {
    value,
    indexes,
  },
});

export const setVideoYear = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_YEAR,
  payload: {
    value,
    indexes,
  },
});

export const setItemVisible = (value, indexes) => ({
  type: ActionTypes.SET_ITEM_VISIBLE,
  payload: {
    value,
    indexes,
  },
});

export const setVideoDuration = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_DURATION,
  payload: {
    value,
    indexes,
  },
});

export const setVideoPoster = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_POSTER,
  payload: {
    value,
    indexes,
  },
});

export const setVideoSynopsis = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_SYNOPSIS,
  payload: {
    value,
    indexes,
  },
});

export const setVideoSubtitles = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_SUBTITLES,
  payload: {
    value,
    indexes,
  },
});

export const setVideoGridPreview = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_GRID_PREVIEW,
  payload: {
    value,
    indexes,
  },
});

export const setVideoFramePreview = (value, indexes) => ({
  type: ActionTypes.SET_VIDEO_FRAME_PREVIEW,
  payload: {
    value,
    indexes,
  },
});

export const setCategoryPanorama = (value, indexes) => ({
  type: ActionTypes.SET_CATEGORY_PANORAMA,
  payload: {
    value,
    indexes,
  },
});

export const setSettingsVRMode = (value) => ({
  type: ActionTypes.SET_SETTING_VR_MODE,
  payload: {
    value,
  },
});

export const setSettingsUIMode = (value) => ({
  type: ActionTypes.SET_SETTING_UI_MODE,
  payload: {
    value,
  },
});

export const setSettingsLogo = (value) => ({
  type: ActionTypes.SET_SETTING_LOGO,
  payload: {
    value,
  },
});

export const setSettingsPanorama = (value) => ({
  type: ActionTypes.SET_SETTING_PANORAMA,
  payload: {
    value,
  },
});

export const setSettingsFrameCount = value => ({
  type: ActionTypes.SET_SETTING_FRAME_COUNT,
  payload: {
    value,
  },
})

export const setManifestItems = (value) => ({
  type: ActionTypes.SET_MANIFEST_ITEMS,
  payload: {
    value,
  },
});

/*
export const setCurrentProjectDataPath = (value) => ({
  type: ActionTypes.SET_CURRENT_PROJECT_DATA_PATH,
  payload: {
    value,
  },
});

const loadStoreFromStorage = ({ fileContents, fileName }) => ({
  type: ActionTypes.LOAD_STORE_FROM_STORAGE,
  payload: {
    fileContents,
    fileName,
  },
});

export function loadFromStorageAsync(fileName, fileContents) {
  return function (dispatch) {
    dispatch(loadStoreFromStorage({ fileContents, fileName }));
  };
}
*/