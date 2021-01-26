import * as ActionTypes from "../constants/ActionsConstants";

export const defaultManifest = {
  settings: {
    vr_mode: "Gaze",
    ui_mode: "Frame",
    logo: "slogan-menu.png",
    panorama: "background-Hyp02.png",
    frame_count: 4
  },
  items: []
};

export function getCurrentItemFromIndexes(items, indexes) {
  let currentItem = { items };

  for (let index of indexes) {
    currentItem = currentItem.items[index];
  }

  return currentItem;
}

const initialState = defaultManifest;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.OPEN_PROJECT:
      return action.payload.manifest;
    case ActionTypes.NEW_PROJECT:
      return initialState;
    
    case ActionTypes.ADD_CATEGORY: {
      const { indexes } = action.payload;
      const items = [...state.items];
      let currentItem = { items };

      for (let index of indexes) {
        currentItem = currentItem.items[index];
      }

      currentItem.items.push({
        name: "Nouvelle catégorie",
        gridPreview: null,
        framePreview: null,
        panorama: null,
        items: [],
        visible: true,
      });

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.REMOVE_ITEM: {
      const { indexes } = action.payload;
      const items = [...state.items];
      let currentItem = { items };

      for (let index of indexes.slice(0, indexes.length - 1)) {
        currentItem = currentItem.items[index];
      }

      currentItem.items.splice(indexes[indexes.length - 1], 1);

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_NAME: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      currentItem.name = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_PATH: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      currentItem.url = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_PROJECTION: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      currentItem.projection = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_SYNOPSIS: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      if (!currentItem.details) {
        currentItem.details = {};
      }

      currentItem.details.synopsis = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_YEAR: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      if (!currentItem.details) {
        currentItem.details = {};
      }

      currentItem.details.annee = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_ITEM_VISIBLE: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      currentItem.visible = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_POSTER: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      if (!currentItem.details) {
        currentItem.details = {};
      }

      currentItem.details.affiche = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_ORGANIZATION: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      if (!currentItem.details) {
        currentItem.details = {};
      }

      currentItem.details.organisme = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_DURATION: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      if (!currentItem.details) {
        currentItem.details = {};
      }

      currentItem.details.duree = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_DIRECTOR: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      if (!currentItem.details) {
        currentItem.details = {};
      }

      currentItem.details.realisateur = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_COUNTRY: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      if (!currentItem.details) {
        currentItem.details = {};
      }

      currentItem.details.pays = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_SUBTITLES: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      currentItem.srt = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_GRID_PREVIEW: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      currentItem.gridPreview = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_VIDEO_FRAME_PREVIEW: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      currentItem.framePreview = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_CATEGORY_PANORAMA: {
      const { indexes, value } = action.payload;
      const items = [...state.items];
      let currentItem = getCurrentItemFromIndexes(items, indexes);

      currentItem.panorama = value;

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.ADD_VIDEO: {
      const { indexes } = action.payload;
      const items = [...state.items];
      let currentItem = { items };

      for (let index of indexes) {
        currentItem = currentItem.items[index];
      }

      currentItem.items.push({
        name: "Nouvelle vidéo",
        gridPreview: null,
        framePreview: null,
        url: null,
        projection: "mono",
        visible: true,
      });

      return Object.assign({}, state, {
        items
      });
    }
    case ActionTypes.SET_SETTING_VR_MODE: {
      const { value } = action.payload;
      return Object.assign({}, state, {
        settings: {
          ...state.settings,
          vr_mode: value
        }
      });
    }
    case ActionTypes.SET_SETTING_UI_MODE: {
      const { value } = action.payload;
      
      return Object.assign({}, state, {
        settings: {
          ...state.settings,
          ui_mode: value
        }
      });
    }
    case ActionTypes.SET_SETTING_LOGO: {
      const { value } = action.payload;

      return Object.assign({}, state, {
        settings: {
          ...state.settings,
          logo: value
        }
      });
    }
    case ActionTypes.SET_SETTING_PANORAMA: {
      const { value } = action.payload;

      return Object.assign({}, state, {
        settings: {
          ...state.settings,
          panorama: value
        }
      });
    }
    case ActionTypes.SET_SETTING_FRAME_COUNT:
      const { value } = action.payload;
      
      return Object.assign({}, state, {
        settings: {
          ...state.settings,
          frame_count: value
        }
      });
    case ActionTypes.SET_MANIFEST_ITEMS: {
      const { value } = action.payload;
      return Object.assign({}, state, {
        items: value
      });
    }
    default:
      return state;
  }
}
