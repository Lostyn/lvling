import { combineReducers } from "redux";
import manifest from "./ManifestReducer";
import devices from "./DeviceReducer";
import app from "./ApplicationReducer";

const reducers = combineReducers({
  manifest,
  devices,
  app
});

export default reducers;
